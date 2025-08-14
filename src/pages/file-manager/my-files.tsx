import React, { useCallback, useMemo, useState } from 'react';
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

  const navigationHandlers = useMemo(
    () => ({
      toFolder: (folderId: string) => navigate(`/my-files/${folderId}`),
      back: () => navigate('/my-files'),
    }),
    [navigate]
  );

  const previewHandlers = useMemo(
    () => ({
      open: (file: any) => {
        setSelectedFileForPreview(file);
        setIsPreviewOpen(true);
      },
      close: () => {
        setIsPreviewOpen(false);
        setSelectedFileForPreview(null);
      },
    }),
    []
  );

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

  // Extracted filter change handler for toolbar
  const handleToolbarFiltersChange = useCallback(
    (newFilters: any) =>
      handleFiltersChange({
        ...newFilters,
        name: newFilters.name ?? '',
      }),
    [handleFiltersChange]
  );

  const ensureFileHasSharedProperty = (file: any) =>
    file ? { ...file, isShared: !!file.isShared } : null;

  const fileHandlers = useMemo(
    () => ({
      onFilePreview: previewHandlers.open,
      onDownload: fileManager.handleDownload,
      onShare: fileManager.handleShare,
      onDelete: fileManager.handleDelete,
      onMove: fileManager.handleMove,
      onCopy: fileManager.handleCopy,
      onOpen: fileManager.handleOpen,
      onRename: fileManager.handleRename,
      onRenameUpdate: fileManager.handleRenameUpdate,
    }),
    [
      previewHandlers.open,
      fileManager.handleDownload,
      fileManager.handleShare,
      fileManager.handleDelete,
      fileManager.handleMove,
      fileManager.handleCopy,
      fileManager.handleOpen,
      fileManager.handleRename,
      fileManager.handleRenameUpdate,
    ]
  );

  const commonViewProps = useMemo(
    () => ({
      ...fileHandlers,
      filters,
      newFiles: fileManager.newFiles,
      newFolders: fileManager.newFolders,
      renamedFiles: fileManager.renamedFiles,
      fileSharedUsers: fileManager.fileSharedUsers,
      filePermissions: fileManager.filePermissions,
      currentFolderId: folderId,
      onNavigateToFolder: navigationHandlers.toFolder,
      onNavigateBack: navigationHandlers.back,
    }),
    [
      fileHandlers,
      filters,
      fileManager.newFiles,
      fileManager.newFolders,
      fileManager.renamedFiles,
      fileManager.fileSharedUsers,
      fileManager.filePermissions,
      folderId,
      navigationHandlers.toFolder,
      navigationHandlers.back,
    ]
  );

  const headerToolbar = useMemo(
    () => (
      <FileManagerHeaderToolbar
        viewMode={viewMode}
        handleViewMode={handleViewModeChange}
        searchQuery={fileManager.searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleToolbarFiltersChange}
        onFileUpload={(files) => fileManager.handleFileUpload(files, false)}
        onFolderCreate={(name) => fileManager.handleFolderCreate(name, false)}
      />
    ),
    [
      viewMode,
      handleViewModeChange,
      fileManager,
      handleSearchChange,
      filters,
      handleToolbarFiltersChange,
    ]
  );

  const modals = useMemo(
    () => (
      <FileModals
        isRenameModalOpen={fileManager.isRenameModalOpen}
        onRenameModalClose={fileManager.handleRenameModalClose}
        onRenameConfirm={fileManager.handleRenameConfirm}
        fileToRename={ensureFileHasSharedProperty(fileManager.fileToRename)}
        isShareModalOpen={fileManager.isShareModalOpen}
        onShareModalClose={fileManager.handleShareModalClose}
        onShareConfirm={fileManager.handleShareConfirm}
        fileToShare={ensureFileHasSharedProperty(fileManager.fileToShare)}
        RenameModalComponent={RenameModal}
        ShareModalComponent={ShareWithMeModal}
      />
    ),
    [
      fileManager.isRenameModalOpen,
      fileManager.handleRenameModalClose,
      fileManager.handleRenameConfirm,
      fileManager.fileToRename,
      fileManager.isShareModalOpen,
      fileManager.handleShareModalClose,
      fileManager.handleShareConfirm,
      fileManager.fileToShare,
    ]
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
          onClose={previewHandlers.close}
        />
      </div>
    </FileManagerLayout>
  );
};

export default FileManagerMyFiles;
