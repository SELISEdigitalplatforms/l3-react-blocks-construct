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

  const createTask = (title: string, status: string) => {
    if (!title.trim()) return null;

    const tempId = uuidv4();
    const newTask: TaskItem = {
      ItemId: tempId,
      Title: title,
      Section: status ?? '',
      IsCompleted: false,
      IsDeleted: false,
      CreatedDate: new Date().toISOString(),
      DueDate: new Date().toISOString(),
      Priority: TaskPriority.MEDIUM,
      ItemTag: [],
    } as TaskItem;

    setTasks((prev) => [newTask, ...prev]);

    const handleTaskCreationResponse = (response: any) => {
      const realId = response?.insertTaskManagerItem?.itemId;
      if (!realId) return;

      const updateTaskId = (task: TaskItem) =>
        task.ItemId === tempId ? { ...task, ItemId: realId } : task;

      setTasks((prev) => prev.map(updateTaskId));
    };

    const handleTaskCreationError = () => {
      const filterOutTempTask = (task: TaskItem) => task.ItemId !== tempId;
      setTasks((prev) => prev.filter(filterOutTempTask));
    };

    createTaskItem({
      Title: title,
      Priority: TaskPriority.MEDIUM,
      Section: status ?? '',
      IsCompleted: false,
      DueDate: new Date().toISOString(),
    })
      .then(handleTaskCreationResponse)
      .catch(handleTaskCreationError);

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

  const getFilteredTasks = useCallback(() => {
    const matchesSearchQuery = (task: TaskItem): boolean => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        task.Title?.toLowerCase().includes(searchLower) ||
        task.Description?.toLowerCase().includes(searchLower) ||
        Boolean(task.ItemTag?.some((tag) => tag.TagLabel.toLowerCase().includes(searchLower)))
      );
    };

    const matchesPriority = (task: TaskItem): boolean => {
      return !filters.priorities?.length || filters.priorities.some((p) => p === task.Priority);
    };

    const matchesStatus = (task: TaskItem): boolean => {
      return !filters.statuses?.length || !task.Section || filters.statuses.includes(task.Section);
    };

    const matchesAssignees = (task: TaskItem): boolean => {
      if (!filters.assignees?.length || !task.Assignee?.length) return true;
      return task.Assignee.some((assignee) => filters.assignees?.includes(assignee.ItemId));
    };

    const matchesTags = (task: TaskItem): boolean => {
      if (!filters.tags?.length || !task.ItemTag?.length) return true;

      const tagIds = new Set(filters.tags.map(({ ItemId }) => ItemId));
      return task.ItemTag.some(({ ItemId }) => tagIds.has(ItemId));
    };

    const matchesDueDate = (task: TaskItem): boolean => {
      if (!filters.dueDate?.from && !filters.dueDate?.to) return true;

      const taskDueDate = task.DueDate ? new Date(task.DueDate) : null;
      if (!taskDueDate) return true;

      const { from, to } = filters.dueDate;
      const isAfterFrom = !from || taskDueDate >= from;
      const isBeforeTo = !to || taskDueDate <= to;

      return isAfterFrom && isBeforeTo;
    };

    return tasks.filter(
      (task) =>
        matchesSearchQuery(task) &&
        matchesPriority(task) &&
        matchesStatus(task) &&
        matchesAssignees(task) &&
        matchesTags(task) &&
        matchesDueDate(task)
    );
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
