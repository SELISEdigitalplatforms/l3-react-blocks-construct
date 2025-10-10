import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Profile } from './profile';
import { GeneralInfo, DevicesTable } from '@/features/profile';
import '../../test-utils/shared-test-utils';

vi.mock('@/features/profile', () => ({
  GeneralInfo: vi.fn(() => <div data-testid="general-info">General Info Content</div>),
  DevicesTable: vi.fn(() => <div data-testid="devices-table">Devices Table Content</div>),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders profile header', () => {
    renderWithProviders(<Profile />);
    expect(screen.getByText('MY_PROFILE')).toBeInTheDocument();
  });

  test('renders tabs', () => {
    renderWithProviders(<Profile />);
    expect(screen.getByText('GENERAL_INFO')).toBeInTheDocument();
    expect(screen.getByText('DEVICES')).toBeInTheDocument();
  });

  test('shows GeneralInfo tab by default', () => {
    renderWithProviders(<Profile />);
    expect(GeneralInfo).toHaveBeenCalled();
    expect(DevicesTable).not.toHaveBeenCalled();
    expect(screen.getByTestId('general-info')).toBeInTheDocument();
    expect(screen.queryByTestId('devices-table')).not.toBeInTheDocument();
  });

  test('switches to Devices tab when clicked', () => {
    renderWithProviders(<Profile />);
    const devicesTab = screen.getByText('DEVICES');

    fireEvent.click(devicesTab);

    expect(DevicesTable).toHaveBeenCalled();
    expect(screen.getByTestId('devices-table')).toBeInTheDocument();
    expect(screen.queryByTestId('general-info')).not.toBeInTheDocument();
  });

  test('switches back to GeneralInfo tab when clicked', () => {
    renderWithProviders(<Profile />);

    const devicesTab = screen.getByText('DEVICES');
    fireEvent.click(devicesTab);

    const generalInfoTab = screen.getByText('GENERAL_INFO');
    fireEvent.click(generalInfoTab);

    expect(screen.getByTestId('general-info')).toBeInTheDocument();
    expect(screen.queryByTestId('devices-table')).not.toBeInTheDocument();
  });
});
