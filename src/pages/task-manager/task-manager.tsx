import { useEffect, useState } from 'react';
import TaskManagerToolbar from 'features/task-manager/components/task-manager-toolbar/task-manager-toolbar';
import TaskListView from './task-list-view';
import { TaskDetails, TaskService } from 'features/task-manager/services/task-service';
import TaskCardView from './task-card-view';
import { TasksProvider } from 'features/task-manager/hooks/use-task-context';
import { TaskProvider } from 'features/task-manager/contexts/task-context';

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

const taskService = new TaskService();

export default function TaskManager() {
  const [viewMode, setViewMode] = useState('board');

  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskDetails[]>([]);

  useEffect(() => {
    setTasks(taskService.getTasks());
  }, []);

  const onOpen = () => {
    setNewTaskModalOpen(true);
  };

  const handleViewMode = (view: string) => {
    setViewMode(view === 'list' ? 'list' : 'board');
  };

  const handleTaskAdded = () => {
    setTasks(taskService.getTasks());
  };

  return (
    <TaskProvider>
      <TasksProvider>
        <div className="flex w-full flex-col">
          <div className="mb-4  whitespace-nowrap md:mb-8">
            <TaskManagerToolbar
              viewMode={viewMode}
              handleViewMode={handleViewMode}
              onOpen={onOpen}
            />
          </div>

          {viewMode === 'board' && (
            <TaskCardView
              isNewTaskModalOpen={isNewTaskModalOpen}
              setNewTaskModalOpen={setNewTaskModalOpen}
              task={tasks}
              taskService={taskService}
              onTaskAdded={handleTaskAdded}
            />
          )}
          {viewMode === 'list' && <TaskListView task={tasks} taskService={taskService} />}
        </div>
      </TasksProvider>
    </TaskProvider>
  );
}
