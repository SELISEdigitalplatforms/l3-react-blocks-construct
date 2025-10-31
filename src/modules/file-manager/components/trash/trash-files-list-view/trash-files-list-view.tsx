/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { DataTable } from '@/components/core';
import { IFileTrashData, PaginationState } from '../../../utils/file-manager';
import { useMockTrashFilesQuery } from '../../../hooks/use-mock-trash-files-query';
import { FilePreview } from '../../file-preview/file-preview';
import { TrashTableColumns } from '../trash-files-table-columns/trash-files-table-columns';
import { TrashDetailsSheet } from '../trash-files-details/trash-files-details';

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
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
}

export const TrashFilesListView = ({
  onRestore,
  onDelete,
  filters,
  deletedItemIds = new Set(),
  restoredItemIds = new Set(),
  currentFolderId,
  onNavigateToFolder,
}: Readonly<TrashFilesListViewProps>) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
      folderId: currentFolderId,
    };
  }, [
    paginationState.pageIndex,
    paginationState.pageSize,
    filters.name,
    filters.fileType,
    filters.trashedDate,
    allowedFileTypes,
    currentFolderId,
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
  }, [filters, currentFolderId]);

  const handleRowClick = useCallback(
    (file: IFileTrashData) => {
      if (file.fileType === 'Folder' && onNavigateToFolder) {
        onNavigateToFolder(file.id);
      } else {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    },
    [onNavigateToFolder]
  );

  const handleViewDetails = useCallback((file: IFileTrashData) => {
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

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  const columns = useMemo(() => {
    return TrashTableColumns({
      onRestore: handleRestoreWrapper,
      onDelete: handleDeleteWrapper,
      onViewDetails: handleViewDetails,
      t,
    });
  }, [handleRestoreWrapper, handleDeleteWrapper, handleViewDetails, t]);

  const displayData = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return data.data.filter((file: IFileTrashData) => {
      if (deletedItemIds.has(file.id)) {
        return false;
      }
      if (restoredItemIds.has(file.id)) {
        return false;
      }
      return true;
    });
  }, [data?.data, deletedItemIds, restoredItemIds]);

  const paginationProps = useMemo(() => {
    return {
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      totalCount: data?.totalCount ?? 0,
      manualPagination: true,
    };
  }, [data?.totalCount, paginationState]);

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_TRASH_FILES')}</div>;
  }

  const shouldHideMainContent = isMobile && (isDetailsOpen || isPreviewOpen);

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
