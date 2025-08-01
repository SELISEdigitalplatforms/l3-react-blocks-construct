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
      }
    }
  }
`;

// Let's add a separate query to get the schema for the complex types
export const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      types {
        kind
        name
        description
        fields {
          name
          description
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
`;

// Query to get the schema for AssigneeMember type
export const GET_ASSIGNEE_SCHEMA = `
  query GetAssigneeSchema {
    __type(name: "AssigneeMember") {
      name
      kind
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

// Query to get the schema for Attachment type
export const GET_ATTACHMENT_SCHEMA = `
  query GetAttachmentSchema {
    __type(name: "Attachment") {
      name
      kind
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
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
