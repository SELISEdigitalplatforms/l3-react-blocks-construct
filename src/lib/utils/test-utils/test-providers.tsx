import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

// Create a test QueryClient with no retries and no error logging
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface TestProvidersProps {
  children: React.ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

// Test wrapper with all necessary providers
export const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  initialEntries = ['/'],
  queryClient = createTestQueryClient(),
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

export const renderWithProviders = (ui: React.ReactElement, options: CustomRenderOptions = {}) => {
  const { initialEntries, queryClient, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders initialEntries={initialEntries} queryClient={queryClient}>
      {children}
    </TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Router-only wrapper for components that only need routing
export const RouterWrapper: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({
  children,
  initialEntries = ['/'],
}) => {
  return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
};

// QueryClient-only wrapper for components that only need query client
export const QueryWrapper: React.FC<{ children: React.ReactNode; queryClient?: QueryClient }> = ({
  children,
  queryClient = createTestQueryClient(),
}) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { createTestQueryClient };
