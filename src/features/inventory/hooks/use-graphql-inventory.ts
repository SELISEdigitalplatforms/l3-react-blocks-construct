import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from 'hooks/use-error-handler';
import { CreateInventoryItemParams, UpdateInventoryItemParams } from '../types/graphql.types';
import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../services/graphql-inventory.service';

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
 * Hook to create a new inventory item
 * @returns Mutation function to create inventory item with loading and error states
 *
 * @example
 * const { mutate: createItem, isPending } = useCreateInventoryItem();
 * createItem({ input: itemData });
 */
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: CreateInventoryItemParams) => createInventoryItem(params),
    onSuccess: (data) => {
      // Invalidate and refetch inventory queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStats'] });

      if (data.createInventoryItem.success) {
        toast({
          variant: 'success',
          title: t('ITEM_CREATED'),
          description: t('INVENTORY_ITEM_CREATED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          { error: { message: data.createInventoryItem.errors?.join(', ') } },
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
    onSuccess: (data) => {
      // Invalidate and refetch inventory queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStats'] });

      if (data.updateInventoryItem.success) {
        toast({
          variant: 'success',
          title: t('ITEM_UPDATED'),
          description: t('INVENTORY_ITEM_UPDATED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          { error: { message: data.updateInventoryItem.errors?.join(', ') } },
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
 * Hook to delete an inventory item
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
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: (data) => {
      // Invalidate and refetch inventory queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStats'] });

      if (data.deleteInventoryItem.success) {
        toast({
          variant: 'success',
          title: t('ITEM_DELETED'),
          description: t('INVENTORY_ITEM_DELETED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          { error: { message: data.deleteInventoryItem.errors?.join(', ') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
