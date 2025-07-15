import { graphqlClient } from 'lib/graphql-client';
import {
  GetInventoryItemResponse,
  GetInventoryStatsResponse,
  GetCategoriesResponse,
  GetSuppliersResponse,
  GetLocationsResponse,
  CreateInventoryItemResponse,
  CreateInventoryItemParams,
  UpdateInventoryItemResponse,
  UpdateInventoryItemParams,
  DeleteInventoryItemResponse,
  BulkUpdateInventoryResponse,
  BulkUpdateInventoryParams,
  ImportInventoryResponse,
  ImportInventoryParams,
  ExportInventoryResponse,
  ExportInventoryParams,
} from '../types/graphql.types';
import {
  GET_INVENTORY_QUERY,
  GET_INVENTORY_ITEM_QUERY,
  GET_INVENTORY_STATS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_SUPPLIERS_QUERY,
  GET_LOCATIONS_QUERY,
} from '../graphql/queries';
import {
  CREATE_INVENTORY_ITEM_MUTATION,
  UPDATE_INVENTORY_ITEM_MUTATION,
  DELETE_INVENTORY_ITEM_MUTATION,
  BULK_UPDATE_INVENTORY_MUTATION,
  IMPORT_INVENTORY_MUTATION,
  EXPORT_INVENTORY_MUTATION,
} from '../graphql/mutations';

/**
 * GraphQL Inventory Service
 *
 * This service provides GraphQL-based operations for inventory management.
 * It follows the same patterns as the existing REST services but uses GraphQL.
 */

/**
 * Fetches paginated inventory items with filtering and sorting
 * @param context - React Query context with queryKey array
 * @param context.queryKey.1 - Filtering and pagination params
 * @returns Promise with inventory data
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['inventory', { page: 1, pageSize: 10 }],
 *   queryFn: getInventory
 * });
 */
export const getInventory = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number }];
}) => {
  const [, { pageNo, pageSize }] = context.queryKey;
  return graphqlClient.query({
    query: GET_INVENTORY_QUERY,
    variables: {
      input: {
        filter: '{}',
        sort: '{}',
        pageNo,
        pageSize,
      },
    },
  });
};

/**
 * Fetches a single inventory item by ID
 * @param context - React Query context with queryKey array
 * @param context.queryKey.1 - Item ID
 * @returns Promise with inventory item data
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['inventoryItem', 'item-123'],
 *   queryFn: getInventoryItem
 * });
 */
export const getInventoryItem = async (context: {
  queryKey: [string, string];
}): Promise<GetInventoryItemResponse> => {
  const [, id] = context.queryKey;

  const response = await graphqlClient.query<GetInventoryItemResponse>({
    query: GET_INVENTORY_ITEM_QUERY,
    variables: { id },
  });

  return response;
};

/**
 * Fetches inventory statistics
 * @returns Promise with inventory statistics
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['inventoryStats'],
 *   queryFn: getInventoryStats
 * });
 */
export const getInventoryStats = async (): Promise<GetInventoryStatsResponse> => {
  const response = await graphqlClient.query<GetInventoryStatsResponse>({
    query: GET_INVENTORY_STATS_QUERY,
  });

  return response;
};

/**
 * Fetches available categories
 * @returns Promise with categories data
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['categories'],
 *   queryFn: getCategories
 * });
 */
export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const response = await graphqlClient.query<GetCategoriesResponse>({
    query: GET_CATEGORIES_QUERY,
  });

  return response;
};

/**
 * Fetches available suppliers
 * @returns Promise with suppliers data
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['suppliers'],
 *   queryFn: getSuppliers
 * });
 */
export const getSuppliers = async (): Promise<GetSuppliersResponse> => {
  const response = await graphqlClient.query<GetSuppliersResponse>({
    query: GET_SUPPLIERS_QUERY,
  });

  return response;
};

/**
 * Fetches inventory locations
 * @returns Promise with locations data
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['locations'],
 *   queryFn: getLocations
 * });
 */
export const getLocations = async (): Promise<GetLocationsResponse> => {
  const response = await graphqlClient.query<GetLocationsResponse>({
    query: GET_LOCATIONS_QUERY,
  });

  return response;
};

/**
 * Creates a new inventory item
 * @param params - Create inventory item parameters
 * @returns Promise with created item data
 * @example
 * // Basic usage
 * const result = await createInventoryItem({
 *   input: { itemName: 'New Item', category: 'Electronics', ... }
 * });
 */
export const createInventoryItem = async (
  params: CreateInventoryItemParams
): Promise<CreateInventoryItemResponse> => {
  const response = await graphqlClient.mutate<CreateInventoryItemResponse>({
    query: CREATE_INVENTORY_ITEM_MUTATION,
    variables: params,
  });

  return response;
};

/**
 * Updates an existing inventory item
 * @param params - Update inventory item parameters
 * @returns Promise with updated item data
 * @example
 * // Basic usage
 * const result = await updateInventoryItem({
 *   input: { id: 'item-123', stock: 50, price: '100.00' }
 * });
 */
export const updateInventoryItem = async (
  params: UpdateInventoryItemParams
): Promise<UpdateInventoryItemResponse> => {
  const response = await graphqlClient.mutate<UpdateInventoryItemResponse>({
    query: UPDATE_INVENTORY_ITEM_MUTATION,
    variables: params,
  });

  return response;
};

/**
 * Deletes an inventory item
 * @param id - Item ID to delete
 * @returns Promise with deletion result
 * @example
 * // Basic usage
 * const result = await deleteInventoryItem('item-123');
 */
export const deleteInventoryItem = async (id: string): Promise<DeleteInventoryItemResponse> => {
  const response = await graphqlClient.mutate<DeleteInventoryItemResponse>({
    query: DELETE_INVENTORY_ITEM_MUTATION,
    variables: { id },
  });

  return response;
};

/**
 * Bulk updates inventory items
 * @param params - Bulk update parameters
 * @returns Promise with bulk update result
 * @example
 * // Basic usage
 * const result = await bulkUpdateInventory({
 *   input: { items: [{ id: 'item-123', updates: { stock: 50 } }] }
 * });
 */
export const bulkUpdateInventory = async (
  params: BulkUpdateInventoryParams
): Promise<BulkUpdateInventoryResponse> => {
  const response = await graphqlClient.mutate<BulkUpdateInventoryResponse>({
    query: BULK_UPDATE_INVENTORY_MUTATION,
    variables: params,
  });

  return response;
};

/**
 * Imports inventory items from CSV
 * @param params - Import parameters
 * @returns Promise with import result
 * @example
 * // Basic usage
 * const result = await importInventory({
 *   input: { file: csvFile, options: { skipHeader: true } }
 * });
 */
export const importInventory = async (
  params: ImportInventoryParams
): Promise<ImportInventoryResponse> => {
  const response = await graphqlClient.mutate<ImportInventoryResponse>({
    query: IMPORT_INVENTORY_MUTATION,
    variables: params,
  });

  return response;
};

/**
 * Exports inventory items
 * @param params - Export parameters
 * @returns Promise with export result
 * @example
 * // Basic usage
 * const result = await exportInventory({
 *   input: { format: 'CSV', filters: { category: 'Electronics' } }
 * });
 */
export const exportInventory = async (
  params: ExportInventoryParams
): Promise<ExportInventoryResponse> => {
  const response = await graphqlClient.mutate<ExportInventoryResponse>({
    query: EXPORT_INVENTORY_MUTATION,
    variables: params,
  });

  return response;
};
