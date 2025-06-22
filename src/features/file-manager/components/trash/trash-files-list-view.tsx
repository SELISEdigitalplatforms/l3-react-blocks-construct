/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import { IFileTrashData } from '../../utils/file-manager';
import { useMockTrashFilesQuery } from '../../hooks/use-mock-files-query';
import { TrashTableColumns } from './trash-files-table-columns';
import TrashDetailsSheet from './trash-files-details';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

interface TrashFilesListViewProps {
  onRestore: (file: IFileTrashData) => void;
  onDelete: (file: IFileTrashData) => void;
  filters: {
    name?: string;
    fileType?: string;
    deletedDate?: {
      from?: Date;
      to?: Date;
    };
  };
}

export const TrashFilesListView: React.FC<TrashFilesListViewProps> = ({
  onRestore,
  onDelete,
  filters,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allowedFileTypes = ['Folder', 'File', 'Image', 'Audio', 'Video'] as const;
  type AllowedFileType = (typeof allowedFileTypes)[number];

  const queryParams = useMemo(() => {
    return {
      page: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      filter: {
        name: filters.name || undefined,
        fileType: allowedFileTypes.includes(filters.fileType as AllowedFileType)
          ? (filters.fileType as AllowedFileType)
          : undefined,
        deletedDate: filters.deletedDate || undefined,
      },
    };
  }, [
    paginationState.pageIndex,
    paginationState.pageSize,
    filters.name,
    filters.fileType,
    filters.deletedDate,
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

  const displayData = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return data.data.filter((file: IFileTrashData) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }

      if (filters.deletedDate?.from || filters.deletedDate?.to) {
        const deletedDate = file.trashedDate;
        if (!deletedDate) return false;

        if (filters.deletedDate.from && deletedDate < filters.deletedDate.from) {
          return false;
        }
        if (filters.deletedDate.to) {
          const endOfDay = new Date(filters.deletedDate.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (deletedDate > endOfDay) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data?.data, filters.name, filters.fileType, filters.deletedDate]);

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_TRASH_FILES')}</div>;
  }

  const shouldHideMainContent = isMobile && isDetailsOpen;

  const paginationProps = useMemo(() => {
    const hasClientFiltering = displayData.length !== (data?.data?.length || 0);

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
  }, [displayData.length, data?.data?.length, paginationState]);

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

      <TrashDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={
          selectedFile
            ? {
                ...selectedFile,
                lastModified:
                  selectedFile.trashedDate ?? new Date(selectedFile.trashedDate ?? Date.now()),
              }
            : null
        }
        t={t}
      />
    </div>
  );
};

export default TrashFilesListView;
