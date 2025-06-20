/* eslint-disable no-console */

import React, { useState, useCallback } from 'react';
import { IFileData } from 'features/file-manager/hooks/use-mock-files-query';
import FileManagerHeaderToolbar from 'features/file-manager/components/file-manager-toolbar';
import FileGridView from './file-grid-view';
import FileListView from './file-list-view';

/**
 * FileManager Container Component
 *
 * Main container that manages the file manager interface, including:
 * - View mode switching (grid/list)
 * - Search functionality
 * - File operations (view, download, share, delete, etc.)
 * - Toolbar and content area coordination
 */

interface FileManagerProps {
  onCreateFile?: () => void;
}

const FileManager: React.FC<FileManagerProps> = ({ onCreateFile }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<{
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  }>({
    name: '',
    fileType: undefined,
  });

  const handleViewDetails = useCallback((file: IFileData) => {
    console.log('View details:', file);
  }, []);

  const handleDownload = useCallback((file: IFileData) => {
    console.log('Download:', file);
  }, []);

  const handleShare = useCallback((file: IFileData) => {
    console.log('Share:', file);
  }, []);

  const handleDelete = useCallback((file: IFileData) => {
    console.log('Delete:', file);
  }, []);

  const handleMove = useCallback((file: IFileData) => {
    console.log('Move:', file);
  }, []);

  const handleCopy = useCallback((file: IFileData) => {
    console.log('Copy:', file);
  }, []);

  const handleOpen = useCallback((file: IFileData) => {
    console.log('Open:', file);
  }, []);

  const handleRename = useCallback((file: IFileData) => {
    console.log('Rename:', file);
  }, []);

  const handleViewModeChange = useCallback((mode: string) => {
    setViewMode(mode as 'grid' | 'list');
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({
      ...prev,
      name: query,
    }));
  }, []);

  const handleCreateFile = useCallback(() => {
    if (onCreateFile) {
      onCreateFile();
    } else {
      console.log('Create new file/folder');
    }
  }, [onCreateFile]);

  const commonViewProps = {
    onViewDetails: handleViewDetails,
    onDownload: handleDownload,
    onShare: handleShare,
    onDelete: handleDelete,
    onMove: handleMove,
    onCopy: handleCopy,
    onOpen: handleOpen,
    onRename: handleRename,
    searchQuery,
    filters,
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4 p-4 md:p-6">
      <FileManagerHeaderToolbar
        onOpen={handleCreateFile}
        viewMode={viewMode}
        handleViewMode={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="h-full overflow-y-auto">
            <FileGridView {...commonViewProps} />
          </div>
        ) : (
          <div className="h-full">
            <FileListView />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
