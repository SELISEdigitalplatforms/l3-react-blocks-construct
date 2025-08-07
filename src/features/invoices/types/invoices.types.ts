/**
 * GraphQL Types for Invoices
 *
 * This file contains TypeScript interfaces and types for GraphQL operations
 * related to invoices, following the same patterns as REST API types.
 */

// Type for status colors
type StatusColors = {
  text: string;
  border: string;
  bg: string;
};

export enum InvoiceStatus {
  DRAFT = 'Draft',
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue',
}

// Helper function to get status colors that works with both enum and string values
export function getStatusColors(status: string): StatusColors {
  // Define the status to variant mapping
  const statusMap = new Map<string, 'success' | 'warning' | 'error' | 'neutral'>([
    [InvoiceStatus.PAID, 'success'],
    [InvoiceStatus.PENDING, 'warning'],
    [InvoiceStatus.OVERDUE, 'error'],
    [InvoiceStatus.DRAFT, 'neutral'],
  ]);

  // Helper function to normalize status string
  const normalizeStatus = (s: string) => s.toLowerCase();

  // Find the variant (case-insensitive)
  const normalizedStatus = normalizeStatus(status);
  const variant = Array.from(statusMap.entries())
    .find(([key]) => normalizeStatus(key) === normalizedStatus)?.[1] || 'muted';

  // Return the complete status styles
  return {
    text: `text-${variant}`,
    border: `border-${variant}`,
    bg: variant === 'muted' ? 'bg-muted/50' : `bg-${variant}-background`,
  };
}

export interface CustomerDetails {
  CustomerName: string;
  CustomerImgUrl: string;
  BillingAddress: string;
  Email: string;
  PhoneNo: string;
}

export interface InvoiceItemDetails {
  ItemId: string;
  ItemName: string;
  Category: string; // Changed from number to string
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
  ItemDetails?: InvoiceItemDetails[];
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
  Status: string; // Changed from InvoiceStatus[] to string
  GeneralNote?: string;
  ItemDetails?: InvoiceItemDetails[];
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
  ItemDetails?: InvoiceItemDetails[];
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

export interface InvoiceItemsResponse {
  invoiceItems: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    totalPages: number;
    pageSize: number;
    pageNo: number;
    items: InvoiceItem[];
  };
}
