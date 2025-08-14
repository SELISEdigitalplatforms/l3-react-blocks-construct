import React, { useCallback, useState } from 'react';
import SharedFilesListView from 'features/file-manager/components/shared-with-me/shared-files-list-view';
import { ShareWithMeModal } from 'features/file-manager/components/modals/shared-user-modal';
import { RenameModal } from 'features/file-manager/components/modals/rename-modal';
import SharedFilesGridView from 'features/file-manager/components/shared-with-me/shared-files-grid-view';
import { useFileManager } from 'features/file-manager/hooks/use-file-manager';
import { useFileFilters } from 'features/file-manager/hooks/use-file-filters';
import { FileModals } from 'features/file-manager/components/modals/file-modals';
import { FileManagerLayout } from 'features/file-manager/file-manager-layout';
import { FileViewRenderer } from 'features/file-manager/components/file-view-renderer';
import { SharedFilters } from 'features/file-manager/types/header-toolbar.type';
import { SharedWithMeHeaderToolbar } from 'features/file-manager/components/shared-with-me/shared-files-header-toolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { FilePreview } from 'features/file-manager/components/file-preview';

interface SharedWithMeProps {
  onCreateFile?: () => void;
}

export const SharedWithMe: React.FC<SharedWithMeProps> = ({ onCreateFile }) => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId?: string }>();

  const fileManager = useFileManager({ onCreateFile });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = sessionStorage.getItem('shared-with-me-view-mode');
      return (saved as 'grid' | 'list') || 'list';
    } catch {
      return 'list';
    }
  });

  // ✅ ADD file preview state management
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<any>(null);

  const { filters, handleFiltersChange } = useFileFilters<SharedFilters>({
    name: '',
    fileType: undefined,
    sharedBy: undefined,
    sharedDate: undefined,
    modifiedDate: undefined,
  });

  const handleViewModeChange = useCallback((mode: string) => {
    const newViewMode = mode as 'grid' | 'list';
    setViewMode(newViewMode);

    try {
      sessionStorage.setItem('shared-with-me-view-mode', newViewMode);
    } catch (error) {
      console.warn('Failed to save view mode to sessionStorage:', error);
    }
  }, []);

  const handleNavigateToFolder = useCallback(
    (folderId: string) => {
      navigate(`/shared-files/${folderId}`); // Keep your existing URL structure
    },
    [navigate]
  );

  const handleNavigateBack = useCallback(() => {
    navigate('/shared-files'); // Keep your existing URL structure
  }, [navigate]);

  // ✅ ADD file preview handler
  const handleFilePreview = useCallback((file: any) => {
    console.log('Preview shared file:', file);
    setSelectedFileForPreview(file);
    setIsPreviewOpen(true);

    // You can also implement specific preview logic here
    switch (file.fileType) {
      case 'PDF':
        // Could open PDF viewer modal instead of generic preview
        break;
      case 'Image':
        // Could open image lightbox
        break;
      case 'Video':
        // Could open video player
        break;
      case 'Document':
        // Could open document viewer
        break;
      default:
        // Use generic preview component
        break;
    }
  }, []);

  // ✅ ADD close preview handler
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

  // ✅ UPDATED commonViewProps with file preview
  const commonViewProps = {
    onViewDetails: fileManager.handleViewDetails,
    onFilePreview: handleFilePreview, // ✅ ADD this missing prop
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
    <SharedWithMeHeaderToolbar
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
      sharedUsers={[]}
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
          GridComponent={SharedFilesGridView}
          ListComponent={SharedFilesListView}
          commonViewProps={commonViewProps}
        />

        {/* ✅ ADD File Preview Component */}
        <FilePreview
          file={selectedFileForPreview}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
        />
      </div>
    </FileManagerLayout>
  );
};

export default SharedWithMe;
