import { ITask, useTaskContext } from '../contexts/task-context';

/**
 * useListTasks Hook
 *
 * A custom hook for managing tasks in a list view.
 * This hook supports:
 * - Creating, updating, and deleting tasks
 * - Reordering tasks within a list
 * - Filtering tasks by status
 * - Changing task statuses
 *
 * Features:
 * - Provides utility functions for task management
 * - Integrates with the task context for centralized state management
 * - Supports filtering and reordering tasks
 *
 * @returns {Object} An object containing task management functions and the list of tasks
 *
 * @example
 * // Basic usage
 * const {
 *   tasks,
 *   createTask,
 *   removeTask,
 *   toggleTaskCompletion,
 *   updateTaskOrder,
 *   getFilteredTasks,
 *   changeTaskStatus,
 *   updateTaskProperties,
 * } = useListTasks();
 */

export function useListTasks() {
  const { listTasks, addTask, deleteTask, updateTaskStatus, reorderTasks, moveTask, updateTask } =
    useTaskContext();

  const createTask = (title: string, status: string) => {
    const section = status;

    return addTask({
      title,
      section,
      priority: '',
      dueDate: null,
      isCompleted: false,
    });
  };

  const removeTask = (id: string) => {
    deleteTask(id);
  };

  const toggleTaskCompletion = (id: string, isCompleted: boolean) => {
    updateTaskStatus(id, isCompleted);
  };

  const updateTaskOrder = (
    activeIndex: number,
    overIndex: number,
    status?: 'todo' | 'inprogress' | 'done'
  ) => {
    reorderTasks(activeIndex, overIndex, status);
  };

  const getFilteredTasks = (statusFilter: 'todo' | 'inprogress' | 'done' | null) => {
    return statusFilter ? listTasks.filter((task) => task.status === statusFilter) : listTasks;
  };

  const changeTaskStatus = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
    moveTask(taskId, newStatus);
  };

  const updateTaskProperties = (taskId: string, updates: Partial<ITask>) => {
    const detailsUpdates: Record<string, any> = {};

    if (updates.content) detailsUpdates.title = updates.content;
    if (updates.priority) detailsUpdates.priority = updates.priority;
    if (updates.isCompleted !== undefined) detailsUpdates.isCompleted = updates.isCompleted;

    updateTask(taskId, detailsUpdates);
  };

  return {
    tasks: listTasks,
    createTask,
    removeTask,
    toggleTaskCompletion,
    updateTaskOrder,
    getFilteredTasks,
    changeTaskStatus,
    updateTaskProperties,
  };
}
