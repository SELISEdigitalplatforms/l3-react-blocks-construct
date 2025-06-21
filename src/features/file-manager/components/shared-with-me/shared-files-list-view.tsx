/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IFileData, useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import { createFileTableColumns } from '../my-files/my-files-table-columns';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import FileDetailsSheet from '../my-files/my-files-details';
import { SharedFilesListViewProps } from '../../types/file-manager.type';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

const SharedFilesListView: React.FC<SharedFilesListViewProps> = ({
  onViewDetails,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onRename,
  filters,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileData | null>(null);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const queryParams = useMemo(() => {
    const normalizedSharedBy = filters.sharedBy
      ? Array.isArray(filters.sharedBy)
        ? filters.sharedBy
        : [filters.sharedBy]
      : undefined;

    return {
      page: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      filter: {
        name: filters.name || undefined,
        fileType: filters.fileType || undefined,
        sharedBy: normalizedSharedBy,
        sharedDate: filters.sharedDate || undefined,
        modifiedDate: filters.modifiedDate || undefined,
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

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

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

  const handleViewDetailsWrapper = useCallback(
    (file: IFileData) => {
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

  const handleDownloadWrapper = () => undefined;

  const handleShareWrapper = useCallback(
    (file: IFileData) => {
      setSelectedFile(file);
      onShare(file);
    },
    [onShare]
  );

  const handleDeleteWrapper = useCallback(
    (file: IFileData) => {
      setSelectedFile(file);
      onDelete(file);
    },
    [onDelete]
  );

  const handleOpenWrapper = useCallback(
    (file: IFileData) => {
      handleViewDetailsWrapper(file);
    },
    [handleViewDetailsWrapper]
  );

  const columns = useMemo(() => {
    return createFileTableColumns({
      onViewDetails: handleViewDetailsWrapper,
      onDownload: handleDownloadWrapper,
      onShare: handleShareWrapper,
      onDelete: handleDeleteWrapper,
      onMove: onMove,
      onCopy: onCopy,
      onOpen: handleOpenWrapper,
      onRename: onRename,
      t,
    });
  }, [
    handleViewDetailsWrapper,
    handleShareWrapper,
    handleDeleteWrapper,
    onMove,
    onCopy,
    handleOpenWrapper,
    onRename,
    t,
  ]);

  const displayData = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return data.data.filter((file: IFileData) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }

      if (filters.sharedBy) {
        const sharedById = file.sharedBy?.id;
        if (!sharedById) {
          return false;
        }

        if (Array.isArray(filters.sharedBy)) {
          if (filters.sharedBy.length === 0) {
            return true;
          }
          return filters.sharedBy.includes(sharedById);
        } else {
          return filters.sharedBy === sharedById;
        }
      }

      if (filters.sharedDate?.from || filters.sharedDate?.to) {
        const sharedDate = file.sharedDate;
        if (!sharedDate) return false;

        if (filters.sharedDate.from && sharedDate < filters.sharedDate.from) {
          return false;
        }
        if (filters.sharedDate.to) {
          const endOfDay = new Date(filters.sharedDate.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (sharedDate > endOfDay) {
            return false;
          }
        }
      }

      if (filters.modifiedDate?.from || filters.modifiedDate?.to) {
        const modifiedDate = file.lastModified;
        if (!modifiedDate) return false;

        if (filters.modifiedDate.from && modifiedDate < filters.modifiedDate.from) {
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
    });
  }, [
    data?.data,
    filters.name,
    filters.fileType,
    filters.sharedBy,
    filters.sharedDate,
    filters.modifiedDate,
  ]);

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
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

      <FileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={selectedFile}
        t={t}
      />
    </div>
  );
};

export default SharedFilesListView;
