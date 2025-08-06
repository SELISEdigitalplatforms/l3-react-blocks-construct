/**
 * GraphQL Queries for Inventory Management
 *
 * This file contains GraphQL query strings for inventory operations.
 * These queries are used with the graphqlClient for data fetching.
 */

export const GET_INVOICE_ITEMS_QUERY = `
  query InvoiceItems($input: DynamicQueryInput) {
    InvoiceItems(input: $input) {
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
        Language
        LastUpdatedBy
        LastUpdatedDate
        OrganizationIds
        Tags
        DeletedDate
        Customer
        DateIssued
        Amount
        DueDate
        Status
        GeneralNote
        ItemDetail {
          ItemId
          ItemName
          Category
          Quantity
          UnitPrice
          Amount
          Note
          Taxes
          Discount
        }
      }
    }
  }
`;
