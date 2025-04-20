import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './dashboard';

jest.mock('components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="button">{children}</button>
  ),
}));

jest.mock('features/dashboard', () => ({
  DashboardOverview: () => <div data-testid="dashboard-overview" />,
  DashboardSystemOverview: () => <div data-testid="dashboard-system-overview" />,
  DashboardUserActivityGraph: () => <div data-testid="dashboard-user-activity-graph" />,
  DashboardUserPlatform: () => <div data-testid="dashboard-user-platform" />,
}));

jest.mock('features/profile/hooks/use-account', () => ({
  useGetAccount: jest.fn(() => ({
    data: { mfaEnabled: false },
    isLoading: false,
    isFetching: false,
  })),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <Dashboard />
        </QueryClientProvider>
      </MemoryRouter>
    );
  });

  test('renders the dashboard title', async () => {
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  test('renders the Sync and Export buttons', async () => {
    await waitFor(() => {
      expect(screen.getByText('Sync')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
    });
  });

  test('renders all child components', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-user-platform')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-user-activity-graph')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-system-overview')).toBeInTheDocument();
    });
  });
});
