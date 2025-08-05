import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from 'hooks/use-error-handler';
import {
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from '../services/invoices.service';
import { AddInvoiceParams, UpdateInvoiceParams } from '../types/invoices.types';

/**
 * GraphQL Inventory Hooks
 *
 * This file contains React Query hooks for GraphQL inventory operations.
 * These hooks follow the same patterns as the existing REST API hooks.
 */

// Update the type for params to use pageNo and pageSize
interface InvoiceQueryParams {
  pageNo: number;
  pageSize: number;
}

/**
 * Hook to fetch invoices with pagination, filtering, and sorting
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with invoices data
 *
 * @example
 * const { data, isLoading, error } = useGetInvoices({
 *   page: 1,
 *   pageSize: 10,
 *   filter: { }
 * });
 */
export const useGetInvoices = (params: InvoiceQueryParams) => {
  return useGlobalQuery({
    queryKey: ['invoices', params],
    queryFn: getInvoices,
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
 * const { mutate: insertItem, isPending } = useAddInvoice();
 * insertItem({ input: itemData });
 */
export const useAddInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: (params: AddInvoiceParams) => addInvoice(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoices',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'invoices',
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
 * const { mutate: updateItem, isPending } = useUpdateInvoice();
 * updateItem({ input: { id: 'item-123', stock: 50 } });
 */
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: UpdateInvoiceParams) => updateInvoice(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoices',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'invoices',
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
 * const { mutate: deleteItem, isPending } = useDeleteInvoice();
 * deleteItem('item-123');
 */
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: ({ filter, input }: { filter: string; input: { isHardDelete: boolean } }) =>
      deleteInvoice(filter, input),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'invoices',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'invoices',
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
