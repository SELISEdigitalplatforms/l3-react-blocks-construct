/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import { IFileTrashData, PaginationState } from '../../utils/file-manager';
import { TrashTableColumns } from './trash-files-table-columns';
import { TrashDetailsSheet } from './trash-files-details';
import { useMockTrashFilesQuery } from '../../hooks/use-mock-trash-files-query';

interface TrashFilesListViewProps {
  onRestore: (file: IFileTrashData) => void;
  onDelete: (file: IFileTrashData) => void;
  filters: {
    name?: string;
    fileType?: string;
    trashedDate?: {
      from?: Date;
      to?: Date;
    };
  };
  deletedItemIds?: Set<string>;
  restoredItemIds?: Set<string>;
}

export const TrashFilesListView: React.FC<TrashFilesListViewProps> = ({
  onRestore,
  onDelete,
  filters,
  deletedItemIds = new Set(),
  restoredItemIds = new Set(),
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileTrashData | null>(null);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const allowedFileTypes = useMemo(
    () => ['Folder', 'File', 'Image', 'Audio', 'Video'] as const,
    []
  );
  type AllowedFileType = (typeof allowedFileTypes)[number];

  const queryParams = useMemo(() => {
    return {
      page: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      filter: {
        name: filters.name ?? undefined,
        fileType: allowedFileTypes.includes(filters.fileType as AllowedFileType)
          ? (filters.fileType as AllowedFileType)
          : undefined,
        deletedDate: filters.trashedDate ?? undefined,
      },
    };
  }, [
    paginationState.pageIndex,
    paginationState.pageSize,
    filters.name,
    filters.fileType,
    filters.trashedDate,
    allowedFileTypes,
  ]);

  const { data, isLoading, error } = useMockTrashFilesQuery(queryParams);

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
  }, [filters]);

  const handleViewDetailsWrapper = useCallback((file: IFileTrashData) => {
    setSelectedFile(file);
    setIsDetailsOpen(true);
  }, []);

  const handleRestoreWrapper = useCallback(
    (file: IFileTrashData) => {
      setSelectedFile(file);
      onRestore(file);
    },
    [onRestore]
  );

  const handleDeleteWrapper = useCallback(
    (file: IFileTrashData) => {
      setSelectedFile(file);
      onDelete(file);
    },
    [onDelete]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  const columns = useMemo(() => {
    return TrashTableColumns({
      onRestore: handleRestoreWrapper,
      onDelete: handleDeleteWrapper,
      t,
    });
  }, [handleRestoreWrapper, handleDeleteWrapper, t]);

  // Enhanced display data with client-side date filtering
  const displayData = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return data.data.filter((file: IFileTrashData) => {
      // Filter out deleted and restored items
      if (deletedItemIds.has(file.id)) {
        return false;
      }
      if (restoredItemIds.has(file.id)) {
        return false;
      }

      // Apply date range filtering
      if (filters.trashedDate) {
        const fileDate = new Date(file.trashedDate);
        const { from, to } = filters.trashedDate;

        if (from && fileDate < from) {
          return false;
        }
        if (to && fileDate > to) {
          return false;
        }
      }

      return true;
    });
  }, [data?.data, deletedItemIds, restoredItemIds, filters.trashedDate]);

  const paginationProps = useMemo(() => {
    return {
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      totalCount: displayData.length, // Use filtered data count for accurate pagination
      manualPagination: false, // Changed to false since we're doing client-side filtering
    };
  }, [displayData.length, paginationState]);

  // Paginate the filtered data client-side
  const paginatedData = useMemo(() => {
    const startIndex = paginationState.pageIndex * paginationState.pageSize;
    const endIndex = startIndex + paginationState.pageSize;
    return displayData.slice(startIndex, endIndex);
  }, [displayData, paginationState.pageIndex, paginationState.pageSize]);

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_TRASH_FILES')}</div>;
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
              data={paginatedData}
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

      <TrashDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={
          selectedFile
            ? {
                ...selectedFile,
                lastModified:
                  selectedFile.trashedDate ?? new Date(selectedFile.trashedDate ?? Date.now()),
                isShared: selectedFile.isShared ?? false,
              }
            : null
        }
        t={t}
      />
    </div>
  );
};
