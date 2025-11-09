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
}

export const priorityStyle: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'bg-error-background text-error border-error',
  [TaskPriority.MEDIUM]: 'bg-warning-background text-warning border-warning',
  [TaskPriority.LOW]: 'bg-secondary-50 text-secondary border-secondary',
};

export interface ItemTag {
  ItemId: string;
  TagLabel: string;
}

export interface Assignee {
  ItemId: string;
  Name: string;
  ImageUrl: string;
}

export interface TaskComments {
  ItemId: string;
  TaskId?: string;
  Content: string;
  Timestamp: string;
  Author: string;
  IsDeleted?: boolean;
  Tags?: string[];
  Language?: string;
  OrganizationIds?: string[];
  CreatedBy?: string;
  CreatedDate?: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
}

export type FileType = 'pdf' | 'image' | 'other';

export interface TaskAttachments {
  ItemId: string;
  FileName: string;
  FileSize: string;
  FileType: FileType;
  FileUrl: string;
}

export interface TaskItem {
  ItemId: string;
  Title: string;
  CreatedBy?: string;
  CreatedDate?: string;
  IsDeleted?: boolean;
  IsCompleted: boolean;
  Language?: string;
  Description?: string;
  Assignee?: Assignee[];
  DueDate?: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  OrganizationIds?: string[];
  Priority?: TaskPriority;
  Section?: string;
  Tags?: string[];
  ItemTag?: ItemTag[];
  AttachmentField?: TaskAttachments[];
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
  tasks?: TaskItem[];
}

export interface TaskTag {
  ItemId: string;
  Label: string;
  CreatedBy: string;
  CreatedDate: string;
  DeleteDate: string;
  IsDeleted: boolean;
  Language: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  OrganizationIds: string[];
  Tags?: string[];
}

export interface TaskSectionWithTasks extends TaskSection {
  tasks: TaskItem[];
}

export interface GetTasksResponse {
  TaskManagerItems: {
    items: TaskItem[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    pageNo: number;
    totalPages: number;
  };
}

export interface GetSectionsResponse {
  TaskManagerSections: {
    items: TaskSection[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    pageNo: number;
    totalPages: number;
  };
}

export interface GetTagsResponse {
  TaskManagerTags: {
    items: TaskTag[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    pageNo: number;
    totalPages: number;
  };
}

export interface GetCommentsResponse {
  TaskManagerComments: {
    items: TaskComments[];
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    pageNo: number;
    totalPages: number;
  };
}

export interface TaskItemInsertInput {
  Title: string;
  Description?: string;
  Assignee?: Assignee[];
  DueDate?: string;
  Priority?: TaskPriority;
  Section?: string;
  Tags?: string[];
  ItemTag?: ItemTag[];
  IsCompleted?: boolean;
  OrganizationIds?: string[];
}

export interface TaskItemUpdateInput {
  Title?: string;
  Description?: string;
  Assignee?: Assignee[];
  ItemTag?: ItemTag[];
  AttachmentField?: TaskAttachments[];
  DueDate?: string;
  Priority?: TaskPriority;
  Section?: string;
  IsCompleted?: boolean;
  OrganizationIds?: string[];
  Tags?: string[];
}

export interface TaskTagInsertInput {
  Label: string;
  OrganizationIds?: string[];
  Tags?: string[];
}

export interface TaskTagUpdateInput extends Partial<TaskTagInsertInput> {
  IsDeleted?: boolean;
}

export interface TaskSectionInsertInput {
  ItemId?: string;
  Assignee?: string;
  DueDate?: string;
  Title: string;
  Language?: string;
  OrganizationIds?: string[];
  Tags?: string[];
}

export interface TaskSectionUpdateInput extends Partial<TaskSectionInsertInput> {
  IsDeleted?: boolean;
}

export interface UpdateTaskManagerSectionResponse {
  updateTaskManagerSection: {
    itemId: string | null;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

export interface PaginationParams {
  pageNo: number;
  pageSize: number;
  filter?: Record<string, unknown>;
  sort?: Record<string, 'asc' | 'desc'>;
}

//Get IAM Users type for REST API
export interface IamData {
  itemId: string;
  createdDate: string;
  lastUpdatedDate: string;
  lastLoggedInTime: string;
  language: string;
  salutation: string;
  firstName: string;
  lastName: string | null;
  email: string;
  userName: string;
  phoneNumber: string | null;
  roles: string[];
  permissions: string[];
  active: boolean;
  isVarified: boolean;
  profileImageUrl: string | null;
  mfaEnabled: boolean;
}
export interface UserFilter {
  email?: string;
  name?: string;
}

export interface GetUsersPayload {
  page: number;
  pageSize: number;
  filter?: UserFilter;
}

export interface TaskCommentInsertInput {
  TaskId: string;
  Content: string;
  Timestamp?: string;
  Author?: string;
  Tags?: string[];
  OrganizationIds?: string[];
}

export interface TaskCommentUpdateInput {
  Content?: string;
  Timestamp?: string;
  Author?: string;
}
