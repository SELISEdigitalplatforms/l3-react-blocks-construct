import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetTasks, useUpdateTaskItem, useDeleteTaskItem } from './use-task-manager';
import {
  TaskItem,
  TaskItemUpdateInput,
  TaskAttachments,
  TaskComments,
  Assignee,
  TaskPriority,
} from '../types/task-manager.types';

// Simple toast utility with proper types
interface ToastOptions {
  variant: 'default' | 'destructive' | 'success';
  title: string;
  description: string;
}

const useToast = () => ({
  toast: (options: ToastOptions) => {
    // Using console.info for better visibility in development
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

// Using string[] for tags as per TaskItem type

interface UseTaskDetailsReturn {
  task: TaskItem | null;
  toggleTaskCompletion: (isCompleted: boolean) => Promise<void>;
  removeTask: () => Promise<boolean>;
  updateTaskDetails: (updates: Partial<TaskItem>) => Promise<void>;
  addNewComment: (comment: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
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

  // Find and set the current task when taskId or tasksData changes
  useEffect(() => {
    if (taskId && tasksData?.TaskManagerItems?.items) {
      const foundTask = tasksData.TaskManagerItems.items.find((task) => task.ItemId === taskId) as
        | TaskItem
        | undefined;

      if (foundTask) {
        const mapToTags = (tagStrings?: string[]): string[] => {
          return tagStrings || [];
        };

        // Helper function to convert TaskAttachments to Attachment[]
        const mapToAttachments = (attachments?: TaskAttachments[]): TaskAttachments[] => {
          if (!attachments) return [];
          return attachments.map((att) => ({
            ItemId: att.ItemId || Date.now().toString(),
            FileName: att.FileName || 'Unknown',
            FileSize: att.FileSize || '0',
            FileType: att.FileType || 'other',
          }));
        };

        // Helper function to convert TaskComments to Comment[]
        const mapToComments = (comments?: TaskComments[]): TaskComments[] => {
          if (!comments) return [];
          return comments.map((comment) => ({
            ItemId: comment.ItemId || Date.now().toString(),
            Author: comment.Author || 'Unknown',
            Timestamp: comment.Timestamp || new Date().toISOString(),
            Content: comment.Content || '',
          }));
        };

        const mappedTask: TaskItem = {
          ItemId: foundTask.ItemId,
          Title: foundTask.Title,
          Description: foundTask.Description || '',
          IsCompleted: foundTask.IsCompleted || false,
          Priority: foundTask.Priority || TaskPriority.MEDIUM,
          Section: foundTask.Section || '',
          DueDate: foundTask.DueDate,
          // Preserve the existing Assignee array if the new one is empty
          Assignee:
            Array.isArray(foundTask.Assignee) && foundTask.Assignee.length > 0
              ? foundTask.Assignee
              : currentTask?.Assignee || [],
          Tags: mapToTags(foundTask.Tags),
          Attachments: mapToAttachments(foundTask.Attachments),
          Comments: mapToComments(foundTask.Comments),
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
  }, [taskId, tasksData, currentTask?.Assignee]);

  const { mutate: updateTask } = useUpdateTaskItem();

  // Update a task's details
  // This function accepts Partial<TaskItem> but converts it to TaskItemUpdateInput for the API
  const updateTaskDetails = useCallback(
    async (updates: Partial<TaskItem>) => {
      if (!taskId || !currentTask) return;

      const previousTask = { ...currentTask };

      try {
        const sanitizedUpdates: TaskItemUpdateInput = {};

        if ('Title' in updates) sanitizedUpdates.Title = updates.Title;
        if ('Description' in updates) sanitizedUpdates.Description = updates.Description;
        if ('DueDate' in updates) sanitizedUpdates.DueDate = updates.DueDate;
        if ('Priority' in updates) sanitizedUpdates.Priority = updates.Priority;
        if ('Section' in updates) sanitizedUpdates.Section = updates.Section;
        if ('Tags' in updates) sanitizedUpdates.Tags = updates.Tags;
        if ('IsCompleted' in updates) sanitizedUpdates.IsCompleted = updates.IsCompleted;
        if ('Language' in updates) sanitizedUpdates.Language = updates.Language;
        if ('OrganizationIds' in updates)
          sanitizedUpdates.OrganizationIds = updates.OrganizationIds;
        if ('IsDeleted' in updates) sanitizedUpdates.IsDeleted = updates.IsDeleted;

        // Handle Assignee - ensure it's always an array
        if ('Assignee' in updates) {
          sanitizedUpdates.Assignee = Array.isArray(updates.Assignee) ? updates.Assignee : [];
        }

        // Optimistically update the UI with the original updates
        const updatedTask = { ...currentTask, ...updates };
        setCurrentTask(updatedTask);

        // Call the API to update the task with the sanitized updates
        await updateTask({
          itemId: taskId,
          input: sanitizedUpdates,
        });

        // Force refresh the tasks list to ensure we have the latest data
        await refetchTasks();

        // Update the task in the parent component's task list
        // This ensures the parent component is aware of the changes
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('task-updated', { detail: updatedTask }));
        }
      } catch (error) {
        // If there's an error, revert to the previous task data
        console.error('Failed to update task:', error);
        setCurrentTask(previousTask);
        throw error; // Re-throw the error to be handled by the caller
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

  // Get the delete task mutation
  const { mutateAsync: deleteTask } = useDeleteTaskItem();

  // Remove a task
  const removeTask = useCallback(async () => {
    if (!taskId) return false;

    try {
      // Call the API to delete the task
      await deleteTask(taskId);

      // Refresh the tasks list
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

  // Add a new comment to a task
  const addNewComment = useCallback(
    async (comment: string) => {
      if (!taskId || !currentTask) return;

      try {
        const newComment = {
          id: Date.now().toString(),
          author: 'Current User', // Replace with actual user
          timestamp: new Date().toISOString(),
          text: comment,
        };

        // Optimistically update the UI
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                comments: [...(prev.Comments || []), newComment],
              }
            : null
        );

        // TODO: Call your API to add the comment
        // await addCommentToTask(taskId, newComment);

        // Refresh the tasks list
        await refetchTasks();
      } catch (error) {
        console.error('Failed to add comment:', error);
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
  );

  // Delete a comment from a task
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!taskId || !currentTask) return;

      try {
        // Optimistically update the UI
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                comments: (prev.Comments || []).filter((comment) => comment.ItemId !== commentId),
              }
            : null
        );

        // TODO: Call your API to delete the comment
        // await deleteCommentFromTask(taskId, commentId);

        // Refresh the tasks list
        await refetchTasks();
      } catch (error) {
        console.error('Failed to delete comment:', error);
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
  );

  // Add a new attachment to a task
  const addNewAttachment = useCallback(
    async (attachment: any) => {
      if (!taskId || !currentTask) return;

      try {
        // Optimistically update the UI
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                attachments: [...(prev.Attachments || []), attachment],
              }
            : null
        );

        // TODO: Call your API to add the attachment
        // await addAttachmentToTask(taskId, attachment);

        // Refresh the tasks list
        await refetchTasks();
      } catch (error) {
        console.error('Failed to add attachment:', error);
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
  );

  // Delete an attachment from a task
  const deleteAttachment = useCallback(
    async (attachmentId: string) => {
      if (!taskId || !currentTask) return;

      try {
        // Optimistically update the UI
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                attachments: (prev.Attachments || []).filter((a) => a.ItemId !== attachmentId),
              }
            : null
        );

        // TODO: Call your API to delete the attachment
        // await deleteAttachmentFromTask(taskId, attachmentId);

        // Refresh the tasks list
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

        // TODO: Call your API to add the assignee
        // await addAssigneeToTask(taskId, assignee);

        // Refresh the tasks list
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
        // Remove the assignee from the current task
        const updatedAssignees = currentTask.Assignee?.filter(
          (assignee) => assignee.ItemId !== assigneeId
        );

        // Update the task with the new assignees
        await updateTask({
          itemId: taskId,
          input: {
            Assignee: updatedAssignees,
          },
        });

        // Refresh the tasks list
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
        const updatedTags = [...(currentTask.Tags || []), tag];

        // Optimistic update
        setCurrentTask((prev: TaskItem | null) =>
          prev
            ? {
                ...prev,
                Tags: updatedTags,
              }
            : null
        );

        // Create a properly typed update object
        const update: Partial<TaskItem> = {
          Tags: updatedTags,
        };

        // Call API to add tag
        await updateTaskDetails(update);

        // Refetch to ensure data is in sync
        await refetchTasks();
      } catch (error) {
        // Using console.error for error logging
        // eslint-disable-next-line no-console
        console.error('Error adding tag:', error);
        // Revert on error by refetching the latest data
        await refetchTasks();

        // Show error toast
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

  // Remove a tag from the current task
  const deleteTag = useCallback(
    async (tag: string) => {
      if (!taskId || !currentTask) return;

      try {
        // Optimistic update
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                Tags: (prev.Tags || []).filter((t) => t !== tag),
              }
            : null
        );

        // TODO: Call API to remove tag
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Refetch to ensure data is in sync
        await refetchTasks();
      } catch (error) {
        console.error('Error removing tag:', error);
        // Revert on error
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
  );

  return {
    task: currentTask,
    updateTaskDetails,
    toggleTaskCompletion,
    removeTask,
    addNewComment,
    deleteComment,
    addNewAttachment,
    deleteAttachment,
    addNewAssignee,
    deleteAssignee,
    addNewTag,
    deleteTag,
  };
}
