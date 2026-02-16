import { graphqlClient } from '@/lib/graphql-client';
import {
  GET_TASK_COMMENTS_QUERY,
  GET_TASK_MANAGER_QUERY,
  GET_TASK_MANAGER_SECTIONS_QUERY,
  GET_TASK_MANAGER_TAGS_QUERY,
} from '../graphql/queries';
import type {
  TaskItem,
  ItemTag,
  GetCommentsResponse,
  TaskCommentUpdateInput,
  TaskCommentInsertInput,
  TaskItemInsertInput,
  TaskItemUpdateInput,
  TaskSectionInsertInput,
  TaskSectionUpdateInput,
  PaginationParams,
  GetTasksResponse,
  GetSectionsResponse,
  UpdateTaskManagerSectionResponse,
  GetTagsResponse,
  TaskTagInsertInput,
  TaskTagUpdateInput,
} from '../types/task-manager.types';
import {
  INSERT_TASK_MANAGER_ITEM_MUTATION,
  UPDATE_TASK_MANAGER_ITEM_MUTATION,
  DELETE_TASK_MANAGER_ITEM_MUTATION,
  INSERT_TASK_MANAGER_SECTION_MUTATION,
  UPDATE_TASK_MANAGER_SECTION_MUTATION,
  DELETE_TASK_MANAGER_SECTION_MUTATION,
  INSERT_TASK_MANAGER_TAG_MUTATION,
  UPDATE_TASK_MANAGER_TAG_MUTATION,
  DELETE_TASK_MANAGER_TAG_MUTATION,
  INSERT_TASK_COMMENTS_MUTATION,
  UPDATE_TASK_COMMENTS_MUTATION,
  DELETE_TASK_COMMENTS_MUTATION,
} from '../graphql/mutations';
import { clients } from '@/lib/https';
import { GetUsersPayload, IamData } from '@/modules/iam/types/user.types';

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

export interface InsertTaskTagResponse {
  insertTaskManagerTag: BaseMutationResponse;
}

export interface UpdateTaskTagResponse {
  updateTaskManagerTag: BaseMutationResponse;
}

export interface DeleteTaskTagResponse {
  deleteTaskManagerTag: BaseMutationResponse;
}

export interface InsertTaskCommentResponse {
  insertTaskComment: BaseMutationResponse;
}

export interface UpdateTaskCommentResponse {
  updateTaskComment: BaseMutationResponse;
}

export interface DeleteTaskCommentResponse {
  deleteTaskComment: BaseMutationResponse;
}

export interface InsertTaskAttachmentResponse {
  insertTaskAttachment: BaseMutationResponse;
}

export interface UpdateTaskAttachmentResponse {
  updateTaskAttachment: BaseMutationResponse;
}

export interface DeleteTaskAttachmentResponse {
  deleteTaskAttachmentItem: BaseMutationResponse;
}

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

