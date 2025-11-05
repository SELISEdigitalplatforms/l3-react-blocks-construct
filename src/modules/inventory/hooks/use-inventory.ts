import { useGlobalQuery, useGlobalMutation } from '@/state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { AddInventoryItemParams, UpdateInventoryItemParams } from '../types/inventory.types';
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../services/inventory.service';

/**
 * GraphQL Inventory Hooks
 *
 * This file contains React Query hooks for GraphQL inventory operations.
 * These hooks follow the same patterns as the existing REST API hooks.
 */

// Update the type for params to use pageNo and pageSize
interface InventoryQueryParams {
  pageNo: number;
  pageSize: number;
}

/**
 * Hook to fetch inventory items with pagination, filtering, and sorting
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with inventory data
 *
 * @example
 * const { data, isLoading, error } = useGetInventory({
 *   page: 1,
 *   pageSize: 10,
 *   filter: { category: 'Electronics' }
 * });
 */
export const useGetInventories = (params: InventoryQueryParams) => {
  return useGlobalQuery({
    queryKey: ['inventory', params],
    queryFn: getInventory,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to insert a new inventory item
 * @returns Mutation function to insert inventory item with loading and error states
 *
 * @example
 * const { mutate: insertItem, isPending } = useInventoryItemInsert();
 * insertItem({ input: itemData });
 */
export const useAddInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: (params: AddInventoryItemParams) => addInventoryItem(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'inventory',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'inventory',
        type: 'active',
      });

      if (data.insertInventoryItem?.acknowledged) {
        toast({
          variant: 'success',
          title: t('INVENTORY_ITEM_ADDED'),
          description: t('INVENTORY_ITEM_CREATED_SUCCESSFULLY'),
        });
      }
    },
    onError: (error) => {
      throw error;
    },
  });
};

/**
 * Hook to update an existing inventory item
 * @returns Mutation function to update inventory item with loading and error states
 *
 * @example
 * const { mutate: updateItem, isPending } = useUpdateInventoryItem();
 * updateItem({ input: { id: 'item-123', stock: 50 } });
 */
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: UpdateInventoryItemParams) => updateInventoryItem(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'inventory',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'inventory',
        type: 'active',
      });

      if (data.updateInventoryItem.acknowledged) {
        toast({
          variant: 'success',
          title: t('INVENTORY_ITEM_UPDATED'),
          description: t('INVENTORY_ITEM_UPDATED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_UPDATE_ITEM', message: t('UNABLE_UPDATE_INVENTORY_ITEM') } },
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
 * Hook to delete an inventory item by ID
 * @returns Mutation function to delete inventory item with loading and error states
 *
 * @example
 * const { mutate: deleteItem, isPending } = useDeleteInventoryItem();
 * deleteItem('item-123');
 */
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: ({ filter, input }: { filter: string; input: { isHardDelete: boolean } }) =>
      deleteInventoryItem(filter, input),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'inventory',
      });

      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'inventory',
        type: 'active',
      });

      if (data.deleteInventoryItem?.acknowledged) {
        toast({
          variant: 'success',
          title: t('INVENTORY_ITEM_DELETED'),
          description: t('INVENTORY_ITEM_DELETED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_DELETE_ITEM', message: t('UNABLE_DELETE_INVENTORY_ITEM') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
