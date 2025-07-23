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
        ItemId
        Category
        CreatedBy
        CreatedDate
        IsDeleted
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
        EligibleWarranty
        EligibleReplacement
        Discount
      }
    }
  }
`;
