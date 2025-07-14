import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import { createFileTableColumns } from './my-files-table-columns';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import {
  IFileDataWithSharing,
  MyFilesListViewProps,
  PaginationState,
} from '../../utils/file-manager';
import { RegularFileDetailsSheet } from '../regular-file-details-sheet';

const MyFilesListView: React.FC<MyFilesListViewProps> = ({
  onViewDetails,
  onShare,
  onDelete,
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

    const processedServerFiles = serverFiles.map((file: any) => {
      const renamedVersion = renamedFiles.get(file.id);
      const baseFile = renamedVersion || file;

      const enhancedFile: IFileDataWithSharing = {
        ...baseFile,
        sharedWith: fileSharedUsers[file.id] || baseFile.sharedWith || [],
        sharePermissions: filePermissions[file.id] || baseFile.sharePermissions || {},
      };

      return enhancedFile;
    });

    const filteredLocalFiles = localFiles.filter((file) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }
      return true;
    });

    const filteredServerFiles = processedServerFiles.filter((file: IFileDataWithSharing) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }
      return true;
    });

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

  const columns = createFileTableColumns({
    onViewDetails: handleViewDetailsWrapper,
    onDownload: handleDownloadWrapper,
    onShare: handleShareWrapper,
    onDelete: handleDeleteWrapper,
    onRename: handleRenameWrapper,
    t,
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

      <RegularFileDetailsSheet
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
