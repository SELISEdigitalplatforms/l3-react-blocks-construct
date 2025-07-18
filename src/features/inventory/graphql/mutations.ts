/**
 * GraphQL Mutations for Inventory Management
 *
 * This file contains GraphQL mutation strings for inventory operations.
 * These mutations are used with the graphqlClient for data modifications.
 */

export const INSERT_INVENTORY_ITEM_MUTATION = `
  mutation InsertInventoryItem($input: InventoryItemInsertInput!) {
    insertInventoryItem(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_INVENTORY_ITEM_MUTATION = `
  mutation UpdateInventoryItem($filter: String!, $input: InventoryItemUpdateInput!) {
    updateInventoryItem(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_INVENTORY_ITEM_MUTATION = `
  mutation DeleteInventoryItem($filter: String!, $input: InventoryItemDeleteInput!) {
    deleteInventoryItem(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;
