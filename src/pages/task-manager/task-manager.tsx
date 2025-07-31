import { useState } from 'react';
import TaskManagerToolbar, {
  ViewMode,
} from 'features/task-manager/components/task-manager-toolbar/task-manager-toolbar';
import TaskListView from './task-list-view';
import TaskCardView from './task-card-view';

/**
 * TaskManager Component
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
 * @returns {JSX.Element} The TaskManager UI with current tasks rendered in the selected view
 *
 * @example
 * // Usage in a route or page
 * <TaskManager />
 */

export default function TaskManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const onOpen = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleViewMode = (view: ViewMode) => {
    setViewMode(view);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 whitespace-nowrap md:mb-8">
        <TaskManagerToolbar
          viewMode={viewMode}
          handleViewMode={handleViewMode}
          onOpen={onOpen}
          onSearch={(query) => {
            setSearchQuery(query);
          }}
        />
      </div>

      {viewMode === 'board' && (
        <TaskCardView
          isNewTaskModalOpen={isNewTaskModalOpen}
          setNewTaskModalOpen={setIsNewTaskModalOpen}
          searchQuery={searchQuery}
        />
      )}
      {viewMode === 'list' && <TaskListView searchQuery={searchQuery} />}
    </div>
  );
}
