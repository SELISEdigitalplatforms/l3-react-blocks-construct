import { useGlobalQuery, useGlobalMutation } from 'state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from 'hooks/use-error-handler';
import {
  CreateInventoryItemParams,
  UpdateInventoryItemParams,
  BulkUpdateInventoryParams,
  ImportInventoryParams,
  ExportInventoryParams,
} from '../types/graphql.types';
import {
  getInventory,
  getInventoryItem,
  getInventoryStats,
  getCategories,
  getSuppliers,
  getLocations,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  bulkUpdateInventory,
  importInventory,
  exportInventory,
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
export const useGetInventory = (params: InventoryQueryParams) => {
  return useGlobalQuery({
    queryKey: ['inventory', params],
    queryFn: getInventory,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch a single inventory item by ID
 * @param id - Item ID to fetch
 * @returns Query result with inventory item data
 *
 * @example
 * const { data, isLoading, error } = useGetInventoryItem('item-123');
 */
export const useGetInventoryItem = (id: string) => {
  return useGlobalQuery({
    queryKey: ['inventoryItem', id],
    queryFn: getInventoryItem,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch inventory statistics
 * @returns Query result with inventory statistics
 *
 * @example
 * const { data, isLoading, error } = useGetInventoryStats();
 */
export const useGetInventoryStats = () => {
  return useGlobalQuery({
    queryKey: ['inventoryStats'],
    queryFn: getInventoryStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch available categories
 * @returns Query result with categories data
 *
 * @example
 * const { data, isLoading, error } = useGetCategories();
 */
export const useGetCategories = () => {
  return useGlobalQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to fetch available suppliers
 * @returns Query result with suppliers data
 *
 * @example
 * const { data, isLoading, error } = useGetSuppliers();
 */
export const useGetSuppliers = () => {
  return useGlobalQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to fetch inventory locations
 * @returns Query result with locations data
 *
 * @example
 * const { data, isLoading, error } = useGetLocations();
 */
export const useGetLocations = () => {
  return useGlobalQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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

/**
 * Hook to bulk update inventory items
 * @returns Mutation function to bulk update inventory items with loading and error states
 *
 * @example
 * const { mutate: bulkUpdate, isPending } = useBulkUpdateInventory();
 * bulkUpdate({ input: { items: [...] } });
 */
export const useBulkUpdateInventory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: BulkUpdateInventoryParams) => bulkUpdateInventory(params),
    onSuccess: (data) => {
      // Invalidate and refetch inventory queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStats'] });

      if (data.bulkUpdateInventory.success) {
        toast({
          variant: 'success',
          title: t('BULK_UPDATE_COMPLETED'),
          description: t('INVENTORY_ITEMS_BULK_UPDATED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          { error: { message: data.bulkUpdateInventory.errors?.join(', ') } },
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
 * Hook to import inventory items from CSV
 * @returns Mutation function to import inventory items with loading and error states
 *
 * @example
 * const { mutate: importItems, isPending } = useImportInventory();
 * importItems({ input: { file: csvFile } });
 */
export const useImportInventory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: ImportInventoryParams) => importInventory(params),
    onSuccess: (data) => {
      // Invalidate and refetch inventory queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryStats'] });

      if (data.importInventory.success) {
        const summary = data.importInventory.summary;
        toast({
          variant: 'success',
          title: t('IMPORT_COMPLETED'),
          description: t('IMPORTED_ITEMS_SUCCESSFULLY', {
            count: summary.successfulImports,
            total: summary.totalProcessed,
          }),
        });
      } else {
        handleError(
          { error: { message: data.importInventory.errors?.join(', ') } },
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
 * Hook to export inventory items
 * @returns Mutation function to export inventory items with loading and error states
 *
 * @example
 * const { mutate: exportItems, isPending } = useExportInventory();
 * exportItems({ input: { format: 'CSV' } });
 */
export const useExportInventory = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: ExportInventoryParams) => exportInventory(params),
    onSuccess: (data) => {
      if (data.exportInventory.success) {
        // Trigger download
        const link = document.createElement('a');
        link.href = data.exportInventory.downloadUrl;
        link.download = 'inventory-export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          variant: 'success',
          title: t('EXPORT_COMPLETED'),
          description: t('INVENTORY_EXPORTED_SUCCESSFULLY'),
        });
      } else {
        handleError(
          { error: { message: data.exportInventory.errors?.join(', ') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
