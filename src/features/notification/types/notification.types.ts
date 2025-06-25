export type Notification = {
  notificationId: string;
  title: string;
  description?: string;
  module: string;
  createdAt: string;
  isUnread: boolean;
};
