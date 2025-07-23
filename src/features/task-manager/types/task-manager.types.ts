/**
 * GraphQL Types for Task Manager
 *
 * This file contains TypeScript interfaces and types for GraphQL operations
 * related to task management, including tasks and sections.
 */

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'info',
  [TaskPriority.MEDIUM]: 'warning',
  [TaskPriority.HIGH]: 'error',
  [TaskPriority.URGENT]: 'error',
};

export const priorityOptions = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
  TaskPriority.URGENT,
];

export interface TaskItem {
  ItemId: string;
  Title: string;
  CreatedBy: string;
  CreatedDate: string;
  IsDeleted: boolean;
  IsCompleted: boolean;
  Language: string;
  Description?: string;
  Assignee?: string;
  Attachments?: string[];
  Comments?: string[];
  DueDate?: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  OrganizationIds: string[];
  Priority?: TaskPriority;
  Section?: string;
  Tags?: string[];
}

export interface TaskSection {
  ItemId: string;
  Title: string;
  CreatedBy: string;
  CreatedDate: string;
  IsDeleted: boolean;
  Language: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  OrganizationIds: string[];
  Tags?: string[];
}

export interface GetTasksResponse {
  TaskManagerItems: {
    items: TaskItem[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      pageSize: number;
      pageNo: number;
    };
  };
}

export interface GetSectionsResponse {
  TaskManagerSections: {
    items: TaskSection[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      pageSize: number;
      pageNo: number;
    };
  };
}

export interface TaskItemInsertInput {
  Title: string;
  Description?: string;
  Assignee?: string;
  DueDate?: string;
  Priority?: TaskPriority;
  Section?: string;
  Tags?: string[];
  IsCompleted?: boolean;
  Language?: string;
  OrganizationIds?: string[];
}

export interface TaskItemUpdateInput extends Partial<TaskItemInsertInput> {
  IsDeleted?: boolean;
}

export interface TaskSectionInsertInput {
  Title: string;
  Language?: string;
  OrganizationIds?: string[];
  Tags?: string[];
}

export interface TaskSectionUpdateInput extends Partial<TaskSectionInsertInput> {
  IsDeleted?: boolean;
}

// Query parameter types
export interface PaginationParams {
  pageNo: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: Record<string, 'asc' | 'desc'>;
}

export interface TaskQueryParams extends PaginationParams {
  sectionId?: string;
  assigneeId?: string;
  isCompleted?: boolean;
}
