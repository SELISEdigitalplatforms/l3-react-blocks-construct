import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetTasks, useUpdateTaskItem, useDeleteTaskItem } from './use-task-manager';
import {
  TaskItem,
  TaskItemUpdateInput,
  Assignee,
  TaskPriority,
  ItemTag,
} from '../types/task-manager.types';

interface ToastOptions {
  variant: 'default' | 'destructive' | 'success';
  title: string;
  description: string;
}

const useToast = () => ({
  toast: (options: ToastOptions) => {
    // eslint-disable-next-line no-console
    console.info(`[${options.variant}] ${options.title}: ${options.description}`);
  },
});

/**
 * useTaskDetails Hook
 *
 * A custom hook for managing the details of a specific task.
 * This hook supports:
 * - Retrieving task details
 * - Updating task properties
 * - Adding and removing comments, attachments, assignees, and tags
 * - Toggling task completion status
 * - Deleting tasks
 *
 * Features:
 * - Provides utility functions for task management
 * - Integrates with the task context for centralized state management
 * - Supports CRUD operations for task-related entities
 *
 * @param {string} [taskId] - The ID of the task to manage (optional)
 *
 * @returns {Object} An object containing task details and management functions
 *
 * @example
 * // Basic usage
 * const {
 *   task,
 *   updateTaskDetails,
 *   toggleTaskCompletion,
 *   addNewComment,
 *   deleteComment,
 *   addNewAssignee,
 *   deleteAssignee,
 *   addNewTag,
 *   deleteTag,
 *   removeTask,
 * } = useTaskDetails(taskId);
 */

interface UseTaskDetailsReturn {
  task: TaskItem | null;
  toggleTaskCompletion: (isCompleted: boolean) => Promise<void>;
  removeTask: () => Promise<boolean>;
  updateTaskDetails: (
    updates: Partial<TaskItem> | TaskItemUpdateInput
  ) => Promise<TaskItem | undefined>;
  addNewTag: (tag: string) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;
  addNewAssignee: (assignee: Assignee) => Promise<void>;
  deleteAssignee: (assigneeId: string) => Promise<void>;
}

