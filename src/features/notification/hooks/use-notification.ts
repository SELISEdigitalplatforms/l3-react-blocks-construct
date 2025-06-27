import { useGlobalQuery } from 'state/query-client/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { GetNotificationsParams, Notification } from '../types/notification.types';
import {
  getNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from '../services/notification.service';

/**
 * Hook to fetch notifications with pagination and filtering
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with notifications and metadata
 */
export const useGetNotifications = (params: GetNotificationsParams) => {
  return useGlobalQuery({
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
          title: t('MARK_AS_READ'),
          description: t('MARKED_THIS_NOTIFICATION_AS_READ'),
        });
      }
    },
  });
};

/**
 * Custom hook to mark all notifications as read
 *
 * @returns {Object} The mutation object from react-query with the following properties:
 * @property {Function} mutate - Function to trigger the mark all as read action
 * @property {boolean} isPending - Indicates if the mutation is in progress
 * @property {Error | null} error - Error object if the mutation fails
 * @property {boolean} isSuccess - Indicates if the mutation was successful
 * @property {Function} reset - Function to reset the mutation state
 *
 * @example
 * const { mutate: markAllAsRead, isPending } = useMarkAllNotificationAsRead();
 *
 * // To mark all notifications as read:
 * markAllAsRead();
 */
export const useMarkAllNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: markAllNotificationAsRead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      if (data.isSuccess) {
        toast({
          title: t('MARKED_ALL_AS_READ'),
          description: t('ALL_NOTIFICATIONS_MARKED_AS_READ'),
          variant: 'success',
        });
      }
    },
  });
};
