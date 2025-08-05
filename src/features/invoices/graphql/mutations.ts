/**
 * GraphQL Mutations for Inventory Management
 *
 * This file contains GraphQL mutation strings for inventory operations.
 * These mutations are used with the graphqlClient for data modifications.
 */

export const INSERT_INVOICE_MUTATION = `
  mutation InsertInvoice($input: InvoiceInsertInput!) {
    insertInvoice(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_INVOICE_MUTATION = `
  mutation UpdateInvoice($filter: String!, $input: InvoiceUpdateInput!) {
    updateInvoice(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_INVOICE_MUTATION = `
  mutation DeleteInvoice($filter: String!, $input: InvoiceDeleteInput!) {
    deleteInvoice(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;
