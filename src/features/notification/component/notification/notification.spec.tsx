import React from 'react';
import { screen } from '@testing-library/react';
import { Notification } from './notification';
import { vi } from 'vitest';
import { renderWithProviders } from '@/test-utils/test-providers';

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock hooks
vi.mock('../../hooks/use-notification', () => ({
  useGetNotifications: vi.fn().mockReturnValue({
    data: { notifications: [] },
    isFetching: false,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useMarkAllNotificationAsRead: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Mock notification item and skeleton
vi.mock('../notification-item/notification-item', () => ({
  NotificationItem: ({ notification }: any) => (
    <div data-testid="notification-item">{notification?.id}</div>
  ),
}));
vi.mock('../notification-skeleton/notification-skeleton', () => ({
  NotificationSkeletonList: () => <div data-testid="notification-skeleton" />,
}));

// Mock MenubarContent, Tabs, TabsList, TabsTrigger, TabsContent, Button
vi.mock('components/ui/menubar', () => ({
  MenubarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock store and config
vi.mock('state/store/auth', () => ({
  useAuthStore: () => 'test-token',
}));
vi.mock('config/api', () => ({
  default: {
    baseUrl: 'https://test-api.com',
    blocksKey: 'test-key',
  },
}));

// Mock subscribeNotifications
vi.mock('@seliseblocks/notifications', () => ({
  subscribeNotifications: vi.fn(() => ({
    stop: vi.fn(),
  })),
}));

describe.skip('Notification', () => {
  it('renders notifications UI', () => {
    renderWithProviders(<Notification />);
    expect(screen.getByText('NOTIFICATIONS')).toBeInTheDocument();
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('UNREAD')).toBeInTheDocument();
    expect(screen.getByText('MARK_ALL_AS_READ')).toBeInTheDocument();
  });

  it('shows no notifications message', () => {
    renderWithProviders(<Notification />);
    expect(screen.getByText('NO_NOTIFICATIONS')).toBeInTheDocument();
  });
});