export function useTaskDetails(taskId?: string): UseTaskDetailsReturn {
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: tasksData, refetch: refetchTasks } = useGetTasks({
    pageNo: 1,
    pageSize: 100,
  });

  useEffect(() => {
    if (taskId && tasksData?.TaskManagerItems?.items) {
      const foundTask = tasksData.TaskManagerItems.items.find((task) => task.ItemId === taskId);

      if (foundTask) {
        const mapToItemTags = (tags?: ItemTag[]): ItemTag[] => {
          return tags || [];
        };

        const mappedTask: TaskItem = {
          ItemId: foundTask.ItemId,
          Title: foundTask.Title,
          Description: foundTask.Description ?? '',
          IsCompleted: foundTask.IsCompleted ?? false,
          Priority: foundTask.Priority ?? TaskPriority.MEDIUM,
          Section: foundTask.Section ?? '',
          DueDate: foundTask.DueDate ?? '',
          Assignee:
            Array.isArray(foundTask.Assignee) && foundTask.Assignee.length > 0
              ? foundTask.Assignee
              : currentTask?.Assignee || [],
          ItemTag: mapToItemTags(foundTask.ItemTag),
          AttachmentField: Array.isArray(foundTask.AttachmentField)
            ? foundTask.AttachmentField
            : [],
          CreatedBy: foundTask.CreatedBy ?? '',
          CreatedDate: foundTask.CreatedDate ?? new Date().toISOString(),
          IsDeleted: foundTask.IsDeleted ?? false,
          Language: foundTask.Language ?? 'en',
          OrganizationIds: foundTask.OrganizationIds ?? [],
        };

        setCurrentTask(mappedTask);
      }
    } else {
      setCurrentTask(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, tasksData, currentTask?.Assignee]);

  const { mutate: updateTask } = useUpdateTaskItem();

  // Helper function to handle basic field updates
  const handleBasicFieldUpdates = (
    updates: Partial<TaskItem> | TaskItemUpdateInput,
    sanitizedUpdates: TaskItemUpdateInput
  ) => {
    const fieldsToUpdate: Array<keyof TaskItemUpdateInput> = [
      'Title',
      'Description',
      'DueDate',
      'Priority',
      'Section',
      'IsCompleted',
      'Language',
      'OrganizationIds',
      'IsDeleted',
    ];

    fieldsToUpdate.forEach((field) => {
      if (field in updates) {
        sanitizedUpdates[field] = updates[field] as any;
      }
    });
  };

  // Helper function to handle tag updates
  const handleTagUpdates = (
    updates: Partial<TaskItem> | TaskItemUpdateInput,
    sanitizedUpdates: TaskItemUpdateInput
  ) => {
    if ('ItemTag' in updates) {
      sanitizedUpdates.ItemTag = updates.ItemTag as ItemTag[];
    } else if ('Tags' in updates) {
      const tags = updates.Tags as (string | ItemTag)[] | undefined;
      if (Array.isArray(tags)) {
        sanitizedUpdates.ItemTag = tags.map((tag) => ({
          ItemId: typeof tag === 'string' ? tag : tag.ItemId,
          TagLabel: typeof tag === 'string' ? tag : tag.TagLabel,
        }));
      }
    }
  };

  // Helper function to handle assignee updates
  const handleAssigneeUpdates = (
    updates: Partial<TaskItem> | TaskItemUpdateInput,
    sanitizedUpdates: TaskItemUpdateInput
  ) => {
    if ('Assignee' in updates) {
      sanitizedUpdates.Assignee = Array.isArray(updates.Assignee) ? updates.Assignee : [];
    }
  };

  // Helper function to handle attachment updates
  const handleAttachmentUpdates = (
    updates: Partial<TaskItem> | TaskItemUpdateInput,
    sanitizedUpdates: TaskItemUpdateInput
  ) => {
    if ('AttachmentField' in updates) {
      sanitizedUpdates.AttachmentField = Array.isArray(updates.AttachmentField)
        ? updates.AttachmentField
        : [];
    }
  };

  const updateTaskDetails = useCallback(
    async (updates: Partial<TaskItem> | TaskItemUpdateInput) => {
      if (!taskId || !currentTask) return;

      const previousTask = { ...currentTask };

      try {
        const sanitizedUpdates: TaskItemUpdateInput = {};

        handleBasicFieldUpdates(updates, sanitizedUpdates);
        handleTagUpdates(updates, sanitizedUpdates);
        handleAssigneeUpdates(updates, sanitizedUpdates);
        handleAttachmentUpdates(updates, sanitizedUpdates);

        const updatedTask = { ...currentTask, ...updates };
        setCurrentTask(updatedTask as TaskItem);

        updateTask({
          itemId: taskId,
          input: sanitizedUpdates,
        });
        toast({
          variant: 'success',
          title: t('TASK_UPDATED'),
          description: t('TASK_UPDATED_SUCCESSFULLY'),
        });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('task-updated', { detail: updatedTask }));
        }

        return updatedTask;
      } catch (error) {
        console.error('Failed to update task:', error);
        setCurrentTask(previousTask);
        throw error;
      }
    },
    [taskId, currentTask, updateTask, t, toast]
  );

  const toggleTaskCompletion = useCallback(
    async (isCompleted: boolean) => {
      if (!taskId) return;

      try {
        setCurrentTask((prev) => (prev ? { ...prev, isCompleted } : null));

        await refetchTasks();
      } catch (error) {
        console.error('Failed to toggle task status:', error);
        await refetchTasks();
      }
    },
    [taskId, refetchTasks]
  );

  const { mutateAsync: deleteTask } = useDeleteTaskItem();

  const removeTask = useCallback(async () => {
    if (!taskId) return false;

    try {
      await deleteTask(taskId);

      await refetchTasks();
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        variant: 'destructive',
        title: t('UNABLE_DELETE_TASK'),
        description: t('FAILED_TO_DELETE_TASK'),
      });
      return false;
    }
  }, [taskId, refetchTasks, deleteTask, t, toast]);

  const addNewAssignee = useCallback(
    async (assignee: Assignee) => {
      if (!taskId || !currentTask) return;

      try {
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                Assignee: [assignee],
              }
            : null
        );

        await refetchTasks();
      } catch (error) {
        console.error('Failed to add assignee:', error);
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
  );

  const deleteAssignee = useCallback(
    async (assigneeId: string) => {
      if (!taskId || !currentTask) return;

      try {
        const updatedAssignees = currentTask.Assignee?.filter(
          (assignee) => assignee.ItemId !== assigneeId
        );

        updateTask({
          itemId: taskId,
          input: {
            Assignee: updatedAssignees,
          },
        });

        await refetchTasks();
      } catch (error) {
        console.error('Failed to delete assignee:', error);
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks, updateTask]
  );

  const addNewTag = useCallback(
    async (tag: string) => {
      if (!taskId || !currentTask) return;

      try {
        const newTag: ItemTag = {
          ItemId: Date.now().toString(),
          TagLabel: tag,
        };
        const updatedTags = [...(currentTask.ItemTag || []), newTag];

        setCurrentTask((prev: TaskItem | null) =>
          prev
            ? {
                ...prev,
                ItemTag: updatedTags,
              }
            : null
        );

        const update: Partial<TaskItem> = {
          ItemTag: updatedTags,
        };

        await updateTaskDetails(update);

        await refetchTasks();
      } catch (error) {
        console.error('Error adding tag:', error);
        await refetchTasks();

        toast({
          variant: 'destructive',
          title: t('TASK_CREATION_FAILED'),
          description: t('FAILED_CREATE_TASK'),
        });
      }
    },
    [taskId, currentTask, refetchTasks, t, toast, updateTaskDetails]
  );

  const deleteTag = useCallback(
    async (tagId: string) => {
      if (!taskId || !currentTask) return;

      try {
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                ItemTag: (prev.ItemTag || []).filter((t) => t.ItemId !== tagId),
              }
            : null
        );

        const update: TaskItemUpdateInput = {
          ItemTag: (currentTask.ItemTag || []).filter((t) => t.ItemId !== tagId),
        };

        await updateTaskDetails(update);

        await refetchTasks();
      } catch (error) {
        console.error('Error removing tag:', error);
        await refetchTasks();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId, currentTask, refetchTasks]
  );

  return {
    task: currentTask,
    updateTaskDetails,
    toggleTaskCompletion,
    removeTask,
    addNewAssignee,
    deleteAssignee,
    addNewTag: addNewTag,
    deleteTag: deleteTag,
  };
}
