import { useState } from 'react';
import FileListView from './file-list-view';
import FileGridView from './file-grid-view';
import { TasksProvider } from 'features/task-manager/hooks/use-task-context';
import { TaskProvider } from 'features/task-manager/contexts/task-context';
import FileManagerToolbar from 'features/file-manager/components/file-manager-toolbar/file-manager-toolbar';

/**
 * FileManager Component
 *
 * A central task management component that enables users to view, add, and manage tasks.
 * Supports both list and board (card) views, and handles state for view modes and task data.
 *
 * Features:
 * - Board and list view modes for task visualization
 * - Integration with `TaskService` for task retrieval
 * - New task modal handling
 * - Toolbar for user interaction and view toggling
 * - Context providers for shared task state and logic
 *
 * @returns {JSX.Element} The FileManager UI with current tasks rendered in the selected view
 *
 * @example
 * // Usage in a route or page
 * <FileManager />
 */

export default function FileManager() {
  const [viewMode, setViewMode] = useState('list');

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const onOpen = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleViewMode = (view: string) => {
    setViewMode(view === 'list' ? 'list' : 'board');
  };

  return (
    <TaskProvider>
      <TasksProvider>
        <div className="flex w-full flex-col">
          <div className="mb-4 whitespace-nowrap md:mb-8">
            <FileManagerToolbar
              viewMode={viewMode}
              handleViewMode={handleViewMode}
              onOpen={onOpen}
            />
          </div>

          {viewMode === 'board' && (
            <FileGridView
              isNewTaskModalOpen={isNewTaskModalOpen}
              setNewTaskModalOpen={setIsNewTaskModalOpen}
            />
          )}
          {viewMode === 'list' && <FileListView />}
        </div>
      </TasksProvider>
    </TaskProvider>
  );
}
