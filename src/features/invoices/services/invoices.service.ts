import { graphqlClient } from 'lib/graphql-client';
import { GET_INVOICE_ITEMS_QUERY } from '../graphql/queries';
import {
  INSERT_INVOICE_ITEM_MUTATION,
  UPDATE_INVOICE_ITEM_MUTATION,
  DELETE_INVOICE_ITEM_MUTATION,
} from '../graphql/mutations';
import {
  AddInvoiceItemParams,
  AddInvoiceItemResponse,
  DeleteInvoiceItemResponse,
  UpdateInvoiceItemParams,
  UpdateInvoiceItemResponse,
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
 *   queryKey: ['inventory', { pageNo: 1, pageSize: 100 }],
 *   queryFn: getInvoiceItems
 * });
 */
export const getInvoiceItems = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number }];
}) => {
  const [, { pageNo, pageSize }] = context.queryKey;
  return graphqlClient.query({
    query: GET_INVOICE_ITEMS_QUERY,
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
 * Inserts a new invoices item (GraphQL)
 * @param params - Invoice item insert parameters
 * @returns Promise with inserted item data
 * @example
 * // Basic usage
 * const result = await addInvoiceItem({
 *   input: { itemName: 'New Invoice', category: 'Electronics', ... }
 * });
 */
export const addInvoiceItem = async (params: AddInvoiceItemParams): Promise<AddInvoiceItemResponse> => {
  const response = await graphqlClient.mutate<AddInvoiceItemResponse>({
    query: INSERT_INVOICE_ITEM_MUTATION,
    variables: params,
  });
  return response;
};

/**
 * Updates an existing invoice item
 * @param params - Update invoice item parameters
 * @returns Promise with updated item data
 * @example
 * // Basic usage
 * const result = await updateInvoiceItem({
 *   input: { id: 'item-123', stock: 50, price: '100.00' }
 * });
 */
export const updateInvoiceItem = async (
  params: UpdateInvoiceItemParams
): Promise<UpdateInvoiceItemResponse> => {
  const response = await graphqlClient.mutate<UpdateInvoiceItemResponse>({
    query: UPDATE_INVOICE_ITEM_MUTATION,
    variables: params,
  });
  return response;
};

/**
 * Deletes an invoice item by ID
 * @param filter - The filter string to identify the item to delete (usually the itemId)
 * @returns Promise with deletion result
 * @example
 * // Basic usage
 * const result = await deleteInvoiceItem('item-123');
 */
export const deleteInvoiceItem = async (
  filter: string,
  input: { isHardDelete: boolean }
): Promise<DeleteInvoiceItemResponse> => {
  const response = await graphqlClient.mutate<DeleteInvoiceItemResponse>({
    query: DELETE_INVOICE_ITEM_MUTATION,
    variables: { filter, input },
  });
  return response;
};
