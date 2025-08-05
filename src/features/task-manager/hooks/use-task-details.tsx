import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetTasks, useUpdateTaskItem, useDeleteTaskItem } from './use-task-manager';
import {
  TaskItem,
  TaskItemUpdateInput,
  TaskAttachments,
  Assignee,
  TaskPriority,
  ItemTag,
} from '../types/task-manager.types';

// Simple toast utility with proper types
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
 *   addNewAttachment,
 *   deleteAttachment,
 *   addNewAssignee,
 *   deleteAssignee,
 *   addNewTag,
 *   deleteTag,
 *   removeTask,
 * } = useTaskDetails(taskId);
 */

// Using ItemTag[] for ItemTag as per TaskItem type

interface UseTaskDetailsReturn {
  task: TaskItem | null;
  toggleTaskCompletion: (isCompleted: boolean) => Promise<void>;
  removeTask: () => Promise<boolean>;
  updateTaskDetails: (updates: Partial<TaskItem>) => Promise<void>;
  addNewAttachment: (attachment: TaskAttachments) => Promise<void>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
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
      const foundTask = tasksData.TaskManagerItems.items.find((task) => task.ItemId === taskId) as
        | TaskItem
        | undefined;

      if (foundTask) {
        const mapToItemTags = (tags?: ItemTag[]): ItemTag[] => {
          return tags || [];
        };

        const mapToAttachments = (attachments?: TaskAttachments[]): TaskAttachments[] => {
          if (!attachments) return [];
          return attachments.map((att) => ({
            ItemId: att.ItemId || '',
            FileName: att.FileName || 'Unknown',
            FileSize: att.FileSize || '0',
            FileType: att.FileType || 'other',
          }));
        };

        // Comments are handled directly in the view component

        const mappedTask: TaskItem = {
          ItemId: foundTask.ItemId,
          Title: foundTask.Title,
          Description: foundTask.Description || '',
          IsCompleted: foundTask.IsCompleted || false,
          Priority: foundTask.Priority || TaskPriority.MEDIUM,
          Section: foundTask.Section || '',
          DueDate: foundTask.DueDate,
          Assignee:
            Array.isArray(foundTask.Assignee) && foundTask.Assignee.length > 0
              ? foundTask.Assignee
              : currentTask?.Assignee || [],
          ItemTag: mapToItemTags(foundTask.ItemTag),
          Attachments: mapToAttachments(
            foundTask.Attachments && foundTask.Attachments.length > 0
              ? foundTask.Attachments
              : currentTask?.Attachments
          ),
          Comments: foundTask.Comments || [],
          CreatedBy: foundTask.CreatedBy || '',
          CreatedDate: foundTask.CreatedDate || new Date().toISOString(),
          IsDeleted: foundTask.IsDeleted || false,
          Language: foundTask.Language || 'en',
          OrganizationIds: foundTask.OrganizationIds || [],
        };

        setCurrentTask(mappedTask);
      }
    } else {
      setCurrentTask(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, tasksData, currentTask?.Assignee]);

  const { mutate: updateTask } = useUpdateTaskItem();

  const updateTaskDetails = useCallback(
    async (updates: Partial<TaskItem> | TaskItemUpdateInput) => {
      if (!taskId || !currentTask) return;

      const previousTask = { ...currentTask };

      try {
        const sanitizedUpdates: TaskItemUpdateInput = {};

        if ('Title' in updates) sanitizedUpdates.Title = updates.Title as string;
        if ('Description' in updates) sanitizedUpdates.Description = updates.Description as string;
        if ('DueDate' in updates) sanitizedUpdates.DueDate = updates.DueDate as string;
        if ('Priority' in updates) sanitizedUpdates.Priority = updates.Priority as TaskPriority;
        if ('Section' in updates) sanitizedUpdates.Section = updates.Section as string;
        if ('IsCompleted' in updates) sanitizedUpdates.IsCompleted = updates.IsCompleted as boolean;
        if ('Language' in updates) sanitizedUpdates.Language = updates.Language as string;
        if ('OrganizationIds' in updates)
          sanitizedUpdates.OrganizationIds = updates.OrganizationIds as string[];
        if ('IsDeleted' in updates) sanitizedUpdates.IsDeleted = updates.IsDeleted as boolean;

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

        // Handle Assignee - ensure it's always an array
        if ('Assignee' in updates) {
          sanitizedUpdates.Assignee = Array.isArray(updates.Assignee) ? updates.Assignee : [];
        }

        // Optimistically update the UI with the original updates
        const updatedTask = { ...currentTask, ...updates };
        setCurrentTask(updatedTask as TaskItem);

        // Call the API to update the task with the sanitized updates
        await updateTask({
          itemId: taskId,
          input: sanitizedUpdates,
        });

        await refetchTasks();

        // This ensures the parent component is aware of the changes
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('task-updated', { detail: updatedTask }));
        }
      } catch (error) {
        console.error('Failed to update task:', error);
        setCurrentTask(previousTask);
        throw error;
      }
    },
    [taskId, currentTask, updateTask, refetchTasks]
  );

  // Toggle task completion status
  const toggleTaskCompletion = useCallback(
    async (isCompleted: boolean) => {
      if (!taskId) return;

      try {
        // Optimistically update the UI
        setCurrentTask((prev) => (prev ? { ...prev, isCompleted } : null));

        // TODO: Call your API to update the task status
        // await updateTaskItem(taskId, { isCompleted });

        // Refresh the tasks list
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
        title: t('ERROR'),
        description: t('FAILED_TO_DELETE_TASK'),
      });
      return false;
    }
  }, [taskId, refetchTasks, deleteTask, t, toast]);

  // Comment functionality is handled directly in the view component

  // Add a new attachment to a task
  const addNewAttachment = useCallback(
    async (attachment: any) => {
      if (!taskId || !currentTask) return;

      try {
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                attachments: [...(prev.Attachments || []), attachment],
              }
            : null
        );

        await refetchTasks();
      } catch (error) {
        console.error('Failed to add attachment:', error);
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
  );

  const deleteAttachment = useCallback(
    async (attachmentId: string) => {
      if (!taskId || !currentTask) return;

      try {
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                attachments: (prev.Attachments || []).filter((a) => a.ItemId !== attachmentId),
              }
            : null
        );

        await refetchTasks();
      } catch (error) {
        console.error('Failed to delete attachment:', error);
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
  );

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

  // Delete an assignee from a task
  const deleteAssignee = useCallback(
    async (assigneeId: string) => {
      if (!taskId || !currentTask) return;

      try {
        const updatedAssignees = currentTask.Assignee?.filter(
          (assignee) => assignee.ItemId !== assigneeId
        );

        await updateTask({
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

  // Add a new tag to the current task
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
          title: t ? t('Error adding tag') : 'Error adding tag',
          description: t
            ? t('There was an error adding the tag to the task')
            : 'There was an error adding the tag to the task',
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
    addNewAttachment,
    deleteAttachment,
    addNewAssignee,
    deleteAssignee,
    addNewTag: addNewTag,
    deleteTag: deleteTag,
  };
}
