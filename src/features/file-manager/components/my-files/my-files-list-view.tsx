import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import { createFileTableColumns } from './my-files-table-columns';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import FileDetailsSheet from './my-files-details';
import { IFileDataWithSharing, PaginationState, SharedUser } from '../../utils/file-manager';

interface MyFilesListViewProps {
  onViewDetails: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onOpen: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  onRenameUpdate?: (oldFile: IFileDataWithSharing, newFile: IFileDataWithSharing) => void;
  filters: {
    name?: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
  newFiles: IFileDataWithSharing[];
  newFolders: IFileDataWithSharing[];
  renamedFiles: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
}

const MyFilesListView: React.FC<MyFilesListViewProps> = ({
  onViewDetails,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onOpen,
  onRename,
  filters,
  newFiles,
  newFolders,
  renamedFiles,
  fileSharedUsers = {},
  filePermissions = {},
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileDataWithSharing | null>(null);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: filters,
  };

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  const localFiles = useMemo(() => {
    // Enhance local files with shared user data
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

    return [...enhancedNewFiles, ...enhancedNewFolders];
  }, [newFiles, newFolders, fileSharedUsers, filePermissions]);

  const combinedData = useMemo(() => {
    const serverFiles = data?.data || [];

    // Apply renames to server files and enhance with sharing data
    const processedServerFiles = serverFiles.map((file: any) => {
      const renamedVersion = renamedFiles.get(file.id);
      const baseFile = renamedVersion || file;

      // Enhance with sharing data
      const enhancedFile: IFileDataWithSharing = {
        ...baseFile,
        sharedWith: fileSharedUsers[file.id] || baseFile.sharedWith || [],
        sharePermissions: filePermissions[file.id] || baseFile.sharePermissions || {},
      };

      return enhancedFile;
    });

    // Filter local files based on search criteria
    const filteredLocalFiles = localFiles.filter((file) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }
      return true;
    });

    // Filter processed server files based on search criteria
    const filteredServerFiles = processedServerFiles.filter((file: IFileDataWithSharing) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }
      return true;
    });

    // Avoid duplicates between local and server files
    const localFileIds = new Set(filteredLocalFiles.map((f) => f.id));
    const uniqueServerFiles = filteredServerFiles.filter((f) => !localFileIds.has(f.id));

    return [...filteredLocalFiles, ...uniqueServerFiles];
  }, [localFiles, data?.data, filters, renamedFiles, fileSharedUsers, filePermissions]);

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
        totalCount: data.totalCount + localFiles.length,
      }));
    }
  }, [data?.totalCount, localFiles.length]);

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters]);

  const handleViewDetailsWrapper = useCallback(
    (file: IFileDataWithSharing) => {
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
    (file: IFileDataWithSharing) => {
      setSelectedFile(file);
      onShare(file);
    },
    [onShare]
  );

  const handleDeleteWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      setSelectedFile(file);
      onDelete(file);
    },
    [onDelete]
  );

  const handleRenameWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      onRename(file);
    },
    [onRename]
  );

  const handleOpenWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      onOpen(file);
    },
    [onOpen]
  );

  const handleMoveWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      onMove(file);
    },
    [onMove]
  );

  const handleCopyWrapper = useCallback(
    (file: IFileDataWithSharing) => {
      onCopy(file);
    },
    [onCopy]
  );

  // Create columns with updated handlers that work with IFileDataWithSharing
  const columns = createFileTableColumns({
    onViewDetails: handleViewDetailsWrapper,
    onDownload: handleDownloadWrapper,
    onShare: handleShareWrapper,
    onDelete: handleDeleteWrapper,
    onMove: handleMoveWrapper,
    onCopy: handleCopyWrapper,
    onOpen: handleOpenWrapper,
    onRename: handleRenameWrapper,
    t,
    // Pass shared users data to columns for rendering
  });

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  const shouldHideMainContent = isMobile && isDetailsOpen;

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
              data={combinedData}
              columns={columns}
              onRowClick={handleViewDetailsWrapper}
              isLoading={isLoading}
              pagination={{
                pageIndex: paginationState.pageIndex,
                pageSize: paginationState.pageSize,
                totalCount: paginationState.totalCount,
              }}
              onPaginationChange={handlePaginationChange}
              manualPagination={true}
              mobileColumns={['name']}
              expandable={true}
            />
          </div>
        </div>
      )}

      <FileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={
          selectedFile
            ? {
                ...selectedFile,
                lastModified:
                  typeof selectedFile.lastModified === 'string'
                    ? selectedFile.lastModified
                    : (selectedFile.lastModified?.toISOString?.() ?? ''),
                isShared: selectedFile.isShared ?? false,
              }
            : null
        }
        t={t}
      />
    </div>
  );
};

export default MyFilesListView;
