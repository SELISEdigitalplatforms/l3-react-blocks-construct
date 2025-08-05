import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TaskItem, TaskPriority, ItemTag } from '../types/task-manager.types';
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

interface UseListTasksProps {
  searchQuery?: string;
  filters?: {
    priorities?: string[];
    statuses?: string[];
    assignees?: string[];
    tags?: ItemTag[];
    dueDate?: {
      from?: Date;
      to?: Date;
    };
  };
}

export function useListTasks({ searchQuery = '', filters = {} }: UseListTasksProps = {}) {
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

  const createNewTask = (title: string, status: string, id: string): TaskItem =>
    ({
      ItemId: id,
      Title: title,
      Section: status || 'todo',
      IsCompleted: false,
      IsDeleted: false,
      CreatedDate: new Date().toISOString(),
      Priority: TaskPriority.MEDIUM,
      ItemTag: [],
    }) as TaskItem;

  const handleTaskCreationSuccess = (response: any, tempId: string) => {
    const realId = response?.insertTaskManagerItem?.itemId;
    if (realId) {
      setTasks((prev) =>
        prev.map((task) => (task.ItemId === tempId ? { ...task, ItemId: realId } : task))
      );
    }
  };

  const handleTaskCreationError = (tempId: string) => {
    setTasks((prev) => prev.filter((task) => task.ItemId !== tempId));
  };

  const createTask = (title: string, status: string) => {
    if (!title.trim()) return null;

    const tempId = uuidv4();
    const newTask = createNewTask(title, status, tempId);

    setTasks((prev) => [newTask, ...prev]);

    createTaskItem({
      Title: title,
      Section: status || '',
      IsCompleted: false,
    })
      .then((response) => handleTaskCreationSuccess(response, tempId))
      .catch(() => handleTaskCreationError(tempId));

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

  const matchesSearchQuery = (task: TaskItem, query: string): boolean => {
    if (!query) return true;

    const searchLower = query.toLowerCase();
    return (
      task.Title?.toLowerCase().includes(searchLower) ||
      task.Description?.toLowerCase().includes(searchLower) ||
      Boolean(task.ItemTag?.some((tag) => tag.TagLabel.toLowerCase().includes(searchLower)))
    );
  };

  const matchesPriority = (task: TaskItem, priorities: string[] = []): boolean => {
    return !priorities.length || !task.Priority || priorities.includes(task.Priority);
  };

  const matchesStatus = (task: TaskItem, statuses: string[] = []): boolean => {
    return !statuses.length || !task.Section || statuses.includes(task.Section);
  };

  const matchesAssignees = (task: TaskItem, assigneeIds: string[] = []): boolean => {
    if (!assigneeIds.length || !task.Assignee?.length) return true;
    return task.Assignee.some(
      (assignee) => assignee.ItemId && assigneeIds.includes(assignee.ItemId)
    );
  };

  const matchesTags = (task: TaskItem, tagFilters: Array<{ ItemId: string }> = []): boolean => {
    if (!tagFilters.length || !task.ItemTag?.length) return true;
    const tagIds = tagFilters.map((t) => t.ItemId);
    return task.ItemTag.some((tag) => tag.ItemId && tagIds.includes(tag.ItemId));
  };

  const matchesDueDate = (task: TaskItem, dueDate?: { from?: Date; to?: Date }): boolean => {
    if (!dueDate || (!dueDate.from && !dueDate.to)) return true;
    if (!task.DueDate) return false;

    const taskDueDate = new Date(task.DueDate);
    const afterStart = !dueDate.from || taskDueDate >= dueDate.from;
    const beforeEnd = !dueDate.to || taskDueDate <= dueDate.to;

    return afterStart && beforeEnd;
  };

  const getFilteredTasks = useCallback(() => {
    return tasks.filter((task) => {
      if (!matchesSearchQuery(task, searchQuery)) return false;
      if (!matchesPriority(task, filters.priorities)) return false;
      if (!matchesStatus(task, filters.statuses)) return false;
      if (!matchesAssignees(task, filters.assignees)) return false;
      if (!matchesTags(task, filters.tags)) return false;
      if (!matchesDueDate(task, filters.dueDate)) return false;

      return true;
    });
  }, [tasks, searchQuery, filters]);

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
