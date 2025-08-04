import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TaskItem, TaskPriority } from '../types/task-manager.types';
import { useGetTasks, useCreateTaskItem } from './use-task-manager';

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
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const { data: tasksData, isLoading } = useGetTasks({
    pageNo: 1,
    pageSize: 100,
  });

  useEffect(() => {
    if (tasksData?.TaskManagerItems?.items) {
      setTasks(tasksData.TaskManagerItems.items);
    }
  }, [tasksData]);

  const { mutateAsync: createTaskItem } = useCreateTaskItem();

  const createTask = (title: string, status: string) => {
    if (!title.trim()) return null;

    const tempId = uuidv4();
    const newTask: TaskItem = {
      ItemId: tempId,
      Title: title,
      Section: status || 'todo',
      IsCompleted: false,
      IsDeleted: false,
      CreatedDate: new Date().toISOString(),
      Priority: TaskPriority.MEDIUM,
    } as TaskItem;

    // Optimistically update UI
    setTasks((prev) => [newTask, ...prev]);

    // Persist to backend
    createTaskItem({
      Title: title,
      Section: status || '',
      IsCompleted: false,
    })
      .then((response: any) => {
        const realId = response?.insertTaskManagerItem?.itemId;
        if (realId) {
          // Replace tempId with realId
          setTasks((prev) =>
            prev.map((task) => (task.ItemId === tempId ? { ...task, ItemId: realId } : task))
          );
        }
      })
      .catch(() => {
        // Rollback on failure
        setTasks((prev) => prev.filter((task) => task.ItemId !== tempId));
      });

    return tempId;
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.ItemId !== id));
  };

  const toggleTaskCompletion = (id: string, isCompleted: boolean) => {
    setTasks((prev) =>
      prev.map((task) => (task.ItemId === id ? { ...task, IsCompleted: isCompleted } : task))
    );
  };

  const updateTaskOrder = (activeIndex: number, overIndex: number) => {
    setTasks((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(activeIndex, 1);
      updated.splice(overIndex, 0, removed);
      return updated;
    });
  };

  const getFilteredTasks = (statusFilter: 'todo' | 'inprogress' | 'done' | null) => {
    return statusFilter ? tasks.filter((task) => task.Section === statusFilter) : tasks;
  };

  const changeTaskStatus = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
    setTasks((prev) =>
      prev.map((task) => (task.ItemId === taskId ? { ...task, Section: newStatus } : task))
    );
  };

  const updateTaskProperties = (taskId: string, updates: Partial<TaskItem>) => {
    setTasks((prev) =>
      prev.map((task) => (task.ItemId === taskId ? { ...task, ...updates } : task))
    );
  };

  return {
    tasks,
    isLoading,
    createTask,
    removeTask,
    toggleTaskCompletion,
    updateTaskOrder,
    getFilteredTasks,
    changeTaskStatus,
    updateTaskProperties,
  };
}
