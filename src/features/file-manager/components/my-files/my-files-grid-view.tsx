/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder } from 'lucide-react';
import { IFileData, useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import {
  getFileTypeIcon,
  getFileTypeInfo,
  IFileDataWithSharing,
  SharedUser,
} from 'features/file-manager/utils/file-manager';
import { FileTableRowActions } from '../file-manager-row-actions';
import { useIsMobile } from 'hooks/use-mobile';
import { Button } from 'components/ui/button';
import FileDetailsSheet from './my-files-details';

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
  onViewDetails: (file: IFileDataWithSharing) => void;
  onDownload: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onOpen: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: {
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onMove,
  onRename,
}) => {
  const IconComponent = getFileTypeIcon(file.fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewDetails?.(file);
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
          className={`${file.fileType === 'Folder' ? 'w-8 h-8' : 'w-20 h-20'} flex items-center ${file.fileType === 'Folder' ? `${backgroundColor}` : ''}  justify-center`}
        >
          <IconComponent
            className={`${file.fileType === 'Folder' ? 'w-5 h-5' : 'w-10 h-10'} ${iconColor}`}
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

// Updated FileGridView interface to include sharing props

interface FileGridViewProps {
  onViewDetails: (file: IFileDataWithSharing) => void;
  onDownload: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onOpen: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: {
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export const FileGridView: React.FC<FileGridViewProps> = ({
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onOpen,
  onRename,
  filters,
  newFiles = [],
  newFolders = [],
  renamedFiles = new Map(),
  fileSharedUsers = {},
  filePermissions = {},
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileDataWithSharing | null>(null);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: isMobile ? 20 : 50,
    totalCount: 0,
  });

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: filters,
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
    (file: IFileDataWithSharing) => {
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

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">{t('ERROR_LOADING_FILES')}</p>
        </div>
      </div>
    );
  }

  if (isLoading && !data?.data?.length && newFiles.length === 0 && newFolders.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('LOADING')}</p>
        </div>
      </div>
    );
  }

  const existingFiles = data?.data || [];

  // Process server files with renamed versions and sharing data
  const processedServerFiles = existingFiles.map((file) => {
    const renamedVersion = renamedFiles.get(file.id);
    const baseFile = renamedVersion || file;

    // Enhance with sharing data from props
    const enhancedFile: IFileDataWithSharing = {
      ...baseFile,
      sharedWith: fileSharedUsers[file.id] || baseFile.sharedWith || [],
      sharePermissions: filePermissions[file.id] || baseFile.sharePermissions || {},
    };

    return enhancedFile;
  });

  const newFileIds = new Set([...newFiles.map((f) => f.id), ...newFolders.map((f) => f.id)]);
  const filteredServerFiles = processedServerFiles.filter((file) => !newFileIds.has(file.id));

  // Enhance new files and folders with shared user data
  const enhancedNewFiles = newFiles.map((file) => ({
    ...file,
    sharedWith: fileSharedUsers[file.id] || file.sharedWith || [],
    sharePermissions: filePermissions[file.id] || file.sharePermissions || {},
  }));

  const enhancedNewFolders = newFolders.map((folder) => ({
    ...folder,
    sharedWith: fileSharedUsers[folder.id] || folder.sharedWith || [],
    sharePermissions: filePermissions[folder.id] || folder.sharePermissions || {},
  }));

  const allFiles = [...enhancedNewFolders, ...enhancedNewFiles, ...filteredServerFiles];

  const filteredFiles = allFiles.filter((file) => {
    const matchesName =
      !filters.name || file.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesType = !filters.fileType || file.fileType === filters.fileType;
    return matchesName && matchesType;
  });

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
                  {t('FOLDER')} ({folders.length})
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {folders.map((file) => {
                    return (
                      <FileCard
                        key={`folder-${file.id}-${file.name}`}
                        file={file}
                        onViewDetails={handleViewDetails}
                        onDownload={onDownload}
                        onShare={onShare}
                        onDelete={onDelete}
                        onMove={onMove}
                        onCopy={onCopy}
                        onOpen={onOpen}
                        onRename={onRename}
                        t={t}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {regularFiles.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded">
                  {t('FILE')} ({regularFiles.length})
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {regularFiles.map((file) => {
                    return (
                      <FileCard
                        key={`file-${file.id}-${file.name}`}
                        file={file}
                        onViewDetails={handleViewDetails}
                        onDownload={onDownload}
                        onShare={onShare}
                        onDelete={onDelete}
                        onMove={onMove}
                        onCopy={onCopy}
                        onOpen={onOpen}
                        onRename={onRename}
                        t={t}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {filteredFiles.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Folder className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('NO_FILES_FOUND')}</h3>
                <p className="text-gray-500 max-w-sm">
                  {filters.name || filters.fileType
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
      </div>

      <FileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={
          selectedFile
            ? {
                ...selectedFile,
                isShared: selectedFile.isShared ?? false,
                lastModified:
                  typeof selectedFile.lastModified === 'string'
                    ? selectedFile.lastModified
                    : selectedFile.lastModified.toISOString(),
              }
            : null
        }
        t={t}
      />
    </div>
  );
};
