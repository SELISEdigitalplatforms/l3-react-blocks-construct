/**
 * IMPORTANT: All environment setup must happen BEFORE any imports
 * that depend on these variables or window.location
 */

// 1. Set up environment variables first
process.env.REACT_APP_PUBLIC_BLOCKS_API_URL = 'http://localhost:3000';
process.env.REACT_APP_PUBLIC_API_URL = 'http://localhost:3000';
process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY = 'test-key';

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
jest.mock('../../../config/api', () => ({
  __esModule: true,
  default: {
    baseUrl: 'http://localhost:3000',
    blocksKey: 'test-key',
    auth: {
      token: '/authentication/v1/OAuth/Token',
    },
  },
  getApiUrl: (path: string) => {
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `http://localhost:3000${cleanPath}`;
  },
  isLocalhost: () => true,
}));

// 4. Now safe to import React Testing Library and other modules
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './dashboard';

// 5. Mock other components
jest.mock('components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock('features/dashboard', () => ({
  DashboardOverview: () => <div data-testid="dashboard-overview">Dashboard Overview</div>,
  DashboardSystemOverview: () => <div data-testid="dashboard-system-overview">System Overview</div>,
  DashboardUserActivityGraph: () => (
    <div data-testid="dashboard-user-activity-graph">Activity Graph</div>
  ),
  DashboardUserPlatform: () => <div data-testid="dashboard-user-platform">User Platform</div>,
}));

jest.mock('features/profile/hooks/use-account', () => ({
  useGetAccount: jest.fn(() => ({
    data: { mfaEnabled: false },
    isLoading: false,
  })),
}));

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
          <Dashboard />
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
