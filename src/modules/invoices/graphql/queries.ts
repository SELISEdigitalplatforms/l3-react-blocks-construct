/**
 * GraphQL Queries for Inventory Management
 *
 * This file contains GraphQL query strings for inventory operations.
 * These queries are used with the graphqlClient for data fetching.
 */

export const GET_INVOICE_ITEMS_QUERY = `
  query InvoiceItems($input: DynamicQueryInput) {
    getInvoiceItems(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        CreatedBy
        CreatedDate
        IsDeleted
        Language
        LastUpdatedBy
        LastUpdatedDate
        OrganizationIds
        Tags
        DeletedDate
        DateIssued
        Amount
        Currency
        DueDate
        Status
        GeneralNote
        Taxes
        Discount
        Customer {
          CustomerName
          BillingAddress
          Email
          PhoneNo
        }
        ItemDetails {
          ItemId
          ItemName
          Category
          Quantity
          UnitPrice
          Amount
          Note
        }
      }
    }
  }
`;
