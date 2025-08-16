/**
 * GraphQL Mutations for Task Manager
 *
 * This file contains GraphQL mutation strings for task management operations.
 * These mutations are used with the graphqlClient for creating, updating, and deleting
 * task manager items, including tracking impacted data and acknowledgments.
 */

export const INSERT_TASK_MANAGER_ITEM_MUTATION = `
  mutation InsertTaskManagerItem($input: TaskManagerItemInsertInput!) {
    insertTaskManagerItem(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_TASK_MANAGER_ITEM_MUTATION = `
  mutation UpdateTaskManagerItem($filter: String!, $input: TaskManagerItemUpdateInput!) {
    updateTaskManagerItem(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_TASK_MANAGER_ITEM_MUTATION = `
  mutation DeleteTaskManagerItem($filter: String!, $input: TaskManagerItemDeleteInput!) {
    deleteTaskManagerItem(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

/**
 * GraphQL Mutations for Task Manager Sections
 *
 * This file contains GraphQL mutation strings for managing task sections.
 * These mutations handle CRUD operations for task sections, including
 * creating new sections, updating existing ones, and deleting sections,
 * with tracking of impacted data and operation acknowledgments.
 */

export const INSERT_TASK_MANAGER_SECTION_MUTATION = `
  mutation InsertTaskManagerSection($input: TaskManagerSectionInsertInput!) {
    insertTaskManagerSection(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_TASK_MANAGER_SECTION_MUTATION = `
  mutation UpdateTaskManagerSection($filter: String!, $input: TaskManagerSectionUpdateInput!) {
    updateTaskManagerSection(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_TASK_MANAGER_SECTION_MUTATION = `
  mutation DeleteTaskManagerSection($filter: String!, $input: TaskManagerSectionDeleteInput!) {
    deleteTaskManagerSection(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

/**
 * GraphQL Mutations for Task Manager
 *
 * This file contains GraphQL mutation strings for task management operations.
 * These mutations are used with the graphqlClient for creating, updating, and deleting
 * task manager tags, including tracking impacted data and acknowledgments.
 */

export const INSERT_TASK_MANAGER_TAG_MUTATION = `
  mutation InsertTaskManagerTag($input: TaskManagerTagInsertInput!) {
    insertTaskManagerTag(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_TASK_MANAGER_TAG_MUTATION = `
  mutation UpdateTaskManagerTag($filter: String!, $input: TaskManagerTagUpdateInput!) {
    updateTaskManagerTag(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_TASK_MANAGER_TAG_MUTATION = `
  mutation DeleteTaskManagerTag($filter: String!, $input: TaskManagerTagDeleteInput!) {
    deleteTaskManagerTag(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

/**
 * GraphQL Mutations for Task Manager
 *
 * This file contains GraphQL mutation strings for task management operations.
 * These mutations are used with the graphqlClient for creating, updating, and deleting
 * task manager comments, including tracking impacted data and acknowledgments.
 */

export const INSERT_TASK_COMMENTS_MUTATION = `
  mutation InsertTaskComment($input: TaskCommentInsertInput!) {
    insertTaskComment(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_TASK_COMMENTS_MUTATION = `
  mutation UpdateTaskComment($filter: String!, $input: TaskCommentUpdateInput!) {
    updateTaskComment(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_TASK_COMMENTS_MUTATION = `
  mutation DeleteTaskComment($filter: String!, $input: TaskCommentDeleteInput!) {
    deleteTaskComment(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;
