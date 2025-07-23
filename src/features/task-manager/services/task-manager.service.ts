import { graphqlClient } from 'lib/graphql-client';
import { GET_TASK_MANAGER_QUERY, GET_TASK_MANAGER_SECTIONS_QUERY } from '../graphql/queries';
import type {
  TaskItemInsertInput,
  TaskItemUpdateInput,
  TaskSectionInsertInput,
  TaskSectionUpdateInput,
  TaskQueryParams,
  PaginationParams,
  GetTasksResponse,
  GetSectionsResponse,
} from '../types/task-manager.types';

export interface BaseMutationResponse {
  itemId: string;
  totalImpactedData: number;
  acknowledged: boolean;
}

export interface InsertTaskItemResponse {
  insertTaskManagerItem: BaseMutationResponse;
}

export interface UpdateTaskItemResponse {
  updateTaskManagerItem: BaseMutationResponse;
}

export interface DeleteTaskItemResponse {
  deleteTaskManagerItem: BaseMutationResponse;
}

export interface InsertTaskSectionResponse {
  insertTaskManagerSection: BaseMutationResponse;
}

export interface UpdateTaskSectionResponse {
  updateTaskManagerSection: BaseMutationResponse;
}

export interface DeleteTaskSectionResponse {
  deleteTaskManagerSection: BaseMutationResponse;
}

import {
  INSERT_TASK_MANAGER_ITEM_MUTATION,
  UPDATE_TASK_MANAGER_ITEM_MUTATION,
  DELETE_TASK_MANAGER_ITEM_MUTATION,
  INSERT_TASK_MANAGER_SECTION_MUTATION,
  UPDATE_TASK_MANAGER_SECTION_MUTATION,
  DELETE_TASK_MANAGER_SECTION_MUTATION,
} from '../graphql/mutations';

/**
 * Task Manager Service
 *
 * This service provides GraphQL-based operations for task management.
 * It handles all CRUD operations for tasks and sections.
 */

/**
 * Fetches paginated task items with filtering and sorting
 * @param params - Query parameters including pagination and filters
 * @returns Promise with task items data
 */
export const getTasks = async (params: TaskQueryParams): Promise<GetTasksResponse> => {
  const { pageNo, pageSize, filter, sort, ...rest } = params;

  const input = {
    pageNo,
    pageSize,
    filter: filter ? JSON.stringify(filter) : undefined,
    sort: sort ? JSON.stringify(sort) : undefined,
    ...rest,
  };

  const response = await graphqlClient.query({
    query: GET_TASK_MANAGER_QUERY,
    variables: { input },
  });

  return (response as any).data as GetTasksResponse;
};

/**
 * Fetches task sections with pagination
 * @param params - Pagination parameters
 * @returns Promise with task sections data
 */
export const getTaskSections = async (params: PaginationParams): Promise<GetSectionsResponse> => {
  const { pageNo, pageSize, filter = {}, sort = {} } = params;

  const response = await graphqlClient.query({
    query: GET_TASK_MANAGER_SECTIONS_QUERY,
    variables: {
      input: {
        filter: JSON.stringify(filter),
        sort: JSON.stringify(sort),
        pageNo,
        pageSize,
      },
    },
  });

  return (response as any).data as GetSectionsResponse;
};

/**
 * Creates a new task item
 * @param input - Task item data
 * @returns Promise with creation result
 */
export const createTaskItem = async (
  input: TaskItemInsertInput
): Promise<InsertTaskItemResponse> => {
  const response = await graphqlClient.mutate({
    query: INSERT_TASK_MANAGER_ITEM_MUTATION,
    variables: { input },
  });

  return (response as any).data as InsertTaskItemResponse;
};

/**
 * Updates an existing task item
 * @param itemId - ID of the task to update
 * @param input - Updated task data
 * @returns Promise with update result
 */
export const updateTaskItem = async (
  itemId: string,
  input: TaskItemUpdateInput
): Promise<UpdateTaskItemResponse> => {
  const response = await graphqlClient.mutate({
    query: UPDATE_TASK_MANAGER_ITEM_MUTATION,
    variables: {
      filter: JSON.stringify({ ItemId: itemId }),
      input,
    },
  });

  return (response as any).data as UpdateTaskItemResponse;
};

/**
 * Deletes a task item
 * @param itemId - ID of the task to delete
 * @param isHardDelete - Whether to perform a hard delete
 * @returns Promise with deletion result
 */
export const deleteTaskItem = async (
  itemId: string,
  isHardDelete = false
): Promise<DeleteTaskItemResponse> => {
  const response = await graphqlClient.mutate({
    query: DELETE_TASK_MANAGER_ITEM_MUTATION,
    variables: {
      filter: JSON.stringify({ ItemId: itemId }),
      input: { isHardDelete },
    },
  });

  return (response as any).data as DeleteTaskItemResponse;
};

/**
 * Creates a new task section
 * @param input - Section data
 * @returns Promise with creation result
 */
export const createTaskSection = async (
  input: TaskSectionInsertInput
): Promise<InsertTaskSectionResponse> => {
  const response = await graphqlClient.mutate({
    query: INSERT_TASK_MANAGER_SECTION_MUTATION,
    variables: { input },
  });

  return (response as any).data as InsertTaskSectionResponse;
};

/**
 * Updates an existing task section
 * @param sectionId - ID of the section to update
 * @param input - Updated section data
 * @returns Promise with update result
 */
export const updateTaskSection = async (
  sectionId: string,
  input: TaskSectionUpdateInput
): Promise<UpdateTaskSectionResponse> => {
  const response = await graphqlClient.mutate({
    query: UPDATE_TASK_MANAGER_SECTION_MUTATION,
    variables: {
      filter: JSON.stringify({ ItemId: sectionId }),
      input,
    },
  });

  return (response as any).data as UpdateTaskSectionResponse;
};

/**
 * Deletes a task section
 * @param sectionId - ID of the section to delete
 * @param isHardDelete - Whether to perform a hard delete
 * @returns Promise with deletion result
 */
export const deleteTaskSection = async (
  sectionId: string,
  isHardDelete = false
): Promise<DeleteTaskSectionResponse> => {
  const response = await graphqlClient.mutate({
    query: DELETE_TASK_MANAGER_SECTION_MUTATION,
    variables: {
      filter: JSON.stringify({ ItemId: sectionId }),
      input: { isHardDelete },
    },
  });

  return (response as any).data as DeleteTaskSectionResponse;
};
