/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Trash2 } from 'lucide-react';
import { Button } from 'components/ui/button';
import { getFileTypeIcon, getFileTypeInfo, IFileTrashData } from '../../utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';
import { useMockTrashFilesQuery } from '../../hooks/use-mock-files-query';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}
interface DateRange {
  from?: Date;
  to?: Date;
}

interface TrashFileCardProps {
  file: IFileTrashData;
  onRestore?: (file: IFileTrashData) => void;
  onPermanentDelete?: (file: IFileTrashData) => void;
  onViewDetails?: (file: IFileTrashData) => void;
  t: (key: string) => string;
}
// TrashFileCard component
const TrashFileCard: React.FC<TrashFileCardProps> = ({
  file,
  onRestore,
  onPermanentDelete,
  onViewDetails,
  t,
}) => {
  const IconComponent = getFileTypeIcon(file.fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewDetails?.(file);
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore?.(file);
  };

  const handlePermanentDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPermanentDelete?.(file);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
        {/* File Icon and Info */}
        <div className="flex items-start space-x-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${backgroundColor}`}
          >
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">{file.size}</span>
              {file.isShared && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {t('SHARED')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Trashed Date */}
        <div className="mb-3">
          <p className="text-xs text-gray-500">
            {t('TRASHED')} {formatDate(file.trashedDate)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between space-x-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={handleRestore}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            {t('RESTORE')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handlePermanentDelete}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            {t('DELETE')}
          </Button>
        </div>
      </div>

      {/* Hover overlay for better interaction feedback */}
      <div className="absolute inset-0 rounded-lg bg-gray-50 opacity-0 group-hover:opacity-5 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
};

interface TrashGridViewProps {
  onRestore?: (file: IFileTrashData) => void;
  onDelete?: (file: IFileTrashData) => void;
  onPermanentDelete?: (file: IFileTrashData) => void;
  onViewDetails?: (file: IFileTrashData) => void;
  filters: {
    name?: string;
    fileType?: string;
    deletedBy?: string;
    trashedDate?: DateRange;
  };
}

const TrashGridView: React.FC<TrashGridViewProps> = ({
  onRestore,
  onPermanentDelete,
  onViewDetails,
  filters,
}) => {
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
      name: filters.name || '',
      fileType: allowedFileTypes.includes(filters.fileType as AllowedFileType)
        ? (filters.fileType as AllowedFileType)
        : undefined,
      deletedBy: filters.deletedBy,
      trashedDateFrom: filters.trashedDate?.from?.toISOString(),
      trashedDateTo: filters.trashedDate?.to?.toISOString(),
    },
  };

  const { data, isLoading, error } = useMockTrashFilesQuery(queryParams);

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

  const handleLoadMore = useCallback(() => {
    if (data && data.data.length < data.totalCount) {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
    }
  }, [data]);

  const applyClientSideFilters = useCallback(
    (files: IFileTrashData[]) => {
      return files.filter((file) => {
        if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }

        if (filters.fileType && file.fileType !== filters.fileType) {
          return false;
        }

        if (filters.trashedDate?.from || filters.trashedDate?.to) {
          const trashedDate = new Date(file.trashedDate);

          if (filters.trashedDate.from && trashedDate < filters.trashedDate.from) {
            return false;
          }

          if (filters.trashedDate.to && trashedDate > filters.trashedDate.to) {
            return false;
          }
        }

        return true;
      });
    },
    [filters]
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

  if (isLoading && !data?.data?.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('LOADING')}</p>
        </div>
      </div>
    );
  }

  const rawFiles = data?.data || [];
  const filteredFiles = applyClientSideFilters(rawFiles);

  const folders = filteredFiles.filter((file) => file.fileType === 'Folder');
  const regularFiles = filteredFiles.filter((file) => file.fileType !== 'Folder');

  const hasActiveFilters =
    filters.name ||
    filters.fileType ||
    filters.deletedBy ||
    filters.trashedDate?.from ||
    filters.trashedDate?.to;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8 p-4">
          {folders.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded flex items-center gap-2">
                {t('FOLDERS')}
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{folders.length}</span>
              </h2>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {folders.map((file) => (
                  <TrashFileCard
                    key={file.id}
                    file={file}
                    onRestore={onRestore}
                    onPermanentDelete={onPermanentDelete}
                    onViewDetails={onViewDetails}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )}

          {regularFiles.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded flex items-center gap-2">
                {t('FILES')}
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {regularFiles.length}
                </span>
              </h2>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {regularFiles.map((file) => (
                  <TrashFileCard
                    key={file.id}
                    file={file}
                    onRestore={onRestore}
                    onPermanentDelete={onPermanentDelete}
                    onViewDetails={onViewDetails}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredFiles.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Trash2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters ? t('NO_FILES_MATCH_CRITERIA') : t('TRASH_IS_EMPTY')}
              </h3>
              <p className="text-gray-500 max-w-sm">
                {hasActiveFilters
                  ? t('TRY_ADJUSTING_FILTERS_OR_SEARCH_TERMS')
                  : t('DELETED_FILES_WILL_APPEAR_HERE')}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={() => {}}>
                  {t('CLEAR_ALL_FILTERS')}
                </Button>
              )}
            </div>
          )}

          {data && rawFiles.length < data.totalCount && (
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
                  <>
                    {t('LOAD_MORE')}
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {rawFiles.length} / {data.totalCount}
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}

          {hasActiveFilters && filteredFiles.length > 0 && (
            <div className="flex justify-center pt-4">
              <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                {t('SHOWING')} {filteredFiles.length} {t('OF')} {rawFiles.length} {t('FILES')}
                {rawFiles.length < (data?.totalCount ?? 0) &&
                  ` (${data?.totalCount ?? 0} ${t('TOTAL')})`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashGridView;
