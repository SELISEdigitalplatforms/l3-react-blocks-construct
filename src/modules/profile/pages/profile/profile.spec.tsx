import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../../../test-utils/shared-test-utils';

// Mock the actual modules used by Profile component
vi.mock('../../components/general-info/general-info', () => ({
  GeneralInfo: vi.fn(() => <div data-testid="general-info">General Info Content</div>),
}));

vi.mock('../../components/devices/devices', () => ({
  Devices: vi.fn(() => <div data-testid="devices-table">Devices Table Content</div>),
}));

import { ProfilePage } from './profile';
import { GeneralInfo } from '../../components/general-info/general-info';
import { Devices } from '../../components/devices/devices';

// Get the mocked functions using vi.mocked
const GeneralInfoMock = vi.mocked(GeneralInfo);
const DevicesMock = vi.mocked(Devices);

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
    renderWithProviders(<ProfilePage />);
    expect(screen.getByText('MY_PROFILE')).toBeInTheDocument();
  });

  test('renders tabs', () => {
    renderWithProviders(<ProfilePage />);
    expect(screen.getByText('GENERAL_INFO')).toBeInTheDocument();
    expect(screen.getByText('DEVICES')).toBeInTheDocument();
  });

  test('shows GeneralInfo tab by default', () => {
    renderWithProviders(<ProfilePage />);
    expect(GeneralInfoMock).toHaveBeenCalled();
    expect(DevicesMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('general-info')).toBeInTheDocument();
    expect(screen.queryByTestId('devices-table')).not.toBeInTheDocument();
  });

  test('switches to Devices tab when clicked', () => {
    renderWithProviders(<ProfilePage />);
    const devicesTab = screen.getByText('DEVICES');

    fireEvent.click(devicesTab);

    expect(DevicesMock).toHaveBeenCalled();
    expect(screen.getByTestId('devices-table')).toBeInTheDocument();
    expect(screen.queryByTestId('general-info')).not.toBeInTheDocument();
  });

  test('switches back to GeneralInfo tab when clicked', () => {
    renderWithProviders(<ProfilePage />);

    const devicesTab = screen.getByText('DEVICES');
    fireEvent.click(devicesTab);

    const generalInfoTab = screen.getByText('GENERAL_INFO');
    fireEvent.click(generalInfoTab);

    expect(screen.getByTestId('general-info')).toBeInTheDocument();
    expect(screen.queryByTestId('devices-table')).not.toBeInTheDocument();
  });
});
