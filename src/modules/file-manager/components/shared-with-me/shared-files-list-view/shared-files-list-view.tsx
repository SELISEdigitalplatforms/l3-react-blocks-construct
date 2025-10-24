/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMockFilesQuery } from '@/modules/file-manager/hooks/use-mock-files-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { DataTable } from '@/components/core';
import {
  IFileDataWithSharing,
  PaginationState,
  SharedUser,
} from '@/modules/file-manager/utils/file-manager';
import { SharedFileTableColumns } from '../shared-files-table-columns/shared-files-table-columns';
import { FilePreview } from '../../file-preview/file-preview';
import { RegularFileDetailsSheet } from '../../regular-file-details-sheet/regular-file-details-sheet';
import { IFileData } from '@/modules/file-manager/types/file-manager.type';
import { SharedFilters } from '@/modules/file-manager/types/header-toolbar.type';
import {
  enhanceNewEntries,
  enhanceFileWithSharing,
  mergeUniqueById,
} from '@/modules/file-manager/utils/list-view-utils';

export interface SharedFilesListViewProps {
  onDownload: ((file: IFileData) => void) | undefined;
  onViewDetails: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onOpen: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: SharedFilters;
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
}

export const SharedFilesListView = ({
  onShare,
  onDelete,
  onMove,
  onCopy,
  onRename,
  filters,
  newFiles = [],
  newFolders = [],
  renamedFiles = new Map(),
  fileSharedUsers = {},
  filePermissions = {},
  currentFolderId,
  onNavigateToFolder,
}: Readonly<SharedFilesListViewProps>) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileDataWithSharing | null>(null);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const queryParams = useMemo(() => {
    let normalizedSharedBy;

    if (!filters.sharedBy) {
      normalizedSharedBy = undefined;
    } else if (Array.isArray(filters.sharedBy)) {
      normalizedSharedBy = filters.sharedBy;
    } else {
      normalizedSharedBy = [filters.sharedBy];
    }

    return {
      page: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      filter: {
        name: filters.name ?? undefined,
        fileType: filters.fileType ?? undefined,
        sharedBy: normalizedSharedBy,
        sharedDate: filters.sharedDate ?? undefined,
        modifiedDate: filters.modifiedDate ?? undefined,
      },
      folderId: currentFolderId,
    };
  }, [
    paginationState.pageIndex,
    paginationState.pageSize,
    filters.name,
    filters.fileType,
    filters.sharedBy,
    filters.sharedDate,
    filters.modifiedDate,
    currentFolderId,
  ]);

  const localFiles = useMemo(() => {
    return enhanceNewEntries(newFiles, newFolders, fileSharedUsers, filePermissions);
  }, [newFiles, newFolders, fileSharedUsers, filePermissions]);

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  const matchesTypeAndModified = useCallback(
    (file: IFileDataWithSharing) => {
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }

      if (filters.modifiedDate?.from || filters.modifiedDate?.to) {
        const modifiedDate = file.lastModified ? new Date(file.lastModified) : null;
        if (!modifiedDate) return false;

        if (filters.modifiedDate.from && modifiedDate < new Date(filters.modifiedDate.from)) {
          return false;
        }
        if (filters.modifiedDate.to) {
          const endOfDay = new Date(filters.modifiedDate.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (modifiedDate > endOfDay) {
            return false;
          }
        }
      }

      return true;
    },
    [filters.fileType, filters.modifiedDate]
  );

  const combinedData = useMemo(() => {
    const serverFiles = data?.data || [];

    const processedServerFiles = serverFiles.map((file: any) => {
      const renamedVersion = renamedFiles.get(file.id);
      const baseFile = renamedVersion || file;
      return enhanceFileWithSharing(baseFile, fileSharedUsers, filePermissions);
    });

    const filteredLocalFiles = localFiles.filter(matchesTypeAndModified);

    const filteredServerFiles = processedServerFiles.filter(matchesTypeAndModified);

    return mergeUniqueById(filteredLocalFiles, filteredServerFiles);
  }, [
    localFiles,
    data?.data,
    filters,
    renamedFiles,
    fileSharedUsers,
    filePermissions,
    matchesTypeAndModified,
  ]);

  const paginationProps = useMemo(
    () => ({
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      totalCount: paginationState.totalCount,
      manualPagination: true,
    }),
    [paginationState]
  );

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    []
  );

  const handleRowClick = useCallback(
    (file: IFileDataWithSharing) => {
      if (file.fileType === 'Folder' && onNavigateToFolder) {
        onNavigateToFolder(file.id);
      } else {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    },
    [onNavigateToFolder]
  );

  const handleViewDetails = useCallback((file: IFileDataWithSharing) => {
    setSelectedFile(file);
    setIsDetailsOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  const handleDownloadWrapper = useCallback(() => undefined, []);

  const handleShareWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      setSelectedFile(file);
      onShare(file);
    },
    [onShare]
  );

  const handleDeleteWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      setSelectedFile(file);
      onDelete(file);
    },
    [onDelete]
  );

  const handleRenameWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      onRename(file);
    },
    [onRename]
  );

  const columns = useMemo(() => {
    return SharedFileTableColumns({
      onViewDetails: handleViewDetails,
      onDownload: handleDownloadWrapper,
      onShare: handleShareWrapper,
      onDelete: handleDeleteWrapper,
      onMove: onMove,
      onRename: handleRenameWrapper,
      onCopy: onCopy,
      onOpen: handleViewDetails,
      t,
    });
  }, [
    handleViewDetails,
    handleDownloadWrapper,
    handleShareWrapper,
    handleDeleteWrapper,
    onMove,
    handleRenameWrapper,
    onCopy,
    t,
  ]);

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      setPaginationState((prev) => ({
        ...prev,
        totalCount: data.totalCount + localFiles.length,
      }));
    }
  }, [data?.totalCount, localFiles.length]);

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters, currentFolderId]);

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  const shouldHideMainContent = isMobile && (isDetailsOpen || isPreviewOpen);

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-150 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          <div className="h-full flex-col flex w-full gap-6 md:gap-8">
            <DataTable
              data={combinedData}
              columns={columns}
              onRowClick={handleRowClick}
              isLoading={isLoading}
              pagination={{
                pageIndex: paginationProps.pageIndex,
                pageSize: paginationProps.pageSize,
                totalCount: paginationProps.totalCount,
              }}
              onPaginationChange={handlePaginationChange}
              manualPagination={paginationProps.manualPagination}
              mobileColumns={['name']}
              expandable={false}
            />
          </div>
        </div>
      )}

      <FilePreview file={selectedFile} isOpen={isPreviewOpen} onClose={handleClosePreview} />

      <RegularFileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={
          selectedFile
            ? {
                ...selectedFile,
                lastModified:
                  typeof selectedFile.lastModified === 'string'
                    ? selectedFile.lastModified
                    : (selectedFile.lastModified?.toISOString?.() ?? ''),
                isShared: selectedFile.isShared ?? false,
              }
            : null
        }
        t={t}
      />
    </div>
  );
};
