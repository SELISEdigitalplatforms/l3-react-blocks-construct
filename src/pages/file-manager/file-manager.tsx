/* eslint-disable no-console */
// import { useState } from 'react';
// import FileListView from './file-list-view';
// import FileGridView from './file-grid-view';
// import { TasksProvider } from 'features/task-manager/hooks/use-task-context';
// import { TaskProvider } from 'features/task-manager/contexts/task-context';
// import FileManagerToolbar from 'features/file-manager/components/file-manager-toolbar/file-manager-toolbar';

// /**
//  * FileManager Component
//  *
//  * A central task management component that enables users to view, add, and manage tasks.
//  * Supports both list and board (card) views, and handles state for view modes and task data.
//  *
//  * Features:
//  * - Board and list view modes for task visualization
//  * - Integration with `TaskService` for task retrieval
//  * - New task modal handling
//  * - Toolbar for user interaction and view toggling
//  * - Context providers for shared task state and logic
//  *
//  * @returns {JSX.Element} The FileManager UI with current tasks rendered in the selected view
//  *
//  * @example
//  * // Usage in a route or page
//  * <FileManager />
//  */

// export default function FileManager() {
//   const [viewMode, setViewMode] = useState('list');

//   const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

//   const onOpen = () => {
//     setIsNewTaskModalOpen(true);
//   };

//   const handleViewMode = (view: string) => {
//     setViewMode(view === 'list' ? 'list' : 'grid');
//   };

//   return (
//     <TaskProvider>
//       <TasksProvider>
//         <div className="flex w-full flex-col">
//           <div className="mb-4 whitespace-nowrap md:mb-8">
//             <FileManagerToolbar
//               viewMode={viewMode}
//               handleViewMode={handleViewMode}
//               onOpen={onOpen}
//             />
//           </div>

//           {viewMode === 'grid' && (
//             <FileGridView
//               isNewTaskModalOpen={isNewTaskModalOpen}
//               setNewTaskModalOpen={setIsNewTaskModalOpen}
//             />
//           )}
//           {viewMode === 'list' && <FileListView />}
//         </div>
//       </TasksProvider>
//     </TaskProvider>
//   );
// }

import React, { useState, useCallback } from 'react';
import { IFileData } from 'features/file-manager/hooks/use-mock-files-query';
import FileManagerToolbar from 'features/file-manager/components/file-manager-toolbar/file-manager-toolbar';
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
  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter state
  const [filters, setFilters] = useState<{
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  }>({
    name: '',
    fileType: undefined,
  });

  // File operation handlers
  const handleViewDetails = useCallback((file: IFileData) => {
    console.log('View details:', file);
    // Implement view details logic
  }, []);

  const handleDownload = useCallback((file: IFileData) => {
    console.log('Download:', file);
    // Implement download logic
  }, []);

  const handleShare = useCallback((file: IFileData) => {
    console.log('Share:', file);
    // Implement share logic
  }, []);

  const handleDelete = useCallback((file: IFileData) => {
    console.log('Delete:', file);
    // Implement delete logic
  }, []);

  const handleMove = useCallback((file: IFileData) => {
    console.log('Move:', file);
    // Implement move logic
  }, []);

  const handleCopy = useCallback((file: IFileData) => {
    console.log('Copy:', file);
    // Implement copy logic
  }, []);

  const handleOpen = useCallback((file: IFileData) => {
    console.log('Open:', file);
    // Implement open logic (for folders)
  }, []);

  const handleRename = useCallback((file: IFileData) => {
    console.log('Rename:', file);
    // Implement rename logic
  }, []);

  const handleViewModeChange = useCallback((mode: string) => {
    setViewMode(mode as 'grid' | 'list');
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Update filters to include search query
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
      // Implement default create logic
    }
  }, [onCreateFile]);

  // Common props for both views
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
      {/* Toolbar */}
      <FileManagerToolbar
        onOpen={handleCreateFile}
        viewMode={viewMode}
        handleViewMode={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Content Area */}
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
