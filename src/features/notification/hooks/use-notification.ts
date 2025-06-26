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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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
      // Invalidate and refetch notifications to update the UI
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Optimistically update the notification in the cache
      queryClient.setQueryData<{ notifications: Notification[] }>(['notifications'], (old) => {
        if (!old) return old;

        return {
          ...old,
          notifications: old.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          ),
        };
      });

      // Show success toast
      if (data.isSuccess) {
        toast({
          title: t('Success'),
          description: t('Notification marked as read'),
          variant: 'default',
        });
      }
    },
    onError: (error: Error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: t('Error'),
        description: t('Failed to mark notification as read'),
        variant: 'destructive',
      });
    },
  });
};

export const useMarkAllNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: markAllNotificationAsRead,
    onSuccess: (data) => {
      // Invalidate and refetch notifications to update the UI
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Show success toast
      if (data.isSuccess) {
        toast({
          title: t('Success'),
          description: t('All notifications marked as read'),
          variant: 'default',
        });
      }
    },
    onError: (error: Error) => {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: t('Error'),
        description: t('Failed to mark all notifications as read'),
        variant: 'destructive',
      });
    },
  });
};
