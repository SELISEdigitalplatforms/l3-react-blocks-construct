/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-console */

import React, { useCallback } from 'react';

import MyFilesListView from '../../features/file-manager/components/my-files/my-files-list-view';
import { ShareWithMeModal } from 'features/file-manager/components/modals/shared-user-modal';

import { RenameModal } from 'features/file-manager/components/modals/rename-modal';
import MyFileGridView from 'features/file-manager/components/my-files/my-files-grid-view';
import { FileManagerLayout } from 'features/file-manager/file-manager-layout';
import { FileViewRenderer } from 'features/file-manager/components/file-view-renderer';
import { useFileManager } from 'features/file-manager/hooks/use-file-manager';
import { useFileFilters } from 'features/file-manager/hooks/use-file-filters';
import { FileModals } from 'features/file-manager/components/modals/file-modals';
import { FilterConfig } from 'features/file-manager/types/header-toolbar.type';
import { BaseHeaderToolbar } from 'features/file-manager/components/header-toolbar/base-header-toolbar';
import { FileFilters } from 'features/file-manager/components/common-filters';
import { FileManagerHeaderToolbarProps } from 'features/file-manager/utils/file-manager';

export const FileManagerHeaderToolbar: React.FC<FileManagerHeaderToolbarProps> = (props) => {
  const filterConfigs: FilterConfig[] = [
    {
      key: 'fileType',
      type: 'select',
      label: 'FILE_TYPE',
      options: [
        { value: 'Folder', label: 'FOLDER' },
        { value: 'File', label: 'FILE' },
        { value: 'Image', label: 'IMAGE' },
        { value: 'Audio', label: 'AUDIO' },
        { value: 'Video', label: 'VIDEO' },
      ],
      width: 'w-[140px]',
    },
    {
      key: 'lastModified',
      type: 'dateRange',
      label: 'LAST_MODIFIED',
      showInMobile: true,
    },
  ];

  return (
    <BaseHeaderToolbar
      title="MY_FILES"
      viewMode={props.viewMode ?? 'grid'}
      searchQuery={props.searchQuery ?? ''}
      filters={props.filters}
      filterConfigs={filterConfigs}
      showFileUpload={true}
      showFolderCreate={true}
      onViewModeChange={props.handleViewMode}
      onSearchChange={props.onSearchChange ?? (() => {})}
      onFiltersChange={props.onFiltersChange}
      onFileUpload={props.onFileUpload}
      onFolderCreate={props.onFolderCreate}
    />
  );
};

interface FileManagerMyFilesProps {
  onCreateFile?: () => void;
}

export const FileManagerMyFiles: React.FC<FileManagerMyFilesProps> = ({ onCreateFile }) => {
  const fileManager = useFileManager({ onCreateFile });
  const { filters, handleFiltersChange } = useFileFilters<FileFilters>({
    name: '',
    fileType: undefined,
    lastModified: undefined,
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
    <FileManagerHeaderToolbar
      viewMode={fileManager.viewMode}
      handleViewMode={fileManager.handleViewModeChange}
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
        viewMode={fileManager.viewMode}
        GridComponent={MyFileGridView}
        ListComponent={MyFilesListView}
        commonViewProps={commonViewProps}
      />
    </FileManagerLayout>
  );
};
