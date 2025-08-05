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

    createTaskItem({
      Title: title,
      Section: status ?? '',
      IsCompleted: false,
      DueDate: new Date().toISOString(),
    })
      .then((response: any) => {
        const realId = response?.insertTaskManagerItem?.itemId;
        if (realId) {
          setTasks((prev) =>
            prev.map((task) => (task.ItemId === tempId ? { ...task, ItemId: realId } : task))
          );
        }
      })
      .catch(() => {
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

  const getFilteredTasks = useCallback(() => {
    return tasks.filter((task) => {
      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          task.Title?.toLowerCase().includes(searchLower) ||
          task.Description?.toLowerCase().includes(searchLower) ||
          task.ItemTag?.some((tag) => tag.TagLabel.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Filter by priorities
      if (filters.priorities?.length && !filters.priorities.some((p) => p === task.Priority)) {
        return false;
      }

      // Filter by statuses (sections)
      if (filters.statuses?.length && task.Section && !filters.statuses.includes(task.Section)) {
        return false;
      }

      // Filter by assignees
      if (filters.assignees?.length && task.Assignee?.length) {
        const hasMatchingAssignee = task.Assignee.some((assignee) =>
          filters.assignees?.includes(assignee.ItemId)
        );
        if (!hasMatchingAssignee) return false;
      }

      // Filter by tags
      if (filters.tags?.length && task.ItemTag?.length) {
        const hasMatchingTag = task.ItemTag.some((tag) =>
          filters.tags?.some((t) => t.ItemId === tag.ItemId)
        );
        if (!hasMatchingTag) return false;
      }

      // Filter by due date
      if (filters.dueDate?.from || filters.dueDate?.to) {
        const taskDueDate = task.DueDate ? new Date(task.DueDate) : null;

        if (filters.dueDate.from && taskDueDate && taskDueDate < filters.dueDate.from) {
          return false;
        }
        if (filters.dueDate.to && taskDueDate && taskDueDate > filters.dueDate.to) {
          return false;
        }
      }

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
