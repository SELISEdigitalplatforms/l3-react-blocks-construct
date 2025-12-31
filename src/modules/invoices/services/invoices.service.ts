import { graphqlClient } from '@/lib/graphql-client';
import { GET_INVOICE_ITEMS_QUERY } from '../graphql/queries';
import {
  INSERT_INVOICE_ITEM_MUTATION,
  UPDATE_INVOICE_ITEM_MUTATION,
  DELETE_INVOICE_ITEM_MUTATION,
} from '../graphql/mutations';
import {
  AddInvoiceItemParams,
  AddInvoiceItemResponse,
  UpdateInvoiceItemParams,
  UpdateInvoiceItemResponse,
  DeleteInvoiceItemResponse,
} from '../types/invoices.types';

interface InvoiceItemsData {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  totalPages: number;
  pageSize: number;
  pageNo: number;
  items: any[];
}

/**
 * GraphQL Invoice Service
 *
 * This service provides GraphQL-based operations for invoice management.
 * It follows the same patterns as the existing REST services but uses GraphQL.
 */

/**
 * Fetches paginated invoice items with filtering and sorting
 * @param context - React Query context with queryKey array
 * @param context.queryKey.1 - Filtering and pagination params
 * @returns Promise with invoice data
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['invoice-items', { pageNo: 1, pageSize: 100 }],
 *   queryFn: getInvoiceItems
 * });
 */
type GetInvoiceItemsContext = {
  queryKey: readonly [string, { pageNo: number; pageSize: number }];
};

export const getInvoiceItems = async (context: GetInvoiceItemsContext) => {
  try {
    const [, { pageNo, pageSize }] = context.queryKey;
    const response = await graphqlClient.query<{
      getInvoiceItems?: InvoiceItemsData;
      InvoiceItems?: InvoiceItemsData;
      invoiceItems?: InvoiceItemsData;
    }>({
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

    const responseData = (response as any)?.data || response;

    let invoiceItems: InvoiceItemsData | null = null;
    if (responseData && typeof responseData === 'object') {
      if ('getInvoiceItems' in responseData) {
        invoiceItems = responseData.getInvoiceItems as InvoiceItemsData;
      } else if ('InvoiceItems' in responseData) {
        invoiceItems = responseData.InvoiceItems as InvoiceItemsData;
      } else if ('invoiceItems' in responseData) {
        invoiceItems = responseData.invoiceItems as InvoiceItemsData;
      }
    }

    if (!invoiceItems || typeof invoiceItems !== 'object') {
      const errorMessage = 'Invalid response structure: Missing getInvoiceItems';
      console.error('Invalid response structure:', { response: responseData });
      throw new Error(`Failed to fetch invoice items: ${errorMessage}`);
    }

    const result = {
      hasNextPage: Boolean(invoiceItems?.hasNextPage ?? false),
      hasPreviousPage: Boolean(invoiceItems?.hasPreviousPage ?? false),
      totalCount: Number(invoiceItems?.totalCount ?? 0),
      totalPages: Number(invoiceItems?.totalPages ?? 0),
      pageSize: Number(invoiceItems?.pageSize ?? pageSize),
      pageNo: Number(invoiceItems?.pageNo ?? pageNo),
      items: Array.isArray(invoiceItems?.items) ? invoiceItems.items : [],
    };

    return result;
  } catch (error) {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: 'Unknown error' };

    console.error('Error in getInvoiceItems:', errorDetails);

    throw new Error(
      error instanceof Error
        ? `Failed to fetch invoice items: ${error.message}`
        : 'An unknown error occurred while fetching invoice items'
    );
  }
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
export const addInvoiceItem = async (
  params: AddInvoiceItemParams
): Promise<AddInvoiceItemResponse> => {
  // Ensure Taxes and Discount are always included, defaulting to 0 if undefined
  const payload = {
    ...params,
    input: {
      ...params.input,
      Taxes: params.input.Taxes ?? 0,
      Discount: params.input.Discount ?? 0,
    },
  };

  const response = await graphqlClient.mutate<AddInvoiceItemResponse>({
    query: INSERT_INVOICE_ITEM_MUTATION,
    variables: payload,
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
