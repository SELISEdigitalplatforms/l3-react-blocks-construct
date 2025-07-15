/**
 * GraphQL Mutations for Inventory Management
 *
 * This file contains GraphQL mutation strings for inventory operations.
 * These mutations are used with the graphqlClient for data modifications.
 */

// Mutation to create a new inventory item
export const CREATE_INVENTORY_ITEM_MUTATION = `
  mutation CreateInventoryItem($input: CreateInventoryItemInput!) {
    createInventoryItem(input: $input) {
      item {
        id
        itemName
        category
        supplier
        itemLocation
        stock
        price
        status
        lastUpdated
        itemImage
        description
        warranty
        replacement
        discount
        tags
      }
      success
      errors
    }
  }
`;

// Mutation to update an existing inventory item
export const UPDATE_INVENTORY_ITEM_MUTATION = `
  mutation UpdateInventoryItem($input: UpdateInventoryItemInput!) {
    updateInventoryItem(input: $input) {
      item {
        id
        itemName
        category
        supplier
        itemLocation
        stock
        price
        status
        lastUpdated
        itemImage
        description
        warranty
        replacement
        discount
        tags
      }
      success
      errors
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

// Mutation to bulk update inventory items
export const BULK_UPDATE_INVENTORY_MUTATION = `
  mutation BulkUpdateInventory($input: BulkUpdateInventoryInput!) {
    bulkUpdateInventory(input: $input) {
      updatedItems {
        id
        itemName
        stock
        price
        status
        lastUpdated
      }
      success
      errors
    }
  }
`;

// Mutation to import inventory items from CSV
export const IMPORT_INVENTORY_MUTATION = `
  mutation ImportInventory($input: ImportInventoryInput!) {
    importInventory(input: $input) {
      importedItems {
        id
        itemName
        category
        supplier
        stock
        price
        status
      }
      success
      errors
      summary {
        totalProcessed
        successfulImports
        failedImports
      }
    }
  }
`;

// Mutation to export inventory items
export const EXPORT_INVENTORY_MUTATION = `
  mutation ExportInventory($input: ExportInventoryInput!) {
    exportInventory(input: $input) {
      downloadUrl
      success
      errors
    }
  }
`;
