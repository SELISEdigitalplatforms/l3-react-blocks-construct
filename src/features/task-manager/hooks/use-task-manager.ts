import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from 'hooks/use-error-handler';
import type {
  TaskQueryParams,
  TaskItemInsertInput,
  TaskItemUpdateInput,
  TaskSectionInsertInput,
  TaskSectionUpdateInput,
} from '../types/task-manager.types';
import type {
  InsertTaskItemResponse,
  UpdateTaskItemResponse,
  DeleteTaskItemResponse,
  InsertTaskSectionResponse,
  UpdateTaskSectionResponse,
  DeleteTaskSectionResponse,
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
} from '../services/task-manager.service';

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
  return useGlobalQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
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
export const useGetTaskSections = (params: { pageNo: number; pageSize: number }) => {
  return useGlobalQuery({
    queryKey: ['task-sections', params],
    queryFn: () => getTaskSections(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
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
// Task Item Hooks
export const useCreateTaskItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<InsertTaskItemResponse, Error, TaskItemInsertInput>({
    mutationFn: (input) => createTaskItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: t('common.success'),
        description: t('taskManager.taskCreated'),
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      handleError(error, {
        title: t('common.errors.somethingWentWrong'),
        defaultMessage: t('taskManager.errors.failedToCreateTask'),
      });
    },
  });
};

export const useUpdateTaskItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<
    UpdateTaskItemResponse,
    Error,
    { itemId: string; input: TaskItemUpdateInput }
  >({
    mutationFn: (variables) => updateTaskItem(variables.itemId, variables.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: t('common.success'),
        description: t('taskManager.taskUpdated'),
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      handleError(error, {
        title: t('common.errors.somethingWentWrong'),
        defaultMessage: t('taskManager.errors.failedToUpdateTask'),
      });
    },
  });
};

export const useDeleteTaskItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<DeleteTaskItemResponse, Error, string>({
    mutationFn: (itemId) => deleteTaskItem(itemId, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: t('common.success'),
        description: t('taskManager.taskDeleted'),
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      handleError(error, {
        title: t('common.errors.somethingWentWrong'),
        defaultMessage: t('taskManager.errors.failedToDeleteTask'),
      });
    },
  });
};

// Task Section Hooks
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
        title: t('common.success'),
        description: t('taskManager.sectionCreated'),
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      handleError(error, {
        title: t('common.errors.somethingWentWrong'),
        defaultMessage: t('taskManager.errors.failedToCreateSection'),
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
    UpdateTaskSectionResponse,
    Error,
    { sectionId: string; input: TaskSectionUpdateInput }
  >({
    mutationFn: (variables) => updateTaskSection(variables.sectionId, variables.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-sections'] });
      toast({
        title: t('common.success'),
        description: t('taskManager.sectionUpdated'),
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      handleError(error, {
        title: t('common.errors.somethingWentWrong'),
        defaultMessage: t('taskManager.errors.failedToUpdateSection'),
      });
    },
  });
};

export const useDeleteTaskSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation<DeleteTaskSectionResponse, Error, string>({
    mutationFn: (sectionId) => deleteTaskSection(sectionId, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-sections'] });
      toast({
        title: t('common.success'),
        description: t('taskManager.sectionDeleted'),
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      handleError(error, {
        title: t('common.errors.somethingWentWrong'),
        defaultMessage: t('taskManager.errors.failedToDeleteSection'),
      });
    },
  });
};
