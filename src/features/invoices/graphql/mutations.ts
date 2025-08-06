/**
 * GraphQL Mutations for Inventory Management
 *
 * This file contains GraphQL mutation strings for inventory operations.
 * These mutations are used with the graphqlClient for data modifications.
 */

export const INSERT_INVOICE_ITEM_MUTATION = `
  mutation InsertInvoiceItem($input: InvoiceItemInsertInput!) {
    insertInvoiceItem(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_INVOICE_ITEM_MUTATION = `
  mutation UpdateInvoiceItem($filter: String!, $input: InvoiceItemUpdateInput!) {
    updateInvoiceItem(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_INVOICE_ITEM_MUTATION = `
  mutation DeleteInvoiceItem($filter: String!, $input: InvoiceItemDeleteInput!) {
    deleteInvoiceItem(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;
