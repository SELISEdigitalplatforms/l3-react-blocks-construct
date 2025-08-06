import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useErrorHandler } from 'hooks/use-error-handler';
import {
  getInvoiceItems,
  addInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
} from '../services/invoices.service';
import { AddInvoiceItemParams, UpdateInvoiceItemParams } from '../types/invoices.types';

/**
 * GraphQL Inventory Hooks
 *
 * This file contains React Query hooks for GraphQL inventory operations.
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
export const useGetInvoiceItems = (params: InvoiceItemQueryParams) => {
  return useGlobalQuery({
    queryKey: ['invoice-items', params],
    queryFn: getInvoiceItems,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
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
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: (params: AddInvoiceItemParams) => addInvoiceItem(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
        type: 'active',
      });

      if (data.insertInvoice?.acknowledged) {
        toast({
          variant: 'success',
          title: t('INVOICE_ADDED'),
          description: t('INVOICE_SUCCESSFULLY_CREATED'),
        });
      }
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
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: UpdateInvoiceItemParams) => updateInvoiceItem(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'invoice-items',
        type: 'active',
      });

      if (data.updateInvoice.acknowledged) {
        toast({
          variant: 'success',
          title: t('INVOICE_UPDATED'),
          description: t('INVOICE_SUCCESSFULLY_UPDATED'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_UPDATE_ITEM', message: t('UNABLE_UPDATE_INVOICE') } },
          { variant: 'destructive' }
        );
      }
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
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

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

      if (data.deleteInvoice?.acknowledged) {
        toast({
          variant: 'success',
          title: t('INVOICE_DELETED'),
          description: t('INVOICE_SUCCESSFULLY_DELETED'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_DELETE_ITEM', message: t('UNABLE_DELETE_INVOICE') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
