/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useCallback } from 'react';
import { Folder } from 'lucide-react';
import { getFileTypeIcon, getFileTypeInfo } from 'features/file-manager/utils/file-manager';

import {
  IFileData,
  mockFileData,
  useMockFilesQuery,
} from 'features/file-manager/hooks/use-mock-files-query';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from 'hooks/use-mobile';
import { Button } from 'components/ui/button';
import { FileTableRowActions } from 'features/file-manager/components/file-table-row-actions';

export const mockFiles: IFileData[] = mockFileData;

interface FileCardProps {
  file: IFileData;
  onViewDetails?: (file: IFileData) => void;
  onDownload?: (file: IFileData) => void;
  onShare?: (file: IFileData) => void;
  onDelete?: (file: IFileData) => void;
  onMove?: (file: IFileData) => void;
  onCopy?: (file: IFileData) => void;
  onOpen?: (file: IFileData) => void;
  onRename?: (file: IFileData) => void;
  t: (key: string) => string;
}

interface FileGridViewProps {
  onViewDetails?: (file: IFileData) => void;
  onDownload?: (file: IFileData) => void;
  onShare?: (file: IFileData) => void;
  onDelete?: (file: IFileData) => void;
  onMove?: (file: IFileData) => void;
  onCopy?: (file: IFileData) => void;
  onOpen?: (file: IFileData) => void;
  onRename?: (file: IFileData) => void;
  searchQuery?: string;
  filters?: {
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onMove,
  onOpen,
  onRename,
}) => {
  const IconComponent = getFileTypeIcon(file.fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (file.fileType === 'Folder') {
      onOpen?.(file);
    } else {
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

  return (
    <div
      className="group relative bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div
        className={`${file.fileType === 'Folder' ? 'p-3 flex items-center space-x-3' : 'p-6 flex flex-col items-center text-center space-y-4'}`}
      >
        <div
          className={`${file.fileType === 'Folder' ? 'w-8 h-8' : 'w-16 h-16'} flex items-center ${file.fileType === 'Folder' ? `${backgroundColor}` : ''}  justify-center`}
        >
          <IconComponent
            className={`${file.fileType === 'Folder' ? 'w-5 h-5' : 'w-8 h-8'} ${iconColor}`}
          />
        </div>

        <div className={`${file.fileType === 'Folder' ? 'flex-1' : 'w-full'}`}>
          {file.fileType === 'Folder' ? (
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </h3>
              <div onClick={(e) => e.stopPropagation()}>
                <FileTableRowActions
                  row={mockRow}
                  onViewDetails={onViewDetails || (() => {})}
                  onDownload={onDownload}
                  onShare={onShare}
                  onDelete={onDelete}
                  onMove={onMove}
                  onRename={onRename}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between space-x-2 mt-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${backgroundColor}`}
                >
                  <IconComponent className={`w-4 h-4 ${iconColor}`} />
                </div>
                <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </h3>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <FileTableRowActions
                  row={mockRow}
                  onViewDetails={onViewDetails || (() => {})}
                  onDownload={onDownload}
                  onShare={onShare}
                  onDelete={onDelete}
                  onMove={onMove}
                  onRename={onRename}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileGridView: React.FC<FileGridViewProps> = ({
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onOpen,
  onRename,
  searchQuery = '',
  filters = { name: '', fileType: undefined },
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: isMobile ? 20 : 50,
    totalCount: 0,
  });

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: {
      ...filters,
      name: searchQuery || filters.name,
    },
  };

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

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
  }, [searchQuery, filters]);

  const handleLoadMore = useCallback(() => {
    if (data && data.data.length < data.totalCount) {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
    }
  }, [data]);

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

  const files = data?.data || [];
  const folders = files.filter((file) => file.fileType === 'Folder');
  const regularFiles = files.filter((file) => file.fileType !== 'Folder');

  return (
    <div className="">
      <div className="space-y-8">
        {folders.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-gray-600 mb-4  py-2 rounded">{t('FOLDER')}</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              {folders.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onViewDetails={onViewDetails}
                  onDownload={onDownload}
                  onShare={onShare}
                  onDelete={onDelete}
                  onMove={onMove}
                  onCopy={onCopy}
                  onOpen={onOpen}
                  onRename={onRename}
                  t={t}
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
                <FileCard
                  key={file.id}
                  file={file}
                  onViewDetails={onViewDetails}
                  onDownload={onDownload}
                  onShare={onShare}
                  onDelete={onDelete}
                  onMove={onMove}
                  onCopy={onCopy}
                  onOpen={onOpen}
                  onRename={onRename}
                  t={t}
                />
              ))}
            </div>
          </div>
        )}

        {files.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Folder className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('NO_FILES_FOUND')}</h3>
            <p className="text-gray-500 max-w-sm">
              {searchQuery || filters.name || filters.fileType
                ? t('NO_FILES_MATCH_CRITERIA')
                : t('NO_FILES_UPLOADED_YET')}
            </p>
          </div>
        )}

        {data && data.data.length < data.totalCount && (
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
  );
};

export default FileGridView;
