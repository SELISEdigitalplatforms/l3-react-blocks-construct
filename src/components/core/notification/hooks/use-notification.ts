import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GetNotificationsParams, Notification } from '../types/notification.types';
import {
  getNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from '../services/notification.service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch notifications with pagination and filtering
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with notifications and metadata
 */
export const useGetNotifications = (params: GetNotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: getNotifications,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to mark a notification as read
 * @returns Mutation function to mark notification as read with loading and error states
 *
 * @example
 * const { mutate: markAsRead, isPending } = useMarkNotificationAsRead();
 *
 * // In your component:
 * markAsRead(notificationId);
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (data, notificationId) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      queryClient.setQueryData<{ notifications: Notification[] }>(['notifications'], (old) => {
        if (!old) return old;

        return {
          ...old,
          notifications: old.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          ),
        };
      });

      if (data.isSuccess) {
        toast({
          variant: 'success',
          title: t('MARKED_AS_READ'),
          description: t('NOTIFICATION_HAS_MARKED_AS_READ'),
        });
      }
    },
  });
};

/**
 * Custom hook to mark all notifications as read
 *
 * @param onSuccess - Optional callback function to be called after successful mutation
 * @returns {Object} The mutation object from react-query with the following properties:
 * @property {Function} mutate - Function to trigger the mark all as read action
 * @property {boolean} isPending - Indicates if the mutation is in progress
 * @property {Error | null} error - Error object if the mutation fails
 * @property {boolean} isSuccess - Indicates if the mutation was successful
 * @property {Function} reset - Function to reset the mutation state
 *
 * @example
 * const { mutate: markAllAsRead, isPending } = useMarkAllNotificationAsRead({
 *   onSuccess: () => {
 *     // Handle successful mark all as read
 *   }
 * });
 *
 * // To mark all notifications as read:
 * markAllAsRead();
 */
export const useMarkAllNotificationAsRead = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: markAllNotificationAsRead,
    onSuccess: (data) => {
      queryClient.setQueryData<{ notifications: Notification[] }>(['notifications'], (old) => {
        if (!old) return old;

        return {
          ...old,
          notifications: old.notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      if (data.isSuccess) {
        options?.onSuccess?.();

        toast({
          variant: 'success',
          title: t('MARKED_ALL_AS_READ'),
          description: t('ALL_NOTIFICATION_UPDATED_SUCCESSFULLY'),
        });
      }
    },
  });
};
