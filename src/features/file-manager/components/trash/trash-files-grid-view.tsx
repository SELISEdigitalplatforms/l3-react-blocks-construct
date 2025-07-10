/* eslint-disable @typescript-eslint/no-empty-function */
import { useTranslation } from 'react-i18next';
import { DateRange } from '../../types/file-manager.type';
import {
  getFileTypeIcon,
  getFileTypeInfo,
  IFileTrashData,
  PaginationState,
} from '../../utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';
import { useCallback, useEffect, useState } from 'react';
import { TrashTableRowActions } from './trash-files-row-actions';
import { TrashDetailsSheet } from './trash-files-details';
import { CommonGridView } from '../common-grid-view';
import { Trash2 } from 'lucide-react';
import { useMockTrashFilesQuery } from '../../hooks/use-mock-trash-files-query';

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
}

export const TrashGridView: React.FC<TrashGridViewProps> = (props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

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
        />
      );
    },
    [props]
  );

  const renderDetailsSheet = useCallback(
    (file: IFileTrashData | null, isOpen: boolean, onClose: () => void) => (
      <TrashDetailsSheet
        isOpen={isOpen}
        onClose={onClose}
        file={
          file
            ? {
                ...file,
                lastModified: file.trashedDate ?? new Date(file.trashedDate ?? Date.now()),
                isShared: file.isShared ?? false,
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
        icon: Trash2,
        title: t('TRASH_EMPTY'),
        description:
          props.filters.name ||
          props.filters.fileType ||
          props.filters.deletedBy ||
          props.filters.trashedDate
            ? t('NO_FILES_MATCH_CRITERIA')
            : t('NO_DELETED_FILES'),
      }}
      sectionLabels={{
        folder: t('FOLDER'),
        file: t('FILE'),
      }}
      errorMessage={t('ERROR_LOADING_FILES')}
      loadingMessage={t('LOADING')}
      loadMoreLabel={t('LOAD_MORE')}
      processFiles={processFiles}
      filterFiles={filterFiles} // CRITICAL: Make sure this is included
    />
  );
};
