import { useState } from 'react';
import { TaskDetails } from '../services/task-service';

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

export function useTaskDetails(taskId?: string) {
  // Local state for all tasks (empty for now, ready for API integration)
  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([]);

  // Find the task by id
  const task = taskId ? taskDetails.find((task) => task.id === taskId) : null;

  // Get all tasks
  const getAllTasks = () => taskDetails;

  // Update a task's details
  const updateTaskDetails = (updates: Partial<TaskDetails>) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      );
    }
  };

  // Remove a task
  const removeTask = () => {
    if (taskId) {
      setTaskDetails((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = (isCompleted: boolean) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, isCompleted } : task))
      );
    }
  };

  // Add a new comment
  const addNewComment = (author: string, text: string) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: [
                  ...task.comments,
                  {
                    id: Date.now().toString(),
                    author,
                    timestamp: new Date().toISOString(),
                    text,
                  },
                ],
              }
            : task
        )
      );
    }
  };

  // Delete a comment
  const deleteComment = (commentId: string) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: task.comments.filter((comment) => comment.id !== commentId),
              }
            : task
        )
      );
    }
  };

  // Add a new attachment
  const addNewAttachment = (name: string, size: string, type: 'pdf' | 'image' | 'other') => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                attachments: [
                  ...task.attachments,
                  {
                    id: Date.now().toString(),
                    name,
                    size,
                    type,
                  },
                ],
              }
            : task
        )
      );
    }
  };

  // Delete an attachment
  const deleteAttachment = (attachmentId: string) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                attachments: task.attachments.filter((att) => att.id !== attachmentId),
              }
            : task
        )
      );
    }
  };

  // Add a new assignee
  const addNewAssignee = (name: string, avatar: string) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assignees: [...task.assignees, { id: Date.now().toString(), name, avatar }],
              }
            : task
        )
      );
    }
  };

  // Delete an assignee
  const deleteAssignee = (assigneeId: string) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assignees: task.assignees.filter((a) => a.id !== assigneeId),
              }
            : task
        )
      );
    }
  };

  // Add a new tag
  const addNewTag = (label: string) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                tags: [...task.tags, { id: Date.now().toString(), label }],
              }
            : task
        )
      );
    }
  };

  // Delete a tag
  const deleteTag = (tagId: string) => {
    if (taskId) {
      setTaskDetails((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                tags: task.tags.filter((tag) => tag.id !== tagId),
              }
            : task
        )
      );
    }
  };

  return {
    task,
    tasks: taskDetails,
    getAllTasks,
    updateTaskDetails,
    removeTask,
    toggleTaskCompletion,
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
