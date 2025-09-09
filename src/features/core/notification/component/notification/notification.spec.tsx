import React from 'react';
import { render, screen } from '@testing-library/react';
import { Notification } from './notification';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock hooks
jest.mock('../../hooks/use-notification', () => ({
  useGetNotifications: jest.fn().mockReturnValue({
    data: { notifications: [] },
    isFetching: false,
    isLoading: false,
    refetch: jest.fn(),
  }),
  useMarkAllNotificationAsRead: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// Mock notification item and skeleton
jest.mock('../notification-item/notification-item', () => ({
  NotificationItem: ({ notification }: any) => (
    <div data-testid="notification-item">{notification?.id}</div>
  ),
}));
jest.mock('../notification-skeleton/notification-skeleton', () => ({
  NotificationSkeletonList: () => <div data-testid="notification-skeleton" />,
}));

// Mock MenubarContent, Tabs, TabsList, TabsTrigger, TabsContent, Button
jest.mock('components/ui/menubar', () => ({
  MenubarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock store and config
jest.mock('state/store/auth', () => ({
  useAuthStore: () => 'test-token',
}));
jest.mock('config/api', () => ({
  default: {
    baseUrl: 'https://test-api.com',
    blocksKey: 'test-key',
  },
}));

// Mock subscribeNotifications
jest.mock('@seliseblocks/notifications', () => ({
  subscribeNotifications: jest.fn(() => ({
    stop: jest.fn(),
  })),
}));

describe('Notification', () => {
  it('renders notifications UI', () => {
    render(<Notification />);
    expect(screen.getByText('NOTIFICATIONS')).toBeInTheDocument();
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('UNREAD')).toBeInTheDocument();
    expect(screen.getByText('MARK_ALL_AS_READ')).toBeInTheDocument();
  });

  it('shows no notifications message', () => {
    render(<Notification />);
    expect(screen.getByText('NO_NOTIFICATIONS')).toBeInTheDocument();
  });
});
