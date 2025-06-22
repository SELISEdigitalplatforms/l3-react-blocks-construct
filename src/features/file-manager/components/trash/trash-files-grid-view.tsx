/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Trash2 } from 'lucide-react';
import { Button } from 'components/ui/button';
import { getFileTypeIcon, getFileTypeInfo, IFileTrashData } from '../../utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';
import { useMockTrashFilesQuery } from '../../hooks/use-mock-files-query';
import { formatDate } from 'utils/custom-date';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

interface DateRange {
  from?: Date;
  to?: Date;
}

interface TrashCardProps {
  file: IFileTrashData;
  onRestore?: (file: IFileTrashData) => void;
  onPermanentDelete?: (file: IFileTrashData) => void;
  onViewDetails?: (file: IFileTrashData) => void;
  t: (key: string) => string;
}

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

const TrashCard: React.FC<TrashCardProps> = ({
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

  return (
    <div
      className="group relative bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div
        className={`${file.fileType === 'Folder' ? 'p-3 flex items-center space-x-3' : 'p-6 flex flex-col items-center text-center space-y-4'}`}
      >
        <div
          className={`${file.fileType === 'Folder' ? 'w-8 h-8' : 'w-20 h-20'} flex items-center ${file.fileType === 'Folder' ? `${backgroundColor}` : ''} justify-center`}
        >
          <IconComponent
            className={`${file.fileType === 'Folder' ? 'w-5 h-5' : 'w-10 h-10'} ${iconColor}`}
          />
        </div>

        <div className={`${file.fileType === 'Folder' ? 'flex-1' : 'w-full'}`}>
          {file.fileType === 'Folder' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-green-50"
                    onClick={handleRestore}
                    title={t('RESTORE')}
                  >
                    <RotateCcw className="w-3 h-3 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-50"
                    onClick={handlePermanentDelete}
                    title={t('DELETE')}
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{file.size}</span>
                {file.isShared && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {t('SHARED')}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {t('TRASHED')} {formatDate(file.trashedDate)}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between space-x-2 mt-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${backgroundColor}`}
                  >
                    <IconComponent className={`w-4 h-4 ${iconColor}`} />
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
                    <p className="text-xs text-gray-500 mt-1">
                      {t('TRASHED')} {formatDate(file.trashedDate)}
                    </p>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-green-50"
                    onClick={handleRestore}
                    title={t('RESTORE')}
                  >
                    <RotateCcw className="w-3 h-3 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-50"
                    onClick={handlePermanentDelete}
                    title={t('DELETE')}
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          )}
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
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleViewDetails = useCallback(
    (file: IFileTrashData) => {
      setSelectedFile(file);
      setIsDetailsOpen(true);
      onViewDetails?.(file);
    },
    [onViewDetails]
  );

  //   const handleCloseDetails = useCallback(() => {
  //     setIsDetailsOpen(false);
  //     setSelectedFile(null);
  //   }, []);

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
    <div className="flex h-full w-full">
      <div className={`flex flex-col h-full ${isDetailsOpen ? 'flex-1' : 'w-full'}`}>
        <div className="flex-1">
          <div className="space-y-8">
            {folders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded flex items-center gap-2">
                  {t('FOLDER')}
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {folders.length}
                  </span>
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {folders.map((file) => (
                    <TrashCard
                      key={file.id}
                      file={file}
                      onViewDetails={handleViewDetails}
                      onRestore={onRestore}
                      onPermanentDelete={onPermanentDelete}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {regularFiles.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded flex items-center gap-2">
                  {t('FILE')}
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {regularFiles.length}
                  </span>
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {regularFiles.map((file) => (
                    <TrashCard
                      key={file.id}
                      file={file}
                      onViewDetails={handleViewDetails}
                      onRestore={onRestore}
                      onPermanentDelete={onPermanentDelete}
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
                  {hasActiveFilters ? t('NO_FILES_MATCH_CRITERIA') : t('TRASH_EMPTY')}
                </h3>
                <p className="text-gray-500 max-w-sm">
                  {hasActiveFilters
                    ? t('TRY_ADJUSTING_FILTERS_OR_SEARCH_TERMS')
                    : t('NO_DELETED_FILES')}
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
      {/* 
      <TrashDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={selectedFile}
        t={t}
      /> */}
    </div>
  );
};

export default TrashGridView;
