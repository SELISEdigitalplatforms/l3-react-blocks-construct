// Set environment variables
process.env.VITE_PUBLIC_X_BLOCKS_KEY = 'test-key';
process.env.VITE_PUBLIC_BLOCKS_API_URL = 'https://test-api.com';
process.env.VITE_PUBLIC_API_URL = 'https://test-api.com';

// Mock window.location
const originalWindow = window as any;
Object.defineProperty(window, 'location', {
  value: {
    ...originalWindow.location,
    hostname: 'localhost',
    protocol: 'http:',
    host: 'localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './main-layout';

vi.mock('components/blocks/layout/app-sidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">App Sidebar</div>,
}));

vi.mock('components/blocks/u-profile-menu', () => ({
  UProfileMenu: () => <div data-testid="profile-menu">Profile Menu</div>,
}));

vi.mock('components/blocks/language-selector/language-selector', () => ({
  __esModule: true,
  default: () => <div data-testid="language-selector">Language Selector</div>,
}));

vi.mock('components/ui/sidebar', () => ({
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Toggle Sidebar
    </button>
  ),
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  useSidebar: () => ({
    open: true,
    isMobile: false,
    toggle: vi.fn(),
  }),
}));

vi.mock('providers/permission-provider', () => ({
  PermissionsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="permissions-provider">{children}</div>
  ),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
    useLocation: vi.fn().mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'test-key',
    }),
  };
});

vi.mock('lucide-react', () => ({
  Bell: () => <div data-testid="bell-icon">Bell Icon</div>,
  Library: () => <div data-testid="library-icon">Library Icon</div>,
}));

vi.mock('components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('components/ui/menubar', () => ({
  Menubar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="menubar">{children}</div>
  ),
  MenubarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="menubar-menu">{children}</div>
  ),
  MenubarTrigger: ({
    children,
    className,
    asChild,
  }: {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
  }) => (
    <div data-testid="menubar-trigger" className={className}>
      {asChild ? children : <button>{children}</button>}
    </div>
  ),
  MenubarContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="menubar-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('features/notification/component/notification/notification', () => ({
  Notification: () => <div data-testid="notification">Notification</div>,
}));

vi.mock('features/notification/hooks/use-notification', () => ({
  useGetNotifications: vi.fn().mockReturnValue({
    data: {
      notifications: [],
      unReadNotificationsCount: 0,
      totalNotificationsCount: 0,
    },
  }),
}));

vi.mock('features/profile/hooks/use-account', () => ({
  useGetAccount: vi.fn().mockReturnValue({
    data: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    },
    isLoading: false,
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  // Use the mocked SidebarProvider from the vi.mock above
  const MockedSidebarProvider = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  );

  return render(
    <BrowserRouter>
      <MockedSidebarProvider>{component}</MockedSidebarProvider>
    </BrowserRouter>
  );
};

describe('MainLayout', () => {
  it('renders the component correctly', () => {
    renderWithProviders(<MainLayout />);
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders all navigation and utility elements', () => {
    renderWithProviders(<MainLayout />);
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    // expect(screen.getByTestId('library-icon')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
    expect(screen.getByTestId('notification')).toBeInTheDocument();
  });
});
