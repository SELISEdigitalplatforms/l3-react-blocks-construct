/* eslint-disable @typescript-eslint/no-empty-function */
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { DateRange } from '../../../types/file-manager.type';
import {
  getFileTypeIcon,
  getFileTypeInfo,
  IFileTrashData,
  PaginationState,
} from '../../../utils/file-manager';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useEffect, useState } from 'react';
import { CommonGridView } from '../../common-grid-view/common-grid-view';
import { useMockTrashFilesQuery } from '../../../hooks/use-mock-trash-files-query';
import { FilePreview } from '../../file-preview/file-preview';
import { TrashDetailsSheet } from '../trash-files-details/trash-files-details';
import { TrashTableRowActions } from '../trash-files-row-actions/trash-files-row-actions';

interface TrashGridViewProps {
  onRestore?: (file: IFileTrashData) => void;
  readonly onPermanentDelete?: (file: IFileTrashData) => void;
  onViewDetails?: (file: IFileTrashData) => void;
  filters: {
    name?: string;
    fileType?: string;
    deletedBy?: string;
    trashedDate?: DateRange;
  };
  deletedItemIds?: Set<string>;
  restoredItemIds?: Set<string>;
  readonly selectedItems?: string[];
  readonly onSelectionChange?: (items: string[]) => void;
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
}

export const TrashGridView = (props: Readonly<TrashGridViewProps>) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileTrashData | null>(null);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: isMobile ? 20 : 50,
    totalCount: 0,
  });

  const allowedFileTypes = ['Folder', 'File', 'Image', 'Audio', 'Video'] as const;
  type AllowedFileType = (typeof allowedFileTypes)[number];

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: {
      name: props.filters.name ?? '',
      fileType: allowedFileTypes.includes(props.filters.fileType as AllowedFileType)
        ? (props.filters.fileType as AllowedFileType)
        : undefined,
      deletedBy: props.filters.deletedBy,
      trashedDateFrom: props.filters.trashedDate?.from?.toISOString(),
      trashedDateTo: props.filters.trashedDate?.to?.toISOString(),
    },
    folderId: props.currentFolderId,
  };

  const { data, isLoading, error } = useMockTrashFilesQuery(queryParams);

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      const adjustedCount =
        data.totalCount - (props.deletedItemIds?.size ?? 0) - (props.restoredItemIds?.size ?? 0);
      setPaginationState((prev) => ({
        ...prev,
        totalCount: Math.max(0, adjustedCount),
      }));
    }
  }, [data?.totalCount, props.deletedItemIds?.size, props.restoredItemIds?.size]);

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [props.filters, props.currentFolderId]);

  const handleLoadMore = useCallback(() => {
    if (data && data.data.length < data.totalCount) {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
    }
  }, [data]);

  const processFiles = useCallback(
    (files: IFileTrashData[]) => {
      if (!files) return [];

      const processed = files.filter((file) => {
        const fileId = file.id.toString();
        const isDeleted = props.deletedItemIds?.has(fileId);
        const isRestored = props.restoredItemIds?.has(fileId);
        return !isDeleted && !isRestored;
      });

      return processed;
    },
    [props.deletedItemIds, props.restoredItemIds]
  );

  const filterFiles = useCallback((files: IFileTrashData[], filters: any) => {
    if (!files || files.length === 0) return [];

    const filtered = files.filter((file) => {
      const matchesName =
        !filters.name || file.name.toLowerCase().includes(filters.name.toLowerCase());

      const matchesType = !filters.fileType || file.fileType === filters.fileType;

      let matchesDate = true;
      if (filters.trashedDate?.from || filters.trashedDate?.to) {
        const trashedDate = new Date(file.trashedDate);

        if (isNaN(trashedDate.getTime())) {
          console.warn('Invalid trashed date for file:', file.name, file.trashedDate);
          return false;
        }

        if (filters.trashedDate.from) {
          const fromDate = new Date(filters.trashedDate.from);
          fromDate.setHours(0, 0, 0, 0);
          const compareTrashedDate = new Date(trashedDate);
          compareTrashedDate.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && compareTrashedDate >= fromDate;
        }

        if (filters.trashedDate.to) {
          const toDate = new Date(filters.trashedDate.to);
          toDate.setHours(23, 59, 59, 999);
          const compareTrashedDate = new Date(trashedDate);
          compareTrashedDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && compareTrashedDate <= toDate;
        }
      }

      const result = matchesName && matchesType && matchesDate;

      return result;
    });

    return filtered;
  }, []);

  const handleViewDetails = useCallback(
    (file: IFileTrashData) => {
      if (file.fileType === 'Folder' && props.onNavigateToFolder) {
        props.onNavigateToFolder(file.id);
      } else {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    },
    [props]
  );

  const handleOpenDetails = useCallback((file: IFileTrashData) => {
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

  const renderActions = useCallback(
    (file: IFileTrashData) => {
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

      const handleRestore = (fileToRestore: IFileTrashData) => {
        props.onRestore?.(fileToRestore);
        if (props.onSelectionChange && props.selectedItems?.includes(fileToRestore.id.toString())) {
          props.onSelectionChange(
            props.selectedItems.filter((id) => id !== fileToRestore.id.toString())
          );
        }
      };

      const handlePermanentDelete = (fileToDelete: IFileTrashData) => {
        props.onPermanentDelete?.(fileToDelete);
        if (props.onSelectionChange && props.selectedItems?.includes(fileToDelete.id.toString())) {
          props.onSelectionChange(
            props.selectedItems.filter((id) => id !== fileToDelete.id.toString())
          );
        }
      };

      return (
        <TrashTableRowActions
          row={mockRow}
          onRestore={handleRestore}
          onDelete={handlePermanentDelete}
          onViewDetails={handleOpenDetails}
        />
      );
    },
    [props, handleOpenDetails]
  );

  const getEmptyStateMessage = () => {
    if (props.filters.trashedDate) {
      return t('NO_FILES_MATCH_CRITERIA');
    }

    if (props.currentFolderId) {
      return t('FOLDER_IS_EMPTY');
    }

    return t('NO_DELETED_FILES');
  };

  const shouldHideMainContent = isMobile && (isDetailsOpen || isPreviewOpen);

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          <CommonGridView
            onViewDetails={handleViewDetails}
            filters={props.filters}
            data={data ?? undefined}
            isLoading={isLoading}
            error={error}
            onLoadMore={handleLoadMore}
            renderDetailsSheet={() => null}
            getFileTypeIcon={getFileTypeIcon}
            getFileTypeInfo={getFileTypeInfo}
            renderActions={renderActions}
            emptyStateConfig={{
              icon: Trash2,
              title: t('TRASH_EMPTY'),
              description:
                props.filters.name ??
                props.filters.fileType ??
                props.filters.deletedBy ??
                getEmptyStateMessage(),
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
            currentFolderId={props.currentFolderId}
            onNavigateToFolder={props.onNavigateToFolder}
          />
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
