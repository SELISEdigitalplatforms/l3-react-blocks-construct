import { graphqlClient } from '@/lib/graphql-client';
import {
  AddInventoryItemResponse,
  AddInventoryItemParams,
  UpdateInventoryItemResponse,
  UpdateInventoryItemParams,
  DeleteInventoryItemResponse,
} from '../types/inventory.types';
import { GET_INVENTORY_QUERY } from '../graphql/queries';
import {
  INSERT_INVENTORY_ITEM_MUTATION,
  UPDATE_INVENTORY_ITEM_MUTATION,
  DELETE_INVENTORY_ITEM_MUTATION,
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
 * Inserts a new inventory item (GraphQL)
 * @param params - Inventory item insert parameters
 * @returns Promise with inserted item data
 * @example
 * // Basic usage
 * const result = await inventoryItemInsert({
 *   input: { itemName: 'New Item', category: 'Electronics', ... }
 * });
 */
export const addInventoryItem = async (
  params: AddInventoryItemParams
): Promise<AddInventoryItemResponse> => {
  const response = await graphqlClient.mutate<AddInventoryItemResponse>({
    query: INSERT_INVENTORY_ITEM_MUTATION,
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
 * Deletes an inventory item by ID
 * @param filter - The filter string to identify the item to delete (usually the itemId)
 * @returns Promise with deletion result
 * @example
 * // Basic usage
 * const result = await deleteInventoryItem('item-123');
 */
export const deleteInventoryItem = async (
  filter: string,
  input: { isHardDelete: boolean }
): Promise<DeleteInventoryItemResponse> => {
  const response = await graphqlClient.mutate<DeleteInventoryItemResponse>({
    query: DELETE_INVENTORY_ITEM_MUTATION,
    variables: { filter, input },
  });
  return response;
};
