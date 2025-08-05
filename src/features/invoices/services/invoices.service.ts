import { graphqlClient } from 'lib/graphql-client';
import { GET_INVOICES_QUERY } from '../graphql/queries';
import {
  INSERT_INVOICE_MUTATION,
  UPDATE_INVOICE_MUTATION,
  DELETE_INVOICE_MUTATION,
} from '../graphql/mutations';
import {
  AddInvoiceParams,
  AddInvoiceResponse,
  DeleteInvoiceResponse,
  UpdateInvoiceParams,
  UpdateInvoiceResponse,
} from '../types/invoices.types';

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
export const getInvoices = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number }];
}) => {
  const [, { pageNo, pageSize }] = context.queryKey;
  return graphqlClient.query({
    query: GET_INVOICES_QUERY,
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
export const addInvoice = async (params: AddInvoiceParams): Promise<AddInvoiceResponse> => {
  const response = await graphqlClient.mutate<AddInvoiceResponse>({
    query: INSERT_INVOICE_MUTATION,
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
export const updateInvoice = async (
  params: UpdateInvoiceParams
): Promise<UpdateInvoiceResponse> => {
  const response = await graphqlClient.mutate<UpdateInvoiceResponse>({
    query: UPDATE_INVOICE_MUTATION,
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
export const deleteInvoice = async (
  filter: string,
  input: { isHardDelete: boolean }
): Promise<DeleteInvoiceResponse> => {
  const response = await graphqlClient.mutate<DeleteInvoiceResponse>({
    query: DELETE_INVOICE_MUTATION,
    variables: { filter, input },
  });
  return response;
};
