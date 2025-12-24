/**
 * IMPORTANT: All environment setup must happen BEFORE any imports
 * that depend on these variables or window.location
 */

// 1. Set up environment variables first
process.env.VITE_API_BASE_URL = 'http://localhost:3000';
process.env.VITE_X_BLOCKS_KEY = 'test-key';

// 2. Mock window.location before any imports
delete (global as any).window.location;
(global as any).window.location = {
  hostname: 'localhost',
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  port: '3000',
  protocol: 'http:',
  host: 'localhost:3000',
};

// 3. Mock the API config module directly (try different path formats)
vi.mock('../../../config/api', () => ({
  __esModule: true,
  default: {
    baseUrl: 'http://localhost:3000',
    blocksKey: 'test-key',
    auth: {
      token: '/idp/v1/Authentication/Token',
    },
  },
  getApiUrl: (path: string) => {
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `http://localhost:3000${cleanPath}`;
  },
  isLocalhost: () => true,
}));

// 4. Now safe to import React Testing Library and other modules
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 5. Mock other components
// Mock components/ui/button module
vi.mock('@/components/ui-kit/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Mock modules/dashboard module - using correct import path with @/ alias
vi.mock('@/modules/dashboard', () => ({
  DashboardHeader: () => (
    <div data-testid="dashboard-header">
      <h3>DASHBOARD</h3>
      <button>SYNC</button>
      <button>EXPORT</button>
    </div>
  ),
  DashboardOverview: () => <div data-testid="dashboard-overview">Dashboard Overview</div>,
  DashboardSystemOverview: () => (
    <div data-testid="dashboard-system-overview">Dashboard System Overview</div>
  ),
  DashboardUserActivityGraph: () => (
    <div data-testid="dashboard-user-activity-graph">Dashboard User Activity Graph</div>
  ),
  DashboardUserPlatform: () => (
    <div data-testid="dashboard-user-platform">Dashboard User Platform</div>
  ),
}));

// Mock features/profile/hooks/use-account
vi.mock('@/modules/profile/hooks/use-account', () => ({
  useGetAccount: vi.fn(() => ({
    isLoading: false,
    data: {},
    error: null,
  })),
}));

import { DashboardPage } from './dashboard';

describe('Dashboard Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderDashboard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  test('renders the dashboard title', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
    });
  });

  test('renders the Sync and Export buttons', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('SYNC')).toBeInTheDocument();
      expect(screen.getByText('EXPORT')).toBeInTheDocument();
    });
  });

  test('renders all child components', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-user-platform')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-user-activity-graph')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-system-overview')).toBeInTheDocument();
    });
  });
});
