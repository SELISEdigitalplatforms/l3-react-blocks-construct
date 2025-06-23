/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Button } from 'components/ui/button';
import {
  getFileTypeIcon,
  getFileTypeInfo,
  IFileTrashData,
  PaginationState,
} from '../../utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';
import { useMockTrashFilesQuery } from '../../hooks/use-mock-files-query';
import { TrashTableRowActions } from './trash-files-row-actions';
import { DateRange } from '../../types/file-manager.type';
import { TrashDetailsSheet } from './trash-files-details';

interface TrashCardProps {
  file: IFileTrashData;
  onRestore?: (file: IFileTrashData) => void;
  onPermanentDelete?: (file: IFileTrashData) => void;
  onViewDetails?: (file: IFileTrashData) => void;
}

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

const TrashCard: React.FC<TrashCardProps> = ({
  file,
  onRestore,
  onPermanentDelete,
  onViewDetails,
}) => {
  const IconComponent = getFileTypeIcon(file.fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

  const isFolder = file.fileType === 'Folder';

  const handleCardClick = (e: React.MouseEvent) => {
    // Only handle click if it's not from an interactive child element
    const target = e.target as HTMLElement;
    const isActionButton = target.closest('[data-action-button="true"]');

    if (!isActionButton) {
      e.preventDefault();
      onViewDetails?.(file);
    }
  };

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

  const containerClasses =
    'group relative bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer';
  const contentClasses = isFolder
    ? 'p-3 flex items-center space-x-3'
    : 'p-6 flex flex-col items-center text-center space-y-4';

  const iconContainerClasses = `${isFolder ? 'w-8 h-8' : 'w-20 h-20'} flex items-center justify-center ${isFolder ? backgroundColor : ''}`;
  const iconClasses = `${isFolder ? 'w-5 h-5' : 'w-10 h-10'} ${iconColor}`;

  const renderFolderLayout = () => (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
          {file.name}
        </h3>
      </div>
      <div
        data-action-button="true"
        className="flex-shrink-0"
        role="region"
        aria-label="File actions"
      >
        <TrashTableRowActions
          row={mockRow}
          onRestore={onRestore ?? (() => {})}
          onDelete={onPermanentDelete ?? (() => {})}
        />
      </div>
    </div>
  );

  const renderFileLayout = () => (
    <div className="flex items-center justify-between space-x-2 mt-2">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${backgroundColor}`}>
          <IconComponent className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
            {file.name}
          </h3>
        </div>
      </div>
      <div
        data-action-button="true"
        className="flex-shrink-0"
        role="region"
        aria-label="File actions"
      >
        <TrashTableRowActions
          row={mockRow}
          onRestore={onRestore ?? (() => {})}
          onDelete={onPermanentDelete ?? (() => {})}
        />
      </div>
    </div>
  );

  return (
    <div
      className={containerClasses}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e as any);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${file.name}`}
    >
      <div className={contentClasses}>
        <div className={iconContainerClasses}>
          <IconComponent className={iconClasses} />
        </div>
        <div className={isFolder ? 'flex-1' : 'w-full'}>
          {isFolder ? renderFolderLayout() : renderFileLayout()}
        </div>
      </div>
    </div>
  );
};

const TrashGridView: React.FC<TrashGridViewProps> = ({
  onRestore,
  onPermanentDelete,
  onViewDetails,
  filters,
  deletedItemIds = new Set(),
  restoredItemIds = new Set(),
  selectedItems = [],
  onSelectionChange,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

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
      name: filters.name ?? '',
      fileType: allowedFileTypes.includes(filters.fileType as AllowedFileType)
        ? (filters.fileType as AllowedFileType)
        : undefined,
      deletedBy: filters.deletedBy,
      trashedDateFrom: filters.trashedDate?.from?.toISOString(),
      trashedDateTo: filters.trashedDate?.to?.toISOString(),
    },
  };

  const { data, isLoading, error } = useMockTrashFilesQuery(queryParams);

  const filteredFiles = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((file) => {
      const fileId = file.id.toString();
      return !deletedItemIds.has(fileId) && !restoredItemIds.has(fileId);
    });
  }, [data?.data, deletedItemIds, restoredItemIds]);

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      const adjustedCount = data.totalCount - deletedItemIds.size - restoredItemIds.size;
      setPaginationState((prev) => ({
        ...prev,
        totalCount: Math.max(0, adjustedCount),
      }));
    }
  }, [data?.totalCount, deletedItemIds.size, restoredItemIds.size]);

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters]);

  const handleLoadMore = useCallback(() => {
    if (
      data &&
      filteredFiles.length < data.totalCount - deletedItemIds.size - restoredItemIds.size
    ) {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
    }
  }, [data, filteredFiles.length, deletedItemIds.size, restoredItemIds.size]);

  const handleViewDetails = useCallback(
    (file: IFileTrashData) => {
      setSelectedFile(file);
      setIsDetailsOpen(true);
      onViewDetails?.(file);
    },
    [onViewDetails]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  const handleRestore = useCallback(
    (file: IFileTrashData) => {
      onRestore?.(file);
      if (onSelectionChange && selectedItems.includes(file.id.toString())) {
        onSelectionChange(selectedItems.filter((id) => id !== file.id.toString()));
      }
    },
    [onRestore, onSelectionChange, selectedItems]
  );

  const handlePermanentDelete = useCallback(
    (file: IFileTrashData) => {
      onPermanentDelete?.(file);
      if (onSelectionChange && selectedItems.includes(file.id.toString())) {
        onSelectionChange(selectedItems.filter((id) => id !== file.id.toString()));
      }
      if (selectedFile?.id === file.id) {
        handleCloseDetails();
      }
    },
    [onPermanentDelete, onSelectionChange, selectedItems, selectedFile?.id, handleCloseDetails]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">{t('ERROR_LOADING_FILES')}</p>
        </div>
      </div>
    );
  }

  if (isLoading && !filteredFiles.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('LOADING')}</p>
        </div>
      </div>
    );
  }

  const folders = filteredFiles.filter((file) => file.fileType === 'Folder');
  const regularFiles = filteredFiles.filter((file) => file.fileType !== 'Folder');

  return (
    <div className="flex h-full w-full">
      <div className={`flex flex-col h-full ${isDetailsOpen ? 'flex-1' : 'w-full'}`}>
        <div className="flex-1">
          <div className="space-y-8">
            {folders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded">
                  {t('FOLDER')}
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {folders.map((file) => (
                    <TrashCard
                      key={file.id}
                      file={file}
                      onViewDetails={handleViewDetails}
                      onRestore={handleRestore}
                      onPermanentDelete={handlePermanentDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {regularFiles.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded">{t('FILE')}</h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {regularFiles.map((file) => (
                    <TrashCard
                      key={file.id}
                      file={file}
                      onViewDetails={handleViewDetails}
                      onRestore={handleRestore}
                      onPermanentDelete={handlePermanentDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredFiles.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Trash2 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('TRASH_EMPTY')}</h3>
                <p className="text-gray-500 max-w-sm">
                  {filters.name || filters.fileType || filters.deletedBy || filters.trashedDate
                    ? t('NO_FILES_MATCH_CRITERIA')
                    : t('NO_DELETED_FILES')}
                </p>
              </div>
            )}

            {data &&
              filteredFiles.length <
                data.totalCount - deletedItemIds.size - restoredItemIds.size && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    disabled={isLoading}
                    className="min-w-32"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        {t('LOADING')}
                      </div>
                    ) : (
                      t('LOAD_MORE')
                    )}
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>

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

export default TrashGridView;
