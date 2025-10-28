import { clients } from '@/lib/https';
import {
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkAllNotificationAsReadResponse,
  MarkNotificationAsReadResponse,
} from '../types/notification.types';

/**
 * Fetches paginated notifications with optional filters
 * @param context - React Query context with queryKey array
 * @param context.queryKey.1 - Filtering and pagination params
 * @returns Promise with notifications array and total count
 * @example
 * // Basic usage
 * useQuery({
 *   queryKey: ['notifications', { Page: 1, PageSize: 10 }],
 *   queryFn: getNotifications
 * });
 */

export const getNotifications = async (context: {
  queryKey: [string, GetNotificationsParams];
}): Promise<GetNotificationsResponse> => {
  const [, params] = context.queryKey;
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const url = `/notification/v1/Notifier/GetNotifications?${searchParams.toString()}`;
  const res = await clients.get<GetNotificationsResponse>(url);
  return res;
};

export const markNotificationAsRead = async (
  id: string
): Promise<MarkNotificationAsReadResponse> => {
  const requestPayload = {
    id,
  };
  const res = await clients.post<MarkNotificationAsReadResponse>(
    '/notification/v1/Notifier/MarkNotificationAsRead',
    JSON.stringify(requestPayload)
  );
  return res;
};

export const markAllNotificationAsRead = async (): Promise<MarkAllNotificationAsReadResponse> => {
  const res = await clients.post<MarkAllNotificationAsReadResponse>(
    '/notification/v1/Notifier/MarkAllNotificationAsRead',
    JSON.stringify({})
  );
  return res;
};
