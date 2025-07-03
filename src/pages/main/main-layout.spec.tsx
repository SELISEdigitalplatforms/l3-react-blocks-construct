process.env.REACT_APP_API_BASE_URL = 'https://test-api.com';
process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY = 'test-key';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './main-layout';

jest.mock('components/blocks/layout/app-sidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">App Sidebar</div>,
}));

jest.mock('components/blocks/u-profile-menu', () => ({
  UProfileMenu: () => <div data-testid="profile-menu">Profile Menu</div>,
}));

jest.mock('components/blocks/language-selector/language-selector', () => ({
  __esModule: true,
  default: () => <div data-testid="language-selector">Language Selector</div>,
}));

jest.mock('components/ui/sidebar', () => ({
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Toggle Sidebar
    </button>
  ),
  useSidebar: () => ({
    open: true,
    isMobile: false,
    toggle: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'test-key',
  }),
}));

jest.mock('lucide-react', () => ({
  Bell: () => <div data-testid="bell-icon">Bell Icon</div>,
  Library: () => <div data-testid="library-icon">Library Icon</div>,
}));

jest.mock('components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('components/ui/menubar', () => ({
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

jest.mock('features/notification/component/notification/notification', () => ({
  Notification: () => <div data-testid="notification">Notification</div>,
}));

jest.mock('features/notification/hooks/use-notification', () => ({
  useGetNotifications: jest.fn().mockReturnValue({
    data: {
      notifications: [],
      unReadNotificationsCount: 0,
      totalNotificationsCount: 0,
    },
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MainLayout', () => {
  it('renders the component correctly', () => {
    renderWithRouter(<MainLayout />);
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders all navigation and utility elements', () => {
    renderWithRouter(<MainLayout />);
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    expect(screen.getByTestId('library-icon')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
    expect(screen.getByTestId('notification')).toBeInTheDocument();
  });
});
