import React, { useCallback } from 'react';
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

interface SharedWithMeProps {
  onCreateFile?: () => void;
}

export const SharedWithMe: React.FC<SharedWithMeProps> = ({ onCreateFile }) => {
  const fileManager = useFileManager({ onCreateFile });
  const { filters, handleFiltersChange } = useFileFilters<SharedFilters>({
    name: '',
    fileType: undefined,
    sharedBy: undefined,
    sharedDate: undefined,
    modifiedDate: undefined,
  });

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
    onViewDetails: fileManager.handleViewDetails,
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
  };

  const headerToolbar = (
    <SharedWithMeHeaderToolbar
      viewMode={fileManager.viewMode}
      handleViewMode={fileManager.handleViewModeChange}
      searchQuery={fileManager.searchQuery}
      onSearchChange={handleSearchChange}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onFileUpload={(files: FileList | File[]) =>
        fileManager.handleFileUpload(Array.isArray(files) ? files : Array.from(files), true)
      }
      onFolderCreate={(name: string) => fileManager.handleFolderCreate(name, true)}
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
        viewMode={fileManager.viewMode}
        GridComponent={SharedFilesGridView}
        ListComponent={SharedFilesListView}
        commonViewProps={commonViewProps}
      />
    </FileManagerLayout>
  );
};

export default SharedWithMe;
