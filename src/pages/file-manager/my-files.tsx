import React, { useCallback, useEffect, useState } from 'react';
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

interface FileManagerMyFilesProps {
  onCreateFile?: () => void;
}

export const FileManagerMyFiles: React.FC<FileManagerMyFilesProps> = ({ onCreateFile }) => {
  // Add navigation hooks (same as Trash)
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId?: string }>();

  // Add view mode state with sessionStorage persistence (same as Trash)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = sessionStorage.getItem('file-manager-view-mode');
      return (saved as 'grid' | 'list') || 'list';
    } catch {
      return 'list';
    }
  });

  const fileManager = useFileManager({ onCreateFile });
  const { filters, handleFiltersChange } = useFileFilters<FileFilters>({
    name: '',
    fileType: undefined,
    lastModified: undefined,
  });

  // Add view mode change handler with sessionStorage persistence (same as Trash)
  const handleViewModeChange = useCallback((mode: string) => {
    const newViewMode = mode as 'grid' | 'list';
    setViewMode(newViewMode);

    try {
      sessionStorage.setItem('file-manager-view-mode', newViewMode);
    } catch (error) {
      console.warn('Failed to save view mode to sessionStorage:', error);
    }
  }, []);

  // Add folder navigation handlers (same as Trash)
  const handleNavigateToFolder = useCallback(
    (folderId: string) => {
      navigate(`/my-files/${folderId}`);
    },
    [navigate]
  );

  const handleNavigateBack = useCallback(() => {
    navigate('/my-files');
  }, [navigate]);

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

  // Reset state when folder changes (same as Trash)
  useEffect(() => {
    // Reset any selection or other state when navigating folders
    // You might want to add state resets here if needed
  }, [folderId]);

  const commonViewProps = {
    onViewDetails: fileManager.handleViewDetails,
    onDownload: fileManager.handleDownload,
    onShare: fileManager.handleShare,
    onDelete: fileManager.handleDelete,
    onRename: fileManager.handleRename,
    onRenameUpdate: fileManager.handleRenameUpdate,
    filters,
    newFiles: fileManager.newFiles,
    newFolders: fileManager.newFolders,
    renamedFiles: fileManager.renamedFiles,
    fileSharedUsers: fileManager.fileSharedUsers,
    filePermissions: fileManager.filePermissions,
    // Add folder navigation props (same as Trash)
    currentFolderId: folderId,
    onNavigateToFolder: handleNavigateToFolder,
    onNavigateBack: handleNavigateBack,
  };

  const headerToolbar = (
    <FileManagerHeaderToolbar
      viewMode={viewMode} // Use local viewMode state instead of fileManager.viewMode
      handleViewMode={handleViewModeChange} // Use local handler instead of fileManager.handleViewModeChange
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
      <FileViewRenderer
        viewMode={viewMode} // Use local viewMode state
        GridComponent={MyFileGridView}
        ListComponent={MyFilesListView}
        commonViewProps={commonViewProps}
      />
    </FileManagerLayout>
  );
};
