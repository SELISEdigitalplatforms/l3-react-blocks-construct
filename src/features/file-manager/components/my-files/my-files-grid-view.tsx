/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder } from 'lucide-react';
import { useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import {
  getFileTypeIcon,
  getFileTypeInfo,
  IFileDataWithSharing,
  PaginationState,
} from 'features/file-manager/utils/file-manager';
import { FileTableRowActions } from '../file-manager-row-actions';
import { useIsMobile } from 'hooks/use-mobile';
import { RegularFileDetailsSheet } from '../regular-file-details-sheet';
import { CommonGridView } from '../common-grid-view';
import { MyFileGridViewProps } from '../../types/file-manager.type';

const MyFileGridView: React.FC<MyFileGridViewProps> = (props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: isMobile ? 20 : 50,
    totalCount: 0,
  });

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: props.filters,
  };

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      setPaginationState((prev) => ({
        ...prev,
        totalCount: data.totalCount,
      }));
    }
  }, [data?.totalCount]);

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [props.filters]);

  const handleLoadMore = useCallback(() => {
    if (data && data.data.length < data.totalCount) {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
    }
  }, [data]);

  const processFiles = useCallback(
    (files: IFileDataWithSharing[]) => {
      const existingFiles = files || [];
      const processedServerFiles = existingFiles.map((file) => {
        const renamedVersion = props.renamedFiles?.get(file.id);
        const baseFile = renamedVersion || file;

        return {
          ...baseFile,
          sharedWith: props.fileSharedUsers?.[file.id] || baseFile.sharedWith || [],
          sharePermissions: props.filePermissions?.[file.id] || baseFile.sharePermissions || {},
        };
      });

      const newFileIds = new Set([
        ...(props.newFiles?.map((f) => f.id) || []),
        ...(props.newFolders?.map((f) => f.id) || []),
      ]);
      const filteredServerFiles = processedServerFiles.filter((file) => !newFileIds.has(file.id));

      const enhancedNewFiles = (props.newFiles || []).map((file) => ({
        ...file,
        sharedWith: props.fileSharedUsers?.[file.id] || file.sharedWith || [],
        sharePermissions: props.filePermissions?.[file.id] || file.sharePermissions || {},
      }));

      const enhancedNewFolders = (props.newFolders || []).map((folder) => ({
        ...folder,
        sharedWith: props.fileSharedUsers?.[folder.id] || folder.sharedWith || [],
        sharePermissions: props.filePermissions?.[folder.id] || folder.sharePermissions || {},
      }));

      return [...enhancedNewFolders, ...enhancedNewFiles, ...filteredServerFiles];
    },
    [
      props.newFiles,
      props.newFolders,
      props.renamedFiles,
      props.fileSharedUsers,
      props.filePermissions,
    ]
  );

  const filterFiles = useCallback((files: IFileDataWithSharing[], filters: any) => {
    return files.filter((file) => {
      const matchesName =
        !filters.name || file.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesType = !filters.fileType || file.fileType === filters.fileType;
      return matchesName && matchesType;
    });
  }, []);

  const renderActions = useCallback(
    (file: IFileDataWithSharing) => {
      const mockRow = {
        original: file,
        id: file.id.toString(),
        index: 0,
        getValue: () => {},
        getVisibleCells: () => [],
        getAllCells: () => [],
        getLeftVisibleCells: () => [],
        getRightVisibleCells: () => [],
        getCenterVisibleCells: () => [],
      } as any;

      return (
        <FileTableRowActions
          row={mockRow}
          onViewDetails={props.onViewDetails || (() => {})}
          onDownload={props.onDownload}
          onShare={props.onShare}
          onDelete={props.onDelete}
          onRename={props.onRename}
        />
      );
    },
    [props]
  );

  const renderDetailsSheet = useCallback(
    (file: IFileDataWithSharing | null, isOpen: boolean, onClose: () => void) => (
      <RegularFileDetailsSheet
        isOpen={isOpen}
        onClose={onClose}
        file={
          file
            ? {
                ...file,
                isShared: file.isShared ?? false,
                lastModified:
                  typeof file.lastModified === 'string'
                    ? file.lastModified
                    : file.lastModified.toISOString(),
              }
            : null
        }
        t={t}
      />
    ),
    [t]
  );

  return (
    <CommonGridView
      onViewDetails={props.onViewDetails}
      filters={props.filters}
      data={data ?? undefined}
      isLoading={isLoading}
      error={error}
      onLoadMore={handleLoadMore}
      renderDetailsSheet={renderDetailsSheet}
      getFileTypeIcon={getFileTypeIcon}
      getFileTypeInfo={getFileTypeInfo}
      renderActions={renderActions}
      emptyStateConfig={{
        icon: Folder,
        title: t('NO_FILES_FOUND'),
        description: t('NO_FILES_UPLOADED_YET'),
      }}
      sectionLabels={{
        folder: t('FOLDER'),
        file: t('FILE'),
      }}
      errorMessage={t('ERROR_LOADING_FILES')}
      loadingMessage={t('LOADING')}
      loadMoreLabel={t('LOAD_MORE')}
      processFiles={processFiles}
      filterFiles={filterFiles}
    />
  );
};
export default MyFileGridView;
