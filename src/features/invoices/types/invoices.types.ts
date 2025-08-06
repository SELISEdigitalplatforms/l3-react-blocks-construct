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

export interface CustomerDetails {
  CustomerName: string;
  CustomerImgUrl: string;
  BillingAddress: string;
  Email: string;
  Phone: string;
}

export interface InvoiceItemDetail {
  ItemId: string;
  ItemName: string;
  Category: number;
  Quantity: number;
  UnitPrice: number;
  Amount: number;
  Note?: string;
  Taxes?: number;
  Discount?: number;
}

export interface InvoiceItem {
  ItemId: string;
  CreatedBy?: string;
  CreatedDate?: string;
  IsDeleted?: boolean;
  Language?: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  OrganizationIds?: string[];
  Tags?: string[];
  DeletedDate?: string;
  DateIssued: string;
  DueDate: string;
  Amount: number;
  Customer: CustomerDetails[];
  Status: InvoiceStatus[];
  GeneralNote?: string;
  ItemDetail?: InvoiceItemDetail[];
}

export interface GetInvoiceItemsResponse {
  invoiceItems: {
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

export interface GetInvoiceItemResponse {
  invoiceItem: InvoiceItem;
}

export interface AddInvoiceItemInput {
  ItemId: string;
  DateIssued: string;
  DueDate: string;
  Amount: number;
  Customer: CustomerDetails[];
  Status: InvoiceStatus[];
  GeneralNote?: string;
  ItemDetail?: InvoiceItemDetail[];
}

export interface AddInvoiceItemParams {
  input: AddInvoiceItemInput;
}

export interface AddInvoiceItemResponse {
  insertInvoiceItem: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

export interface UpdateInvoiceItemInput {
  ItemId: string;
  CreatedBy?: string;
  CreatedDate?: string;
  IsDeleted?: boolean;
  Language?: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  OrganizationIds?: string[];
  Tags?: string[];
  DeletedDate?: string;
  DateIssued: string;
  DueDate: string;
  Amount: number;
  Customer: CustomerDetails[];
  Status: InvoiceStatus[];
  GeneralNote?: string;
  ItemDetail?: InvoiceItemDetail[];
}

export interface UpdateInvoiceItemParams {
  filter: string;
  input: UpdateInvoiceItemInput;
}

export interface UpdateInvoiceItemResponse {
  updateInvoiceItem: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

export interface DeleteInvoiceItemResponse {
  deleteInvoiceItem: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}
