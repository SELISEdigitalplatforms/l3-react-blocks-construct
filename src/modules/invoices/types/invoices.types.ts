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

export const Categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'apparel', label: 'Apparel' },
];

// Helper function to get status colors that works with both enum and string values
export function getStatusColors(status: string): StatusColors {
  const statusMap = new Map<string, 'success' | 'warning' | 'error' | 'neutral'>([
    [InvoiceStatus.PAID, 'success'],
    [InvoiceStatus.PENDING, 'warning'],
    [InvoiceStatus.OVERDUE, 'error'],
    [InvoiceStatus.DRAFT, 'neutral'],
  ]);

  const normalizeStatus = (s: string) => s.toLowerCase();

  const normalizedStatus = normalizeStatus(status);
  const variant =
    Array.from(statusMap.entries()).find(
      ([key]) => normalizeStatus(key) === normalizedStatus
    )?.[1] ?? 'muted';

  return {
    text: `text-${variant}`,
    border: `border-${variant}`,
    bg: variant === 'muted' ? 'bg-muted/50' : `bg-${variant}-background`,
  };
}

export interface CustomerDetails {
  CustomerName: string;
  BillingAddress: string;
  Email: string;
  PhoneNo: string;
}

export interface InvoiceItemDetails {
  ItemId: string;
  ItemName: string;
  Category: string;
  Quantity: number;
  UnitPrice: number;
  Amount: number;
  Note?: string;
  showNote?: boolean;
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
  Status: string;
  GeneralNote?: string;
  ItemDetails?: InvoiceItemDetails[];
  Subtotal?: number;
  TotalAmount?: number;
  Currency?: string;
  Taxes?: number;
  Discount?: number;
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
  ItemId?: string;
  CreatedBy?: string;
  CreatedDate?: string;
  DateIssued: string;
  DueDate: string;
  Amount: number;
  LastUpdatedBy?: string;
  LastUpdatedDate?: string;
  Customer: CustomerDetails[];
  Status: string;
  GeneralNote?: string;
  ItemDetails?: InvoiceItemDetails[];
  Currency?: string;
  Taxes?: number;
  Discount?: number;
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
  Currency?: string;
  Taxes?: number;
  Discount?: number;
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
