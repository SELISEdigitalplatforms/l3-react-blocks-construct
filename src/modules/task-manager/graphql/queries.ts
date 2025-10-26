/**
 * GraphQL Queries for Task Manager
 *
 * This file contains GraphQL query strings for task management operations.
 * These queries are used with the graphqlClient to fetch task items,
 * including their details, assignments, and status information.
 */

export const GET_TASK_MANAGER_QUERY = `
  query TaskManagerItems($input: DynamicQueryInput) {
    getTaskManagerItems(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        Title
        CreatedBy
        CreatedDate
        IsDeleted
        IsCompleted
        Language
        Description
        DueDate
        LastUpdatedBy
        LastUpdatedDate
        OrganizationIds
        Priority
        Section
        Tags
        ItemTag {
          ItemId
          TagLabel
        }
        Assignee {
          ItemId
          Name
          ImageUrl
        }
        AttachmentField {
          ItemId
          FileName
          FileSize
          FileType
          FileUrl
        }
      }
    }
  }
`;

/**
 * Query to fetch task manager sections with pagination support.
 *
 * This query retrieves a paginated list of task sections with their metadata,
 * including creation/update timestamps, active status, and organizational associations.
 */

export const GET_TASK_MANAGER_SECTIONS_QUERY = `
  query TaskManagerSections($input: DynamicQueryInput) {
    getTaskManagerSections(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        Title
        CreatedBy
        CreatedDate
        IsDeleted
        Language
        LastUpdatedBy
        LastUpdatedDate
        OrganizationIds
        Tags
      }
    }
  }
`;

/**
 * Query to fetch task manager sections with pagination support.
 *
 * This query retrieves a paginated list of task sections with their metadata,
 * including creation/update timestamps, active status, and organizational associations.
 */

export const GET_TASK_MANAGER_TAGS_QUERY = `
  query TaskManagerTags($input: DynamicQueryInput) {
    getTaskManagerTags(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        CreatedBy
        CreatedDate
        IsDeleted
        ItemId
        Label
        Language
        LastUpdatedBy
        LastUpdatedDate
        OrganizationIds
        Tags
      }
    }
  }
`;

/**
 * Query to fetch task manager comments with pagination support.
 *
 * This query retrieves a paginated list of task comments with their metadata,
 * including creation/update timestamps, active status, and organizational associations.
 */

export const GET_TASK_COMMENTS_QUERY = `
  query TaskManagerComments($input: DynamicQueryInput) {
    getTaskComments(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        Content
        Timestamp
        Author
        CreatedBy
        CreatedDate
        LastUpdatedBy
        LastUpdatedDate
        TaskId
      }
    }
  }
`;

/**
 * Query to fetch task manager comments with pagination support.
 *
 * This query retrieves a paginated list of task comments with their metadata,
 * including creation/update timestamps, active status, and organizational associations.
 */

export const GET_TASK_ATTACHMENTS_QUERY = `
  query TaskAttachments($input: DynamicQueryInput) {
    getTaskAttachments(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        TaskId
        FileName
        FileSize
        FileType
        CreatedBy
        CreatedDate
        LastUpdatedBy
        LastUpdatedDate
      }
    }
  }
`;
