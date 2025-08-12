/**
 * GraphQL Queries for Task Manager
 *
 * This file contains GraphQL query strings for task management operations.
 * These queries are used with the graphqlClient to fetch task items,
 * including their details, assignments, and status information.
 */

// First, let's try to get the task items without the complex fields
export const GET_TASK_MANAGER_QUERY = `
  query TaskManagerItems($input: DynamicQueryInput) {
    TaskManagerItems(input: $input) {
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
        Attachments {
          ItemId
          FileName
          FileSize
          FileType
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
    TaskManagerSections(input: $input) {
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
    TaskManagerTags(input: $input) {
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
    TaskComments(input: $input) {
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
    TaskAttachments(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        FileName
        FileSize
        FileType
        Timestamp
        CreatedBy
        CreatedDate
        LastUpdatedBy
        LastUpdatedDate
      }
    }
  }
`;
