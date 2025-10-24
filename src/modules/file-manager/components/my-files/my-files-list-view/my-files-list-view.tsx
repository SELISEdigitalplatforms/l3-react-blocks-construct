import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMockFilesQuery } from '@/modules/file-manager/hooks/use-mock-files-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { DataTable } from '@/components/core';
import {
  IFileDataWithSharing,
  PaginationState,
  SharedUser,
} from '@/modules/file-manager/utils/file-manager';
import { FilePreview } from '../../file-preview/file-preview';
import { RegularFileDetailsSheet } from '../../regular-file-details-sheet/regular-file-details-sheet';
import { createFileTableColumns } from '../my-files-table-columns/my-files-table-columns';
import { FileType } from '@/modules/file-manager/types/file-manager.type';
import {
  enhanceNewEntries,
  enhanceFileWithSharing,
  mergeUniqueById,
} from '@/modules/file-manager/utils/list-view-utils';
import { ResponsiveMainPane } from '@/modules/file-manager/components/layout/responsive-main-pane';

export interface MyFilesListViewProps {
  onViewDetails: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;

  onRename: (file: IFileDataWithSharing) => void;
  onRenameUpdate?: (oldFile: IFileDataWithSharing, newFile: IFileDataWithSharing) => void;
  filters: {
    name?: string;
    fileType?: FileType;
  };
  newFiles: IFileDataWithSharing[];
  newFolders: IFileDataWithSharing[];
  renamedFiles: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
}

export const MyFilesListView = ({
  onShare,
  onDelete,
  onRename,
  filters,
  newFiles,
  newFolders,
  renamedFiles,
  fileSharedUsers = {},
  filePermissions = {},
  currentFolderId,
  onNavigateToFolder,
}: Readonly<MyFilesListViewProps>) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    folderId: currentFolderId,
  };

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  const localFiles = useMemo(() => {
    return enhanceNewEntries(newFiles, newFolders, fileSharedUsers, filePermissions);
  }, [newFiles, newFolders, fileSharedUsers, filePermissions]);

  const combinedData = useMemo(() => {
    const serverFiles = data?.data || [];

    const processedServerFiles = serverFiles.map((file: any) => {
      const renamedVersion = renamedFiles.get(file.id);
      const baseFile = renamedVersion || file;
      return enhanceFileWithSharing(baseFile, fileSharedUsers, filePermissions);
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

    return mergeUniqueById(filteredLocalFiles, filteredServerFiles);
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
  }, [filters, currentFolderId]);

  const handleRowClick = useCallback(
    (file: IFileDataWithSharing) => {
      if (file.fileType === 'Folder' && onNavigateToFolder) {
        onNavigateToFolder(file.id);
      } else {
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    },
    [onNavigateToFolder]
  );

  const handleViewDetails = useCallback((file: IFileDataWithSharing) => {
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

  const handleDownloadWrapper = () => undefined;
  const handleMoveWrapper = () => undefined;
  const handleCopyWrapper = () => undefined;

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
    onViewDetails: handleViewDetails,
    onDownload: handleDownloadWrapper,
    onShare: handleShareWrapper,
    onDelete: handleDeleteWrapper,
    onRename: handleRenameWrapper,
    onMove: handleMoveWrapper,
    onCopy: handleCopyWrapper,
    t,
  });

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  return (
    <ResponsiveMainPane
      isMobile={isMobile}
      isDetailsOpen={isDetailsOpen}
      isPreviewOpen={isPreviewOpen}
    >
      <div className="h-full flex-col flex w-full gap-6 md:gap-8">
        <DataTable
          data={combinedData}
          columns={columns}
          onRowClick={handleRowClick}
          isLoading={isLoading}
          pagination={{
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
            totalCount: paginationState.totalCount,
          }}
          onPaginationChange={handlePaginationChange}
          manualPagination={true}
          expandable={false}
          mobileColumns={['name']}
        />
      </div>

      <FilePreview file={selectedFile} isOpen={isPreviewOpen} onClose={handleClosePreview} />

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
    </ResponsiveMainPane>
  );
};
