import { useGlobalQuery, useGlobalMutation } from '@/state/query-client/hooks';
import type {
  GetCommentsResponse,
  GetSectionsResponse,
  GetTagsResponse,
  GetTasksResponse,
  TaskCommentInsertInput,
  TaskCommentUpdateInput,
  TaskTagInsertInput,
  TaskTagUpdateInput,
  TaskItemInsertInput,
  TaskItemUpdateInput,
  TaskSectionInsertInput,
  TaskSectionUpdateInput,
  UpdateTaskManagerSectionResponse,
} from '../types/task-manager.types';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '@/hooks/use-error-handler';
import type {
  InsertTaskItemResponse,
  UpdateTaskItemResponse,
  DeleteTaskItemResponse,
  InsertTaskSectionResponse,
  DeleteTaskSectionResponse,
  InsertTaskTagResponse,
  UpdateTaskTagResponse,
  DeleteTaskTagResponse,
  DeleteTaskCommentResponse,
  UpdateTaskCommentResponse,
  InsertTaskCommentResponse,
} from '../services/task-manager.service';
import {
  getTasks,
  getTaskSections,
  createTaskItem,
  updateTaskItem,
  deleteTaskItem,
  createTaskSection,
  updateTaskSection,
  deleteTaskSection,
  getUsers,
  getTaskTags,
  createTaskTag,
  updateTaskTag,
  deleteTaskTag,
  getTaskComments,
  deleteTaskComment,
  updateTaskComment,
  createTaskComment,
} from '../services/task-manager.service';
import { GetUsersPayload } from '@/modules/iam/types/user.types';

interface TaskQueryParams {
  pageNo: number;
  pageSize: number;
}

/**
 * Task Manager Hooks
 *
 * This file contains React Query hooks for task management operations.
 * These hooks provide a clean interface for components to interact with tasks and sections.
 */

/**
 * Hook to fetch tasks with pagination, filtering, and sorting
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with tasks data
 *
 * @example
 * const { data, isLoading, error } = useGetTasks({
 *   pageNo: 1,
 *   pageSize: 10,
 *   sectionId: 'section-123',
 *   assigneeId: 'user-123',
 *   isCompleted: false
 * });
 */
export const useGetTasks = (params: TaskQueryParams) => {
  const result = useGlobalQuery<GetTasksResponse>({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const data = await getTasks(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('[useGetTasks] Error:', error);
      throw error;
    },
  });

  return result;
};

/**
 * Hook to fetch task sections with pagination
 * @param params - Pagination parameters
 * @returns Query result with sections data
 *
 * @example
 * const { data, isLoading, error } = useGetTaskSections({
 *   pageNo: 1,
 *   pageSize: 20
 * });
 */
