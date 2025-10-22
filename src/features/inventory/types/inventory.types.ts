/**
 * GraphQL Types for Inventory Management
 *
 * This file contains TypeScript interfaces and types for GraphQL operations
 * related to inventory management, following the same patterns as REST API types.
 */

export enum InventoryStatus {
  ACTIVE = 'Active',
  DISCONTINUED = 'Discontinued',
}

export const statusColors: Record<InventoryStatus, string> = {
  [InventoryStatus.ACTIVE]: 'success',
  [InventoryStatus.DISCONTINUED]: 'low-emphasis',
};

export const tags = ['Accessories', 'Electronic', 'Gaming', 'Monitor'];

export const categoryOptions = [
  'Supplies',
  'Electronics',
  'Furniture',
  'Apparel',
  'Accessories',
  'Wearables',
];
export const itemLocOptions = ['Warehouse A', 'Warehouse B', 'Warehouse C'];

export interface InventoryItem {
  Category: string;
  CreatedBy: string;
  CreatedDate: string;
  DeletedDate: string;
  IsDeleted: boolean;
  ItemId: string;
  ItemImageFileId: string;
  ItemImageFileIds: string[];
  ItemLoc: string;
  ItemName: string;
  Language: string;
  Stock: number;
  LastUpdatedBy: string;
  LastUpdatedDate: string;
  OrganizationIds: string[];
  Price: number;
  Status: string;
  Supplier: string;
  Tags: string[];
  EligibleWarranty: boolean;
  EligibleReplacement: boolean;
  Discount: boolean;
}

export interface GetInventoryResponse {
  inventory: {
    items: InventoryItem[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface GetInventoryItemResponse {
  inventoryItem: InventoryItem;
}

export interface GetInventoryStatsResponse {
  inventoryStats: {
    totalItems: number;
    activeItems: number;
    discontinuedItems: number;
    lowStockItems: number;
    totalValue: string;
    categories: Array<{
      name: string;
      count: number;
    }>;
    suppliers: Array<{
      name: string;
      count: number;
    }>;
  };
}

export interface AddInventoryItemInput {
  ItemName: string;
  Category: string;
  Supplier: string;
  ItemLoc: string;
  Price: number;
  Status: InventoryStatus;
  Stock: number;
  Tags: string[];
  DeletedDate?: string;
  EligibleWarranty: boolean;
  EligibleReplacement: boolean;
  Discount: boolean;
  ItemImageFileId: string;
  ItemImageFileIds: string[];
}

export interface AddInventoryItemParams {
  input: AddInventoryItemInput;
}

export interface AddInventoryItemResponse {
  insertInventoryItem: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

export interface UpdateInventoryItemInput {
  ItemName?: string;
  Category?: string;
  Supplier?: string;
  ItemLoc?: string;
  Price?: number;
  Status?: InventoryStatus;
  Stock?: number;
  Tags?: string[];
  DeletedDate?: string;
  EligibleWarranty?: boolean;
  EligibleReplacement?: boolean;
  Discount?: boolean;
  ItemImageFileId?: string;
  ItemImageFileIds?: string[];
}

export interface UpdateInventoryItemParams {
  filter: string;
  input: UpdateInventoryItemInput;
}

export interface UpdateInventoryItemResponse {
  updateInventoryItem: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}

export interface DeleteInventoryItemResponse {
  deleteInventoryItem: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}
