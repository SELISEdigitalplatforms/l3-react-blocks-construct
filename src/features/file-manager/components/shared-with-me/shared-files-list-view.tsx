/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import { SharedFilesListViewProps } from '../../types/file-manager.type';
import { SharedFileTableColumns } from './shared-files-table-columns';
import { IFileDataWithSharing, PaginationState } from '../../utils/file-manager';
import { RegularFileDetailsSheet } from '../regular-file-details-sheet';

const SharedFilesListView: React.FC<SharedFilesListViewProps> = ({
  onViewDetails,
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
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

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
    };
  }, [
    paginationState.pageIndex,
    paginationState.pageSize,
    filters.name,
    filters.fileType,
    filters.sharedBy,
    filters.sharedDate,
    filters.modifiedDate,
  ]);

  const localFiles = useMemo(() => {
    const enhancedNewFiles = newFiles.map((file) => ({
      ...file,
      sharedWith: fileSharedUsers[file.id] || file.sharedWith || [],
      sharePermissions: filePermissions[file.id] || file.sharePermissions || {},
    }));

    const enhancedNewFolders = newFolders.map((folder) => ({
      ...folder,
      sharedWith: fileSharedUsers[folder.id] || folder.sharedWith || [],
      sharePermissions: filePermissions[folder.id] || folder.sharePermissions || {},
    }));

    return [...enhancedNewFiles, ...enhancedNewFolders];
  }, [newFiles, newFolders, fileSharedUsers, filePermissions]);

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  const combinedData = useMemo(() => {
    const serverFiles = data?.data || [];

    const processedServerFiles = serverFiles.map((file: any) => {
      const renamedVersion = renamedFiles.get(file.id);
      const baseFile = renamedVersion || file;

      const enhancedFile: IFileDataWithSharing = {
        ...baseFile,
        sharedWith: fileSharedUsers[file.id] || baseFile.sharedWith || [],
        sharePermissions: filePermissions[file.id] || baseFile.sharePermissions || {},
      };

      return enhancedFile;
    });

    const filteredLocalFiles = localFiles.filter((file) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }
      return true;
    });

    const filteredServerFiles = processedServerFiles.filter((file: IFileDataWithSharing) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }
      return true;
    });

    const localFileIds = new Set(filteredLocalFiles.map((f) => f.id));
    const uniqueServerFiles = filteredServerFiles.filter((f) => !localFileIds.has(f.id));

    return [...filteredLocalFiles, ...uniqueServerFiles];
  }, [localFiles, data?.data, filters, renamedFiles, fileSharedUsers, filePermissions]);

  const isNameMatch = (file: IFileDataWithSharing, nameFilter: string): boolean => {
    if (!nameFilter) return true;
    return file.name.toLowerCase().includes(nameFilter.toLowerCase());
  };

  const isFileTypeMatch = (file: IFileDataWithSharing, fileTypeFilter: string): boolean => {
    if (!fileTypeFilter) return true;
    return file.fileType === fileTypeFilter;
  };

  const isSharedByMatch = (file: IFileDataWithSharing, sharedByFilter: any): boolean => {
    if (!sharedByFilter) return true;

    const sharedById = file.sharedBy?.id;
    if (!sharedById) return false;

    if (Array.isArray(sharedByFilter)) {
      return sharedByFilter.length === 0 || sharedByFilter.includes(sharedById);
    }

    return sharedByFilter === sharedById;
  };

  const createEndOfDay = (date: Date): Date => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  };

  const isDateInRange = (fileDate: Date | null, dateRange: { from?: Date; to?: Date }): boolean => {
    if (!dateRange?.from && !dateRange?.to) return true;
    if (!fileDate) return false;

    if (dateRange.from && fileDate < dateRange.from) return false;
    if (dateRange.to && fileDate > createEndOfDay(dateRange.to)) return false;

    return true;
  };

  const isSharedDateMatch = (
    file: IFileDataWithSharing,
    sharedDateFilter: { from?: Date; to?: Date }
  ): boolean => {
    return isDateInRange(file.sharedDate ?? null, sharedDateFilter);
  };

  const isModifiedDateMatch = (
    file: IFileDataWithSharing,
    modifiedDateFilter: { from?: Date; to?: Date }
  ): boolean => {
    return isDateInRange(file.lastModified ?? null, modifiedDateFilter);
  };

  const displayData = useMemo(() => {
    return combinedData.filter((file: IFileDataWithSharing) => {
      return (
        isNameMatch(file, filters.name ?? '') &&
        isFileTypeMatch(file, filters.fileType ?? '') &&
        isSharedByMatch(file, filters.sharedBy) &&
        isSharedDateMatch(file, filters.sharedDate ?? {}) &&
        isModifiedDateMatch(file, filters.modifiedDate ?? {})
      );
    });
  }, [
    combinedData,
    filters.fileType,
    filters.modifiedDate,
    filters.name,
    filters.sharedBy,
    filters.sharedDate,
    isModifiedDateMatch,
    isSharedDateMatch,
  ]);

  const paginationProps = useMemo(() => {
    const hasClientFiltering = displayData.length !== combinedData.length;

    if (hasClientFiltering) {
      return {
        pageIndex: paginationState.pageIndex,
        pageSize: paginationState.pageSize,
        totalCount: displayData.length,
        manualPagination: false,
      };
    } else {
      return {
        pageIndex: paginationState.pageIndex,
        pageSize: paginationState.pageSize,
        totalCount: paginationState.totalCount,
        manualPagination: true,
      };
    }
  }, [displayData.length, combinedData.length, paginationState]);

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

  const handleViewDetailsWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      setSelectedFile(file);
      setIsDetailsOpen(true);
      onViewDetails(file);
    },
    [onViewDetails]
  );

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
      onViewDetails: handleViewDetailsWrapper,
      onDownload: handleDownloadWrapper,
      onShare: handleShareWrapper,
      onDelete: handleDeleteWrapper,
      onMove: onMove,
      onRename: handleRenameWrapper,
      onCopy: onCopy,
      onOpen: handleViewDetailsWrapper,
      t,
    });
  }, [
    handleViewDetailsWrapper,
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
  }, [filters]);

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  const shouldHideMainContent = isMobile && isDetailsOpen;

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          <div className="h-full flex-col flex w-full gap-6 md:gap-8">
            <DataTable
              data={displayData}
              columns={columns}
              onRowClick={handleViewDetailsWrapper}
              isLoading={isLoading}
              pagination={{
                pageIndex: paginationProps.pageIndex,
                pageSize: paginationProps.pageSize,
                totalCount: paginationProps.totalCount,
              }}
              onPaginationChange={handlePaginationChange}
              manualPagination={paginationProps.manualPagination}
              mobileColumns={['name']}
              expandable={true}
            />
          </div>
        </div>
      )}

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

export default SharedFilesListView;
