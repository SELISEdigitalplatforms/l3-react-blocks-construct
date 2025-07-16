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

export interface UpdateInventoryItemResponse {
  updateInventoryItem: {
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

// Input Types for Mutations
export interface CreateInventoryItemInput {
  itemName: string;
  category: string;
  supplier: string;
  itemLocation: string;
  stock: number;
  price: string;
  status: 'ACTIVE' | 'DISCONTINUED';
  itemImage?: string;
  description?: string;
  warranty?: boolean;
  replacement?: boolean;
  discount?: boolean;
  tags?: string[];
}

export interface UpdateInventoryItemInput {
  id: string;
  itemName?: string;
  category?: string;
  supplier?: string;
  itemLocation?: string;
  stock?: number;
  price?: string;
  status?: 'ACTIVE' | 'DISCONTINUED';
  itemImage?: string;
  description?: string;
  warranty?: boolean;
  replacement?: boolean;
  discount?: boolean;
  tags?: string[];
}

// Mutation Variables Types
export interface CreateInventoryItemParams {
  input: CreateInventoryItemInput;
}

export interface UpdateInventoryItemParams {
  input: UpdateInventoryItemInput;
}

export interface DeleteInventoryItemParams {
  id: string;
}
