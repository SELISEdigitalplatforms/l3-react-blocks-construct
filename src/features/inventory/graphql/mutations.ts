/**
 * GraphQL Mutations for Inventory Management
 *
 * This file contains GraphQL mutation strings for inventory operations.
 * These mutations are used with the graphqlClient for data modifications.
 */

// Mutation to insert a new inventory item (matches backend API)
export const INSERT_INVENTORY_ITEM_MUTATION = `
  mutation InsertInventoryItem($input: InventoryItemInsertInput!) {
    insertInventoryItem(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

// Mutation to update an existing inventory item
export const UPDATE_INVENTORY_ITEM_MUTATION = `
  mutation UpdateInventoryItem($filter: String!, $input: InventoryItemUpdateInput!) {
    updateInventoryItem(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

// Mutation to delete an inventory item
export const DELETE_INVENTORY_ITEM_MUTATION = `
  mutation DeleteInventoryItem($id: ID!) {
    deleteInventoryItem(id: $id) {
      success
      errors
    }
  }
`;
