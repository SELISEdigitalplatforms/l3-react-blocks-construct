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
import { SharedFilesListViewProps } from '../../types/file-manager.type';
import { RegularFileDetailsSheet } from '../regular-file-details-sheet';
import { CommonGridView } from '../common-grid-view';
import { SharedFilters } from '../../types/header-toolbar.type';

const SharedFileGridView: React.FC<SharedFilesListViewProps> = (props) => {
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
    filter: {
      name: props.filters.name ?? '',
      fileType: props.filters.fileType,
      sharedBy: props.filters.sharedBy,
      sharedDateFrom: props.filters.sharedDate?.from?.toISOString(),
      sharedDateTo: props.filters.sharedDate?.to?.toISOString(),
      modifiedDateFrom: props.filters.modifiedDate?.from?.toISOString(),
      modifiedDateTo: props.filters.modifiedDate?.to?.toISOString(),
    },
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

  // Helper function to enhance files with sharing data
  const enhanceWithSharingData = useCallback(
    (file: IFileDataWithSharing) => ({
      ...file,
      sharedWith: props.fileSharedUsers?.[file.id] || file.sharedWith || [],
      sharePermissions: props.filePermissions?.[file.id] || file.sharePermissions || {},
    }),
    [props.fileSharedUsers, props.filePermissions]
  );

  const processFiles = useCallback(
    (files: IFileDataWithSharing[]) => {
      const existingFiles = files || [];

      // Process server files with renamed versions
      const processedServerFiles = existingFiles.map((file) => {
        const renamedVersion = props.renamedFiles?.get(file.id);
        const baseFile = renamedVersion || file;
        return enhanceWithSharingData(baseFile);
      });

      // Filter out files that exist in new files/folders
      const newFileIds = new Set([
        ...(props.newFiles?.map((f) => f.id) || []),
        ...(props.newFolders?.map((f) => f.id) || []),
      ]);
      const filteredServerFiles = processedServerFiles.filter((file) => !newFileIds.has(file.id));

      // Enhance new files and folders
      const enhancedNewFiles = (props.newFiles || []).map(enhanceWithSharingData);
      const enhancedNewFolders = (props.newFolders || []).map(enhanceWithSharingData);

      return [...enhancedNewFolders, ...enhancedNewFiles, ...filteredServerFiles];
    },
    [props.newFiles, props.newFolders, props.renamedFiles, enhanceWithSharingData]
  );

  // Helper function for filter validation
  const validateFilter = useCallback((file: IFileDataWithSharing, filters: SharedFilters) => {
    if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.fileType && file.fileType !== filters.fileType) {
      return false;
    }
    if (filters.sharedBy && file.sharedBy?.id !== filters.sharedBy) {
      return false;
    }
    // Add date filtering logic here if needed
    return true;
  }, []);

  const filterFiles = useCallback(
    (files: IFileDataWithSharing[], filters: Record<string, any>) => {
      const sharedFilters = filters as SharedFilters;
      return files.filter((file) => validateFilter(file, sharedFilters));
    },
    [validateFilter]
  );

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
          onMove={props.onMove}
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
                    : (file.lastModified?.toISOString?.() ?? file.lastModified ?? ''),
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

export default SharedFileGridView;
