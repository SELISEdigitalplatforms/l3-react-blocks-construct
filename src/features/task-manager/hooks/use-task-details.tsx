import { useState, useEffect, useCallback } from 'react';
import { TaskItem, TaskComments, TaskAttachments, TaskPriority } from '../types/task-manager.types';
import { useGetTasks } from './use-task-manager';

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

export function useTaskDetails(taskId?: string) {
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  // First, get the tasks without filtering
  const { data: tasksData, refetch: refetchTasks } = useGetTasks({
    pageNo: 1,
    pageSize: 100, // Adjust based on your needs
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
          Section: foundTask.Section || 'To Do',
          DueDate: foundTask.DueDate,
          Assignee: foundTask.Assignee ? foundTask.Assignee : '',
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
  }, [taskId, tasksData]);

  // Update a task's details
  const updateTaskDetails = useCallback(
    async (updates: Partial<TaskItem>) => {
      if (!taskId || !currentTask) return;

      try {
        // Optimistically update the UI
        setCurrentTask((prev) => (prev ? { ...prev, ...updates } : null));

        // TODO: Call your API to update the task
        // await updateTaskItem(taskId, updates);

        // Refresh the tasks list to ensure consistency
        await refetchTasks();
      } catch (error) {
        console.error('Failed to update task:', error);
        // Revert the optimistic update on error
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
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

  // Remove a task
  const removeTask = useCallback(async () => {
    if (!taskId) return false;

    try {
      // TODO: Call your API to delete the task
      // await deleteTaskItem(taskId);

      // Refresh the tasks list
      await refetchTasks();
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  }, [taskId, refetchTasks]);

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

  // Add a new assignee to a task
  const addNewAssignee = useCallback(
    async (assignee: string) => {
      if (!taskId || !currentTask) return;

      try {
        // Optimistically update the UI
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                Assignee: assignee,
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
  const deleteAssignee = useCallback(async () => {
    if (!taskId || !currentTask) return;

    try {
      // Optimistically update the UI
      setCurrentTask((prev) =>
        prev
          ? {
              ...prev,
              Assignee: '',
            }
          : null
      );

      // TODO: Call your API to remove the assignee
      // await removeAssigneeFromTask(taskId);

      // Refresh the tasks list
      await refetchTasks();
    } catch (error) {
      console.error('Failed to remove assignee:', error);
      await refetchTasks();
    }
  }, [taskId, currentTask, refetchTasks]);

  // Add a new tag to the current task
  const addNewTag = useCallback(
    async (tag: string) => {
      if (!taskId || !currentTask) return;

      try {
        // Optimistic update
        setCurrentTask((prev) =>
          prev
            ? {
                ...prev,
                Tags: [...(prev.Tags || []), tag],
              }
            : null
        );

        // TODO: Call API to add tag
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Refetch to ensure data is in sync
        await refetchTasks();
      } catch (error) {
        console.error('Error adding tag:', error);
        // Revert on error
        await refetchTasks();
      }
    },
    [taskId, currentTask, refetchTasks]
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
