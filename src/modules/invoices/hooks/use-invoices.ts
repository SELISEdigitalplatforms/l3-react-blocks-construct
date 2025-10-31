import { useGlobalQuery, useGlobalMutation } from '@/state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import {
  getInvoiceItems,
  addInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
} from '../services/invoices.service';
import {
  AddInvoiceItemParams,
  InvoiceItem,
  UpdateInvoiceItemParams,
} from '../types/invoices.types';

export interface InvoiceItemsResponse {
  InvoiceItems: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    totalPages: number;
    pageSize: number;
    pageNo: number;
    items: InvoiceItem[];
  };
}

/**
 * GraphQL Invoice Hooks
 *
 * This file contains React Query hooks for GraphQL invoice operations.
 * These hooks follow the same patterns as the existing REST API hooks.
 */

// Update the type for params to use pageNo and pageSize
interface InvoiceItemQueryParams {
  pageNo: number;
  pageSize: number;
}

/**
 * Hook to fetch invoices with pagination, filtering, and sorting
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with invoice items data
 *
 * @example
 * const { data, isLoading, error } = useGetInvoices({
 *   page: 1,
 *   pageSize: 10,
 *   filter: { }
 * });
 */
// Define the type for the invoice items response
type InvoiceItemsData = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  totalPages: number;
  pageSize: number;
  pageNo: number;
  items: InvoiceItem[];
};

// Helper function to fetch invoice items
const fetchInvoiceItems = async ({
  queryKey,
}: {
  queryKey: readonly [string, InvoiceItemQueryParams];
}): Promise<InvoiceItemsData> => {
  const [, params] = queryKey;
  return getInvoiceItems({
    queryKey: ['invoice-items', { pageNo: params.pageNo, pageSize: params.pageSize }],
  });
};

export const useGetInvoiceItems = (params: InvoiceItemQueryParams) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalQuery<
    InvoiceItemsData,
    Error,
    InvoiceItemsData,
    ['invoice-items', InvoiceItemQueryParams]
  >({
    queryKey: ['invoice-items', params],
    queryFn: async ({ queryKey }) => {
      try {
        return await fetchInvoiceItems({ queryKey });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'COULD_NOT_RETRIEVE_INVOICE_ITEM';
        console.error('Error in useGetInvoiceItems queryFn:', error);
        toast({
          variant: 'destructive',
          title: t('UNABLE_LOAD_INVOICE_ITEMS'),
          description: t(errorMessage),
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000),
    onError: (error: Error) => {
      console.error('Error in useGetInvoiceItems:', error);
      toast({
        variant: 'destructive',
        title: t('UNABLE_LOAD_INVOICE_ITEMS'),
        description: t('COULD_NOT_RETRIEVE_INVOICE_ITEM'),
      });
    },
  });
};

/**
 * Hook to insert a new invoice
 * @returns Mutation function to insert invoice with loading and error states
 *
 * @example
 * const { mutate: insertItem, isPending } = useAddInvoiceItem();
 * insertItem({ input: itemData });
 */
export const useAddInvoiceItem = () => {
  const queryClient = useQueryClient();

  return useGlobalMutation({
    mutationFn: (params: AddInvoiceItemParams) => addInvoiceItem(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
        type: 'active',
      });
    },
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to update an existing invoice
 * @returns Mutation function to update invoice with loading and error states
 *
 * @example
 * const { mutate: updateItem, isPending } = useUpdateInvoiceItem();
 * updateItem({ input: { id: 'item-123', stock: 50 } });
 */
export const useUpdateInvoiceItem = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: UpdateInvoiceItemParams) => updateInvoiceItem(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
      });
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};

/**
 * Hook to delete an invoice by ID
 * @returns Mutation function to delete invoice with loading and error states
 *
 * @example
 * const { mutate: deleteItem, isPending } = useDeleteInvoiceItem();
 * deleteItem('item-123');
 */
export const useDeleteInvoiceItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: ({ filter, input }: { filter: string; input: { isHardDelete: boolean } }) =>
      deleteInvoiceItem(filter, input),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
        type: 'active',
      });

      if (data.deleteInvoiceItem?.acknowledged) {
        toast({
          variant: 'success',
          title: t('INVOICE_DELETED'),
          description: t('INVOICE_DELETED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          {
            error: { title: t('UNABLE_DELETED_INVOICE'), message: t('INVOICE_COULD_NOT_DELETED') },
          },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error);
    },
  });
};
