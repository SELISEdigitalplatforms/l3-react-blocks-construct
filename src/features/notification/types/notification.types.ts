//Remove this one after API implementation of getNOtifications
export type Notification = {
  notificationId: string;
  title: string;
  description?: string;
  module: string;
  createdAt: string;
  isUnread: boolean;
};

export interface Notification1 {
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
  createdTime: string; // ISO date string
  readByUserIds: string[];
  readByRoles: string[];
  isRead: boolean;
}

export interface GetNotificationsResponse {
  notifications: Notification1[];
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
