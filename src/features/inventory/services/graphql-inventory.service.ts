import { graphqlClient } from 'lib/graphql-client';
import {
  CreateInventoryItemResponse,
  CreateInventoryItemParams,
  UpdateInventoryItemResponse,
  UpdateInventoryItemParams,
  DeleteInventoryItemResponse,
} from '../types/graphql.types';
import { GET_INVENTORY_QUERY } from '../graphql/queries';
import {
  CREATE_INVENTORY_ITEM_MUTATION,
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
