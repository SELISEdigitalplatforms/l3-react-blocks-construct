/**
 * GraphQL Types for Invoices
 *
 * This file contains TypeScript interfaces and types for GraphQL operations
 * related to invoices, following the same patterns as REST API types.
 */

export enum InvoiceStatus {
  DRAFT = 'Draft',
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue',
}

export const statusColors: Record<InvoiceStatus, { text: string; border: string; bg: string }> = {
  [InvoiceStatus.PAID]: {
    text: 'text-success',
    border: 'border-success',
    bg: 'bg-success-background',
  },
  [InvoiceStatus.PENDING]: {
    text: 'text-warning',
    border: 'border-warning',
    bg: 'bg-warning-background',
  },
  [InvoiceStatus.OVERDUE]: {
    text: 'text-error',
    border: 'border-error',
    bg: 'bg-error-background',
  },
  [InvoiceStatus.DRAFT]: {
    text: 'text-neutral',
    border: 'border-neutral',
    bg: 'bg-surface',
  },
};

export interface InvoiceItem {
  ItemId: string;
  CreatedBy: string;
  CreatedDate: string;
  IsDeleted: boolean;
  Language: string;
  LastUpdatedBy: string;
  LastUpdatedDate: string;
  OrganizationIds: string[];
  Tags: string[];
  DeletedDate: string;
  DateIssued: string;
  DueDate: string;
  Amount: number;
  Customer: string;
  Status: InvoiceStatus[];
}

export interface GetInvoicesResponse {
  invoices: {
    items: InvoiceItem[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface GetInvoiceResponse {
  invoice: InvoiceItem;
}

export interface GetInvoiceStatsResponse {
  invoiceStats: {
    totalItems: number;
    activeItems: number;
    discontinuedItems: number;
    lowStockItems: number;
    totalValue: string;
    customers: Array<{
      name: string;
      count: number;
    }>;
  };
}

export interface AddInvoiceInput {
  Customer: string;
  DateIssued: string;
  DueDate: string;
  Amount: number;
  Status: string;
}

export interface AddInvoiceParams {
  input: AddInvoiceInput;
}

export interface AddInvoiceResponse {
  insertInvoice: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

export interface UpdateInvoiceInput {
  ItemId: string;
  CreatedBy: string;
  CreatedDate: string;
  IsDeleted: boolean;
  Language: string;
  LastUpdatedBy: string;
  LastUpdatedDate: string;
  OrganizationIds: string[];
  Tags: string[];
  DeletedDate: string;
  DateIssued: string;
  DueDate: string;
  Amount: number;
  Customer: string;
  Status: string;
}

export interface UpdateInvoiceParams {
  filter: string;
  input: UpdateInvoiceInput;
}

export interface UpdateInvoiceResponse {
  updateInvoice: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

export interface DeleteInvoiceResponse {
  deleteInvoice: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}
