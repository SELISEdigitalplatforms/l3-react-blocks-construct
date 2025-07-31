import { useState } from 'react';
import { TaskItem } from '../types/task-manager.types';

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
  // Local state for tasks (empty for now, ready for API integration)
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Create a new task
  const createTask = (title: string, status: string) => {
    if (title.trim()) {
      const newTask: TaskItem = {
        ItemId: Date.now().toString(),
        Title: title,
        Section: status,
        IsCompleted: false,
        IsDeleted: false,
        CreatedBy: 'current-user', // TODO: Replace with actual user
        CreatedDate: new Date().toISOString(),
        Language: 'en', // Default language
        OrganizationIds: [], // Default empty array
      };
      setTasks((prev) => [newTask, ...prev]);
      return newTask.ItemId;
    }
    return null;
  };

  // Remove a task
  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.ItemId !== id));
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string, isCompleted: boolean) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.ItemId === id ? { ...task, IsCompleted: isCompleted } : task
      )
    );
  };

  // Update task order
  const updateTaskOrder = (activeIndex: number, overIndex: number) => {
    setTasks((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(activeIndex, 1);
      updated.splice(overIndex, 0, removed);
      return updated;
    });
  };

  // Get filtered tasks
  const getFilteredTasks = (statusFilter: 'todo' | 'inprogress' | 'done' | null) => {
    return statusFilter ? tasks.filter((task) => task.Section === statusFilter) : tasks;
  };

  // Change task status
  const changeTaskStatus = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
    setTasks((prev) =>
      prev.map((task) => 
        task.ItemId === taskId ? { ...task, Section: newStatus } : task
      )
    );
  };

  // Update task properties
  const updateTaskProperties = (taskId: string, updates: Partial<TaskItem>) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.ItemId === taskId ? { ...task, ...updates } : task
      )
    );
  };

  return {
    tasks,
    createTask,
    removeTask,
    toggleTaskCompletion,
    updateTaskOrder,
    getFilteredTasks,
    changeTaskStatus,
    updateTaskProperties,
  };
}
