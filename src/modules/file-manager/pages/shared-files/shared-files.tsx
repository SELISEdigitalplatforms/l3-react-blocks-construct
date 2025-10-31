import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useViewMode } from '@/hooks/use-view-mode';
import { useFileManager } from '../../hooks/use-file-manager';
import { useFileFilters } from '../../hooks/use-file-filters';
import { SharedFilters } from '../../types/header-toolbar.type';
import { SharedWithMeHeaderToolbar } from '../../components/shared-with-me/shared-files-header-toolbar/shared-files-header-toolbar';
import { DynamicFileModal } from '../../components/modals/dynamic-file-modal/dynamic-file-modal';
import { RenameFile } from '../../components/modals/rename-file/rename-file';
import { ShareWithMeModal } from '../../components/modals/shared-user/shared-user';
import { FileManagerLayout } from '../../components/layout/file-manager-layout';
import { FileViewRenderer } from '../../components/file-view-renderer/file-view-renderer';
import { SharedFilesGridView } from '../../components/shared-with-me/shared-files-grid-view/shared-files-grid-view';
import { SharedFilesListView } from '../../components/shared-with-me/shared-files-list-view/shared-files-list-view';
import { FilePreview } from '../../components/file-preview/file-preview';

interface SharedWithMePageProps {
  onCreateFile?: () => void;
}
export const SharedWithMePage = ({ onCreateFile }: Readonly<SharedWithMePageProps>) => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId?: string }>();

  const fileManager = useFileManager({ onCreateFile });

  const { viewMode, handleViewModeChange } = useViewMode({
    storageKey: 'shared-with-me-view-mode',
    defaultMode: 'list',
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<any>(null);

  const { filters, handleFiltersChange } = useFileFilters<SharedFilters>({
    name: '',
    fileType: undefined,
    sharedDate: undefined,
    modifiedDate: undefined,
  });

  const handleNavigateToFolder = useCallback(
    (folderId: string) => {
      navigate(`/file-manager/shared-files/${folderId}`);
    },
    [navigate]
  );

  const handleNavigateBack = useCallback(() => {
    navigate('/file-manager/shared-files');
  }, [navigate]);

  const handleFilePreview = useCallback((file: any) => {
    setSelectedFileForPreview(file);
    setIsPreviewOpen(true);
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
    <DynamicFileModal
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
      RenameModalComponent={RenameFile}
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

        <FilePreview
          file={selectedFileForPreview}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
        />
      </div>
    </FileManagerLayout>
  );
};
