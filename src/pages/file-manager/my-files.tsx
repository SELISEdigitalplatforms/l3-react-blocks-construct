import React, { useCallback, useState } from 'react';
import MyFilesListView from '../../features/file-manager/components/my-files/my-files-list-view';
import { ShareWithMeModal } from 'features/file-manager/components/modals/shared-user-modal';
import { RenameModal } from 'features/file-manager/components/modals/rename-modal';
import MyFileGridView from 'features/file-manager/components/my-files/my-files-grid-view';
import { FileManagerLayout } from 'features/file-manager/file-manager-layout';
import { FileViewRenderer } from 'features/file-manager/components/file-view-renderer';
import { useFileManager } from 'features/file-manager/hooks/use-file-manager';
import { useFileFilters } from 'features/file-manager/hooks/use-file-filters';
import { FileModals } from 'features/file-manager/components/modals/file-modals';
import { FileFilters } from 'features/file-manager/components/common-filters';
import { FileManagerHeaderToolbar } from 'features/file-manager/components/my-files/my-files-header-toolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { FilePreview } from 'features/file-manager/components/file-preview';
import { useViewMode } from 'hooks/use-view-mode';

interface FileManagerMyFilesProps {
  onCreateFile?: () => void;
}

export const FileManagerMyFiles: React.FC<FileManagerMyFilesProps> = ({ onCreateFile }) => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId?: string }>();

  const fileManager = useFileManager({ onCreateFile });

  const { viewMode, handleViewModeChange } = useViewMode({
    storageKey: 'file-manager-view-mode',
    defaultMode: 'list',
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<any>(null);

  const { filters, handleFiltersChange } = useFileFilters<FileFilters>({
    name: '',
    fileType: undefined,
    lastModified: undefined,
  });

  const handleNavigateToFolder = useCallback(
    (folderId: string) => {
      navigate(`/my-files/${folderId}`);
    },
    [navigate]
  );

  const handleNavigateBack = useCallback(() => {
    navigate('/my-files');
  }, [navigate]);

  const handleFilePreview = useCallback((file: any) => {
    setSelectedFileForPreview(file);
    setIsPreviewOpen(true);

    switch (file.fileType) {
      case 'PDF':
        break;
      case 'Image':
        break;
      case 'Video':
        break;
      case 'Document':
        break;
      default:
        break;
    }
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedFileForPreview(null);
  }, []);

  const handleSearchChange = useCallback(
    (query: string) => {
      fileManager.handleSearchChange(query);
      handleFiltersChange({
        ...filters,
        name: query,
      });
    },
    [fileManager, handleFiltersChange, filters]
  );

  const commonViewProps = {
    onFilePreview: handleFilePreview,
    onDownload: fileManager.handleDownload,
    onShare: fileManager.handleShare,
    onDelete: fileManager.handleDelete,
    onMove: fileManager.handleMove,
    onCopy: fileManager.handleCopy,
    onOpen: fileManager.handleOpen,
    onRename: fileManager.handleRename,
    onRenameUpdate: fileManager.handleRenameUpdate,
    filters,
    newFiles: fileManager.newFiles,
    newFolders: fileManager.newFolders,
    renamedFiles: fileManager.renamedFiles,
    fileSharedUsers: fileManager.fileSharedUsers,
    filePermissions: fileManager.filePermissions,
    currentFolderId: folderId,
    onNavigateToFolder: handleNavigateToFolder,
    onNavigateBack: handleNavigateBack,
  };

  const headerToolbar = (
    <FileManagerHeaderToolbar
      viewMode={viewMode}
      handleViewMode={handleViewModeChange}
      searchQuery={fileManager.searchQuery}
      onSearchChange={handleSearchChange}
      filters={filters}
      onFiltersChange={(filters) =>
        handleFiltersChange({
          ...filters,
          name: filters.name ?? '',
        })
      }
      onFileUpload={(files) => fileManager.handleFileUpload(files, false)}
      onFolderCreate={(name) => fileManager.handleFolderCreate(name, false)}
    />
  );

  const modals = (
    <FileModals
      isRenameModalOpen={fileManager.isRenameModalOpen}
      onRenameModalClose={fileManager.handleRenameModalClose}
      onRenameConfirm={fileManager.handleRenameConfirm}
      fileToRename={
        fileManager.fileToRename
          ? { ...fileManager.fileToRename, isShared: !!fileManager.fileToRename.isShared }
          : null
      }
      isShareModalOpen={fileManager.isShareModalOpen}
      onShareModalClose={fileManager.handleShareModalClose}
      onShareConfirm={fileManager.handleShareConfirm}
      fileToShare={
        fileManager.fileToShare
          ? { ...fileManager.fileToShare, isShared: !!fileManager.fileToShare.isShared }
          : null
      }
      RenameModalComponent={RenameModal}
      ShareModalComponent={ShareWithMeModal}
    />
  );

  return (
    <FileManagerLayout headerToolbar={headerToolbar} modals={modals}>
      <div className="relative h-full">
        <FileViewRenderer
          viewMode={viewMode}
          GridComponent={MyFileGridView}
          ListComponent={MyFilesListView}
          commonViewProps={commonViewProps}
        />
        <FilePreview
          file={selectedFileForPreview}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
        />
      </div>
    </FileManagerLayout>
  );
};

export default FileManagerMyFiles;
