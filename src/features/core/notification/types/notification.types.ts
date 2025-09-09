export interface Notification {
  id: string;
  correlationId: string;
  payload: {
    userId: string;
    subscriptionFilters: {
      context: string;
      actionName: string;
      value: string;
    }[];
    notificationType: string;
    responseKey: string;
    responseValue: string;
  };
  denormalizedPayload: string;
  createdTime: string;
  readByUserIds: string[];
  readByRoles: string[];
  isRead: boolean;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  unReadNotificationsCount: number;
  totalNotificationsCount: number;
}

export interface GetNotificationsParams {
  IsUnreadOnly?: boolean;
  UnReadNotificationCount?: number;
  Page?: number;
  PageSize?: number;
  SortProperty?: string;
  SortIsDescending?: boolean;
  Filter?: string;
}

export type MarkNotificationAsReadResponse = {
  errors?: Record<string, string>;
  isSuccess: boolean;
};

export type MarkAllNotificationAsReadResponse = {
  errors?: Record<string, string>;
  isSuccess: boolean;
};