export const useGetTaskSections = (params: TaskQueryParams) => {
  return useGlobalQuery<GetSectionsResponse>({
    queryKey: ['task-sections', params],
    queryFn: () => getTaskSections(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to fetch task tags with pagination
 * @param params - Pagination parameters
 * @returns Query result with tags data
 *
 * @example
 * const { data, isLoading, error } = useGetTaskTags({
 *   pageNo: 1,
 *   pageSize: 20
 * });
 */
export const useGetTaskTags = (params: TaskQueryParams) => {
  return useGlobalQuery<GetTagsResponse>({
    queryKey: ['task-tags', params],
    queryFn: () => getTaskTags(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to fetch task sections with pagination
 * @param params - Pagination parameters
 * @returns Query result with sections data
 *
 * @example
 * const { data, isLoading, error } = useGetTaskComments({
 *   pageNo: 1,
 *   pageSize: 20
 * });
 */
export const useGetTaskComments = (params: TaskQueryParams) => {
  return useGlobalQuery<GetCommentsResponse>({
    queryKey: ['task-comments', params],
    queryFn: () => getTaskComments(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to create a new task item
 * @returns Mutation function to create task item with loading and error states
 *
 * @example
 * const { mutate: createTask, isPending } = useCreateTaskItem();
 * createTask({
 *   Title: 'New Task',
 *   Description: 'Task description',
 *   Assignee: 'user-123',
 *   Priority: TaskPriority.MEDIUM
 * });
 */
export const useCreateTaskItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<InsertTaskItemResponse, Error, TaskItemInsertInput>({
    mutationFn: createTaskItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        variant: 'success',
        title: t('TASK_CREATED'),
        description: t('TASK_CREATED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      console.error('Error in useCreateTaskItem:', error);
      handleError(error, {
        title: t('UNABLE_CREATE_TASK'),
        defaultMessage: t('FAILED_CREATE_TASK_TRY_AGAIN'),
      });
    },
  });
};

export const useUpdateTaskItem = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<
    UpdateTaskItemResponse,
    Error,
    { itemId: string; input: TaskItemUpdateInput }
  >({
    mutationFn: (variables) => updateTaskItem(variables.itemId, variables.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });
};

export const useDeleteTaskItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<DeleteTaskItemResponse, Error, string>({
    mutationFn: (itemId) => deleteTaskItem(itemId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        variant: 'success',
        title: t('TASK_REMOVED'),
        description: t('TASK_HAS_DELETED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });
};

export const useCreateTaskSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<InsertTaskSectionResponse, Error, TaskSectionInsertInput>({
    mutationFn: (input) => createTaskSection(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-sections'] });
      toast({
        variant: 'success',
        title: t('SECTION_CREATED'),
        description: t('NEW_SECTION_CREATED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      handleError(error, {
        title: t('UNABLE_CREATE_SECTION'),
        defaultMessage: t('FAILED_CREATE_SECTION_TRY_AGAIN'),
      });
    },
  });
};

export const useUpdateTaskSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<
    UpdateTaskManagerSectionResponse,
    Error,
    { sectionId: string; input: TaskSectionUpdateInput }
  >({
    mutationFn: (variables) => updateTaskSection(variables.sectionId, variables.input),
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: ['task-sections'] });

      const { acknowledged, totalImpactedData } = responseData.updateTaskManagerSection;

      if (acknowledged) {
        toast({
          variant: 'success',
          title: t('SECTION_UPDATED'),
          description: t('SECTION_UPDATED_SUCCESSFULLY'),
        });
      } else if (totalImpactedData === 0) {
        toast({
          variant: 'default',
          title: t('NO_CHANGES'),
          description: t('SECTION_NOT_MODIFIED'),
        });
      }

      return responseData;
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t('UPDATE_FAILED'),
        description: t('FAILED_UPDATE_SECTION_TRY_AGAIN'),
      });

      handleError(error);
    },
  });
};

export const useDeleteTaskSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<DeleteTaskSectionResponse, Error, string>({
    mutationFn: (sectionId) => deleteTaskSection(sectionId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-sections'] });
      toast({
        variant: 'success',
        title: t('SECTION_DELETED'),
        description: t('SECTION_DELETED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t('DELETE_FAILED'),
        description: t('FAILED_DELETE_SECTION_TRY_AGAIN'),
      });
      handleError(error);
    },
  });
};

/**
 * Hook to create a new task item
 * @returns Mutation function to create task item with loading and error states
 *
 * @example
 * const { mutate: createTask, isPending } = useCreateTaskItem();
 * createTask({
 *   Title: 'New Task',
 *   Description: 'Task description',
 *   Assignee: 'user-123',
 *   Priority: TaskPriority.MEDIUM
 * });
 */
export const useCreateTags = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<InsertTaskTagResponse, Error, TaskTagInsertInput>({
    mutationFn: createTaskTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        variant: 'success',
        title: t('TAG_CREATED'),
        description: t('NEW_TAG_CREATED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      console.error('Error in useCreateTaskItem:', error);
      handleError(error, {
        title: t('CREATION_FAILED'),
        defaultMessage: t('FAILED_CREATE_TAG_TRY_AGAIN'),
      });
    },
  });
};

export const useUpdateTags = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<
    UpdateTaskTagResponse,
    Error,
    { itemId: string; input: TaskTagUpdateInput }
  >({
    mutationFn: (variables) => updateTaskTag(variables.itemId, variables.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        variant: 'success',
        title: t('TAG_UPDATED'),
        description: t('TAG_UPDATED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });
};

export const useDeleteTags = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<DeleteTaskTagResponse, Error, string>({
    mutationFn: (itemId) => deleteTaskTag(itemId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        variant: 'success',
        title: t('TAG_DELETED'),
        description: t('TAG_DELETED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });
};

/**
 * Hook to create a new task comment
 * @returns Mutation function to create a task comment with loading and error states
 *
 * @example
 * const { mutate: createTaskComment, isPending } = useCreateTaskComment();
 * createTaskComment({
 *   TaskId: 'task-123',
 *   Content: 'This is a comment',
 *   Author: 'user-123'
 * });
 */
export const useCreateTaskComment = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useGlobalMutation<
    InsertTaskCommentResponse,
    Error,
    TaskCommentInsertInput & { taskId?: string }
  >({
    mutationFn: async (input) => {
      const taskId = input.taskId ?? input.TaskId;
      if (!taskId) {
        throw new Error('Task ID is required to create a comment');
      }

      // Create the comment with the task ID
      const result = await createTaskComment({
        ...input,
        TaskId: taskId,
        Timestamp: new Date().toISOString(),
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-comments'] });

      toast({
        variant: 'success',
        title: t('COMMENT_ADDED'),
        description: t('COMMENT_HAS_ADDED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      console.error('Error in useCreateTaskComment:', error);
      handleError(error, {
        title: t('UNABLE_ADD_COMMENT'),
        defaultMessage: t('FAILED_ADD_COMMENT'),
      });
    },
  });
};

/**
 * Hook to update an existing task comment
 * @returns Mutation function to update a task comment with loading and error states
 *
 * @example
 * const { mutate: updateTaskComment, isPending } = useUpdateTaskComment();
 * updateTaskComment({
 *   itemId: 'comment-123',
 *   input: {
 *     Content: 'Updated comment content'
 *   }
 * });
 */
export const useUpdateTaskComment = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useGlobalMutation<
    UpdateTaskCommentResponse,
    Error,
    { itemId: string; input: TaskCommentUpdateInput }
  >({
    mutationFn: (variables) => updateTaskComment(variables.itemId, variables.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments'] });
      toast({
        variant: 'success',
        title: t('COMMENT_UPDATED'),
        description: t('COMMENT_HAS_UPDATED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      console.error('Error in useUpdateTaskComment:', error);
      handleError(error);
    },
  });
};

/**
 * Hook to delete a task comment
 * @returns Mutation function to delete a task comment with loading and error states
 *
 * @example
 * const { mutate: deleteTaskComment, isPending } = useDeleteTaskComment();
 * deleteTaskComment('comment-123');
 */
export const useDeleteTaskComment = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useGlobalMutation<DeleteTaskCommentResponse, Error, string>({
    mutationFn: async (itemId) => {
      return deleteTaskComment(itemId, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments'] });
      toast({
        variant: 'success',
        title: t('COMMENT_DELETED'),
        description: t('COMMENT_HAS_DELETED_SUCCESSFULLY'),
      });
    },
    onError: (error: Error) => {
      console.error('Error in useDeleteTaskComment:', error);
      handleError(error);
    },
  });
};

/**
 * Custom hook of Rest API to fetch users from the API with pagination and optional filters.
 *
 * @param {GetUsersPayload} payload - The payload for the query containing pagination and filter options.
 * @returns {UseQueryResult<GetUsersResponse>} - The result of the query, including the fetched user data and loading state.
 *
 * @example
 * const { data, isLoading } = useGetUsers({ page: 1, pageSize: 10 });
 */

export const useGetUsers = (payload: GetUsersPayload) => {
  return useGlobalQuery({
    queryKey: ['getUsers', payload.page, payload.pageSize, payload.filter],
    queryFn: () => getUsers(payload),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};
