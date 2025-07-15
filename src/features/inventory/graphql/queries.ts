/**
 * GraphQL Queries for Inventory Management
 *
 * This file contains GraphQL query strings for inventory operations.
 * These queries are used with the graphqlClient for data fetching.
 */

export const GET_INVENTORY_QUERY = `
  query InventoryItems($input: DynamicQueryInput) {
    InventoryItems(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        _id
        Category
        CreatedBy
        CreatedDate
        IsActive
        IsDeleted
        ItemId
        ItemImageFileId
        ItemImageFileIds
        ItemLoc
        ItemName
        Language
        LastUpdatedBy
        LastUpdatedDate
        OrganizationIds
        Price
        Status
        Stock
        Supplier
        Tags
      }
    }
  }
`;

// Query to get a single inventory item by ID
export const GET_INVENTORY_ITEM_QUERY = `
  query GetInventoryItem($id: ID!) {
    inventoryItem(id: $id) {
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
  }
`;

// Query to get inventory statistics
export const GET_INVENTORY_STATS_QUERY = `
  query GetInventoryStats {
    inventoryStats {
      totalItems
      activeItems
      discontinuedItems
      lowStockItems
      totalValue
      categories {
        name
        count
      }
      suppliers {
        name
        count
      }
    }
  }
`;

// Query to get available categories
export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories {
      id
      name
      description
      itemCount
    }
  }
`;

// Query to get available suppliers
export const GET_SUPPLIERS_QUERY = `
  query GetSuppliers {
    suppliers {
      id
      name
      contactInfo
      itemCount
    }
  }
`;

// Query to get inventory locations
export const GET_LOCATIONS_QUERY = `
  query GetLocations {
    locations {
      id
      name
      address
      itemCount
    }
  }
`;
