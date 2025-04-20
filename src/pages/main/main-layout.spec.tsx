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
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle Sidebar</button>,
  useSidebar: () => ({
    open: true,
    isMobile: false,
    toggle: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
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
  });
});
