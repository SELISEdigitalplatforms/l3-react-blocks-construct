/**
 * GraphQL Types for Inventory Management
 *
 * This file contains TypeScript interfaces and types for GraphQL operations
 * related to inventory management, following the same patterns as REST API types.
 */

// Base Inventory Item Type
export interface InventoryItem {
  _id: string;
  Category: string;
  CreatedBy: string;
  CreatedDate: string;
  IsActive: boolean;
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

// GraphQL Query Response Types
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

// GraphQL Mutation Response Types
export interface CreateInventoryItemResponse {
  createInventoryItem: {
    item: InventoryItem;
    success: boolean;
    errors?: string[];
  };
}

export interface DeleteInventoryItemResponse {
  deleteInventoryItem: {
    success: boolean;
    errors?: string[];
  };
}

export interface AddInventoryItemInput {
  ItemName: string;
  Category: string;
  Supplier: string;
  ItemLoc: string;
  Price: number;
  Status: 'ACTIVE' | 'DISCONTINUED';
  Stock: number;
  Tags: string[];
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

// For new updateInventoryItem mutation (filter + input)
export interface InventoryItemUpdateInput {
  ItemName?: string;
  Category?: string;
  Supplier?: string;
  ItemLoc?: string;
  Price?: number;
  Status?: 'ACTIVE' | 'DISCONTINUED';
  Stock?: number;
  Tags?: string[];
  EligibleWarranty?: boolean;
  EligibleReplacement?: boolean;
  Discount?: boolean;
  ItemImageFileId?: string;
  ItemImageFileIds?: string[];
}

export interface UpdateInventoryItemParams {
  filter: string;
  input: InventoryItemUpdateInput;
}

export interface UpdateInventoryItemResponse {
  updateInventoryItem: {
    itemId: string;
    totalImpactedData: number;
    acknowledged: boolean;
  };
}