export const getTasks = async (params: PaginationParams): Promise<GetTasksResponse> => {
  const { pageNo, pageSize, filter = {}, sort = {} } = params;

  try {
    const input: any = { pageNo, pageSize };
    if (filter && Object.keys(filter).length > 0) {
      input.filter = JSON.stringify(filter);
    }
    if (sort && Object.keys(sort).length > 0) {
      input.sort = JSON.stringify(sort);
    }

    const response = await graphqlClient.query({
      query: GET_TASK_MANAGER_QUERY,
      variables: { input },
    });

    const responseData = (response as any)?.data || (response as any);
    let taskManagerItems: GetTasksResponse['TaskManagerItems'] | null = null;

    if (responseData && typeof responseData === 'object') {
      if ('getTaskManagerItems' in responseData) {
        taskManagerItems = responseData.getTaskManagerItems;
      } else if ('TaskManagerItems' in responseData) {
        taskManagerItems = responseData.TaskManagerItems;
      } else if ('items' in responseData || 'totalCount' in responseData) {
        taskManagerItems = responseData as GetTasksResponse['TaskManagerItems'];
      }
    }

    if (taskManagerItems) {
      const items = (taskManagerItems.items || []).map((task) => {
        const isItemTag = (tag: any): tag is ItemTag =>
          tag && typeof tag === 'object' && 'ItemId' in tag && 'TagLabel' in tag;

        const itemTags: ItemTag[] = Array.isArray(task.ItemTag)
          ? task.ItemTag.filter(isItemTag)
          : [];

        const legacyTags = Array.isArray(task.Tags) ? task.Tags : [];

        const convertedTags =
          itemTags.length > 0
            ? itemTags
            : legacyTags.map((tag) => ({
                ItemId: typeof tag === 'string' ? tag : (tag as ItemTag).ItemId || '',
                TagLabel: typeof tag === 'string' ? tag : (tag as ItemTag).TagLabel || '',
              }));

        return {
          ...task,
          Assignee: Array.isArray(task.Assignee) ? task.Assignee : [],
          ItemTag: convertedTags,
          ItemTags: convertedTags.map((tag) => tag.TagLabel || tag.ItemId),
          OrganizationIds: Array.isArray(task.OrganizationIds) ? task.OrganizationIds : [],
        } as TaskItem;
      });

      return {
        TaskManagerItems: {
          items,
          totalCount: taskManagerItems.totalCount || 0,
          hasNextPage: taskManagerItems.hasNextPage || false,
          hasPreviousPage: taskManagerItems.hasPreviousPage || false,
          pageSize: taskManagerItems.pageSize || pageSize,
          pageNo: taskManagerItems.pageNo || pageNo,
          totalPages: taskManagerItems.totalPages || 1,
        },
      };
    }
    console.warn('Unexpected response structure, returning default sections');
    return {
      TaskManagerItems: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching task items:', error);
    return {
      TaskManagerItems: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  }
};

/**
 * Fetches task sections with pagination
 * @param params - Pagination parameters
 * @returns Promise with task sections data
 */
export const getTaskSections = async (params: PaginationParams): Promise<GetSectionsResponse> => {
  const { pageNo, pageSize, filter, sort } = params;

  try {
    const input: any = {
      pageNo,
      pageSize,
    };

    if (filter && Object.keys(filter).length > 0) {
      input.filter = JSON.stringify(filter);
    }

    if (sort && Object.keys(sort).length > 0) {
      input.sort = JSON.stringify(sort);
    }

    const response = await graphqlClient.query({
      query: GET_TASK_MANAGER_SECTIONS_QUERY,
      variables: {
        input,
      },
    });

    const responseData = (response as any)?.data || (response as any);
    let taskManagerSections: GetSectionsResponse['TaskManagerSections'] | null = null;

    if (responseData && typeof responseData === 'object') {
      if ('getTaskManagerSections' in responseData) {
        taskManagerSections = responseData.getTaskManagerSections;
      } else if ('TaskManagerSections' in responseData) {
        taskManagerSections = responseData.TaskManagerSections;
      } else if ('items' in responseData || 'totalCount' in responseData) {
        taskManagerSections = responseData as GetSectionsResponse['TaskManagerSections'];
      }
    }

    if (taskManagerSections) {
      return {
        TaskManagerSections: {
          items: taskManagerSections.items || [],
          totalCount: taskManagerSections.totalCount || 0,
          hasNextPage: taskManagerSections.hasNextPage || false,
          hasPreviousPage: taskManagerSections.hasPreviousPage || false,
          pageSize: taskManagerSections.pageSize || pageSize,
          pageNo: taskManagerSections.pageNo || pageNo,
          totalPages: taskManagerSections.totalPages || 1,
        },
      };
    }
    console.warn('Unexpected response structure, returning default sections');
    return {
      TaskManagerSections: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching task sections:', error);
    return {
      TaskManagerSections: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  }
};

/**
 * Fetches task sections with pagination
 * @param params - Pagination parameters
 * @returns Promise with task sections data
 */
export const getTaskTags = async (params: PaginationParams): Promise<GetTagsResponse> => {
  const { pageNo, pageSize, filter, sort } = params;

  try {
    const input: any = {
      pageNo,
      pageSize,
    };

    if (filter && Object.keys(filter).length > 0) {
      input.filter = JSON.stringify(filter);
    }

    if (sort && Object.keys(sort).length > 0) {
      input.sort = JSON.stringify(sort);
    }

    const response = await graphqlClient.query({
      query: GET_TASK_MANAGER_TAGS_QUERY,
      variables: {
        input,
      },
    });

    const responseData = (response as any)?.data || (response as any);
    let taskManagerTags: GetTagsResponse['TaskManagerTags'] | null = null;

    if (responseData && typeof responseData === 'object') {
      if ('getTaskManagerTags' in responseData) {
        taskManagerTags = responseData.getTaskManagerTags;
      } else if ('TaskManagerTags' in responseData) {
        taskManagerTags = responseData.TaskManagerTags;
      } else if ('items' in responseData || 'totalCount' in responseData) {
        taskManagerTags = responseData as GetTagsResponse['TaskManagerTags'];
      }
    }

    if (taskManagerTags) {
      return {
        TaskManagerTags: {
          items: taskManagerTags.items || [],
          totalCount: taskManagerTags.totalCount || 0,
          hasNextPage: taskManagerTags.hasNextPage || false,
          hasPreviousPage: taskManagerTags.hasPreviousPage || false,
          pageSize: taskManagerTags.pageSize || pageSize,
          pageNo: taskManagerTags.pageNo || pageNo,
          totalPages: taskManagerTags.totalPages || 1,
        },
      };
    }
    console.warn('Unexpected response structure, returning default sections');
    return {
      TaskManagerTags: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching task sections:', error);
    return {
      TaskManagerTags: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  }
};

/**
 * Fetches task comments with pagination
 * @param params - Pagination parameters
 * @returns Promise with task comments data
 */
export const getTaskComments = async (params: PaginationParams): Promise<GetCommentsResponse> => {
  const { pageNo, pageSize, filter, sort } = params;

  try {
    const input: any = {
      pageNo,
      pageSize,
    };

    if (filter && Object.keys(filter).length > 0) {
      input.filter = JSON.stringify(filter);
    }

    if (sort && Object.keys(sort).length > 0) {
      input.sort = JSON.stringify(sort);
    }

    const response = await graphqlClient.query({
      query: GET_TASK_COMMENTS_QUERY,
      variables: {
        input,
      },
    });

    const responseData = (response as any)?.data || (response as any);
    const taskComments =
      responseData?.getTaskComments ||
      responseData?.TaskManagerComments ||
      responseData?.TaskComments;

    if (taskComments) {
      const processedComments = (taskComments.items || []).map((comment: any) => ({
        ...comment,
        ItemId: comment.ItemId || '',
        Content: comment.Content || '',
        Timestamp: comment.Timestamp || new Date().toISOString(),
        Author: comment.Author || '',
        CreatedBy: comment.CreatedBy || '',
        CreatedDate: comment.CreatedDate || new Date().toISOString(),
        LastUpdatedBy: comment.LastUpdatedBy || comment.CreatedBy || '',
        LastUpdatedDate: comment.LastUpdatedDate || comment.CreatedDate || new Date().toISOString(),
        TaskId: comment.TaskId || '',
      }));

      return {
        TaskManagerComments: {
          items: processedComments,
          totalCount: taskComments.totalCount || processedComments.length,
          hasNextPage: taskComments.hasNextPage || false,
          hasPreviousPage: taskComments.hasPreviousPage || false,
          pageSize: taskComments.pageSize || pageSize,
          pageNo: taskComments.pageNo || pageNo,
          totalPages: taskComments.totalPages || 1,
        },
      };
    }

    console.warn('Unexpected response structure, returning empty comments');
    return {
      TaskManagerComments: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching task sections:', error);
    return {
      TaskManagerComments: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize,
        pageNo,
        totalPages: 0,
      },
    };
  }
};

/**
 * Creates a new task item
 * @param input - Task item data
 * @returns Promise with creation result
 */

// Helper function to normalize tags to ItemTag format
const normalizeToItemTag = (tag: string | ItemTag): ItemTag => {
  if (typeof tag === 'string') {
    return { ItemId: tag, TagLabel: tag };
  }
  return {
    ItemId: tag.ItemId || '',
    TagLabel: tag.TagLabel || tag.ItemId || '',
  };
};

// Helper function to get normalized tags from input
const getNormalizedTags = (input: {
  ItemTag?: ItemTag[];
  Tags?: Array<string | ItemTag>;
}): ItemTag[] => {
  if (input.ItemTag) {
    return input.ItemTag.map(normalizeToItemTag);
  }
  if (input.Tags) {
    return input.Tags.map(normalizeToItemTag);
  }
  return [];
};

export const createTaskItem = async (
  input: TaskItemInsertInput
): Promise<InsertTaskItemResponse> => {
  try {
    const formattedInput = {
      ...input,
      ItemTag: getNormalizedTags(input),
      Tags: undefined,
    };

    const response = await graphqlClient.mutate<{
      insertTaskManagerItem: { itemId: string };
    }>({
      query: INSERT_TASK_MANAGER_ITEM_MUTATION,
      variables: { input: formattedInput },
    });

    const responseData = (response as any).data || response;

    if (!responseData) {
      throw new Error('No response data received from server');
    }

    if (!responseData.insertTaskManagerItem?.itemId) {
      throw new Error('No task ID in response');
    }

    return responseData;
  } catch (error) {
    console.error('Error in createTaskItem:', error);
    throw error;
  }
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
  const inputCopy = { ...input };

  const { ...inputWithoutComments } = inputCopy;

  const formattedInput = {
    ...inputWithoutComments,
    ...(inputWithoutComments.ItemTag === undefined &&
      inputWithoutComments.Tags && {
        ItemTag: inputWithoutComments.Tags.map(normalizeToItemTag),
      }),
  };

  const cleanInput = Object.fromEntries(
    Object.entries(formattedInput).filter(([, value]) => value !== undefined)
  );

  try {
    const response = await graphqlClient.mutate({
      query: UPDATE_TASK_MANAGER_ITEM_MUTATION,
      variables: {
        filter: JSON.stringify({ _id: itemId }),
        input: cleanInput,
      },
    });

    return (response as any).data as UpdateTaskItemResponse;
  } catch (error) {
    console.error('Error updating task item:', error);
    throw error;
  }
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
      filter: JSON.stringify({ _id: itemId }),
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
  try {
    const response = await graphqlClient.mutate({
      query: INSERT_TASK_MANAGER_SECTION_MUTATION,
      variables: { input },
    });

    const responseData = (response as any)?.data || response;

    if (!responseData?.insertTaskManagerSection) {
      throw new Error('Invalid response format from server');
    }

    return {
      insertTaskManagerSection: responseData.insertTaskManagerSection,
    };
  } catch (error) {
    console.error('Error in createTaskSection:', error);
    throw error;
  }
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
): Promise<UpdateTaskManagerSectionResponse> => {
  try {
    const response = await graphqlClient.mutate<{
      updateTaskManagerSection: UpdateTaskManagerSectionResponse['updateTaskManagerSection'];
      errors?: Array<{ message: string }>;
    }>({
      query: UPDATE_TASK_MANAGER_SECTION_MUTATION,
      variables: {
        filter: JSON.stringify({ _id: sectionId }),
        input,
      },
    });

    if (!response) {
      throw new Error('No response received from server');
    }
    if (response.errors && response.errors.length > 0) {
      const errorMessage = response.errors.map((e) => e.message).join('; ');
      throw new Error(`GraphQL Error: ${errorMessage}`);
    }

    if (!response.updateTaskManagerSection) {
      throw new Error('No update data in response');
    }

    return {
      updateTaskManagerSection: response.updateTaskManagerSection,
    };
  } catch (error) {
    console.error('Error in updateTaskSection:', error);
    const updateError = new Error(
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while updating the section'
    );

    (updateError as any).originalError = error;

    throw updateError;
  }
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
      filter: JSON.stringify({ _id: sectionId }),
      input: { isHardDelete },
    },
  });

  return (response as any).data as DeleteTaskSectionResponse;
};

/**
 * Creates a new task tag
 * @param input - Task tag data
 * @returns Promise with creation result
 */
export const createTaskTag = async (input: TaskTagInsertInput): Promise<InsertTaskTagResponse> => {
  try {
    const response = await graphqlClient.mutate<{
      insertTaskManagerTag: { itemId: string };
    }>({
      query: INSERT_TASK_MANAGER_TAG_MUTATION,
      variables: { input },
    });

    const responseData = (response as any).data || response;

    if (!responseData) {
      throw new Error('No response data received from server');
    }

    if (!responseData.insertTaskManagerTag?.itemId) {
      throw new Error('No tag ID in response');
    }

    return responseData;
  } catch (error) {
    console.error('Error in createTaskTag:', error);
    throw error;
  }
};

/**
 * Updates an existing task tag
 * @param itemId - ID of the task tag to update
 * @param input - Updated task data
 * @returns Promise with update result
 */
export const updateTaskTag = async (
  itemId: string,
  input: TaskTagUpdateInput
): Promise<UpdateTaskTagResponse> => {
  const response = await graphqlClient.mutate({
    query: UPDATE_TASK_MANAGER_TAG_MUTATION,
    variables: {
      filter: JSON.stringify({ _id: itemId }),
      input,
    },
  });

  return (response as any).data as UpdateTaskTagResponse;
};

/**
 * Deletes a task tag
 * @param itemId - ID of the task tag to delete
 * @param isHardDelete - Whether to perform a hard delete
 * @returns Promise with deletion result
 */
export const deleteTaskTag = async (
  itemId: string,
  isHardDelete = false
): Promise<DeleteTaskTagResponse> => {
  const response = await graphqlClient.mutate({
    query: DELETE_TASK_MANAGER_TAG_MUTATION,
    variables: {
      filter: JSON.stringify({ _id: itemId }),
      input: { isHardDelete },
    },
  });

  return (response as any).data as DeleteTaskTagResponse;
};

/**
 * Creates a new comment for particular task
 * @param input - Task comment data
 * @returns Promise with creation result
 */
export const createTaskComment = async (
  input: TaskCommentInsertInput & { taskId?: string }
): Promise<InsertTaskCommentResponse> => {
  try {
    const now = new Date().toISOString();
    const taskId = input.TaskId ?? input.taskId;

    if (!taskId) {
      throw new Error('Task ID is required to create a comment');
    }

    const mutationInput = {
      ...input,
      TaskId: taskId,
      Timestamp: input.Timestamp ?? now,
      Author: input.Author ?? '',
    };

    if (!input.TaskId && !input.taskId) {
      throw new Error('TaskId is required to create a comment');
    }
    const commentResponse = await graphqlClient.mutate<{
      insertTaskComment: { itemId: string };
    }>({
      query: INSERT_TASK_COMMENTS_MUTATION,
      variables: {
        input: {
          ...mutationInput,
          TaskId: input.TaskId || input.taskId,
          ...(mutationInput.taskId && { taskId: undefined }),
        },
      },
    });

    const responseData = (commentResponse as any).data || commentResponse;

    if (!responseData) {
      throw new Error('No response data received from server');
    }

    if (!responseData.insertTaskComment?.itemId) {
      throw new Error('No comment ID in response');
    }

    return responseData;
  } catch (error) {
    console.error('Error in createTaskComment:', error);
    throw error;
  }
};

/**
 * Updates an existing particular task comment
 * @param itemId - ID of the task comment to update
 * @param input - Updated particular task comment data
 * @returns Promise with update result
 */
export const updateTaskComment = async (
  itemId: string,
  input: TaskCommentUpdateInput
): Promise<UpdateTaskCommentResponse> => {
  const now = new Date().toISOString();
  const mutationInput: TaskCommentUpdateInput = {
    ...input,
    Content: input.Content ?? '',
    Timestamp: input.Timestamp ?? now,
  };

  const cleanInput = Object.fromEntries(
    Object.entries(mutationInput).filter(([, value]) => value !== undefined)
  ) as TaskCommentUpdateInput;

  const response = await graphqlClient.mutate({
    query: UPDATE_TASK_COMMENTS_MUTATION,
    variables: {
      filter: JSON.stringify({ _id: itemId }),
      input: cleanInput,
    },
  });

  return (response as any).data as UpdateTaskCommentResponse;
};

/**
 * Deletes a particular task's comment
 * @param itemId - ID of the particular task's comment to delete
 * @param isHardDelete - Whether to perform a hard delete
 * @returns Promise with deletion result
 */
export const deleteTaskComment = async (
  itemId: string,
  isHardDelete = false
): Promise<DeleteTaskCommentResponse> => {
  try {
    const response = await graphqlClient.mutate<{
      deleteTaskComment: { itemId: string; totalImpactedData: number; acknowledged: boolean };
    }>({
      query: DELETE_TASK_COMMENTS_MUTATION,
      variables: {
        filter: JSON.stringify({ _id: itemId }),
        input: { isHardDelete },
      },
    });

    const responseData = (response as any).data || response;
    if (!responseData) {
      throw new Error('No response data received from server');
    }

    return responseData as DeleteTaskCommentResponse;
  } catch (error) {
    console.error('Error in deleteTaskComment:', error);
    throw error;
  }
};

export const getUsers = (payload: GetUsersPayload) => {
  const requestBody = {
    page: payload.page,
    pageSize: payload.pageSize,
    filter: {
      email: payload.filter?.email ?? '',
      name: payload.filter?.name ?? '',
    },
  };

  return clients.post<{
    data: IamData[];
    totalCount: number;
  }>('/idp/v1/Iam/GetUsers', JSON.stringify(requestBody));
};
