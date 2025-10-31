import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartTooltipWrapper, DashboardUserPlatformTooltip } from './chart-tooltip-wrapper';
import { vi } from 'vitest';
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DashboardUserPlatformTooltip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders tooltip with device and user data', () => {
    const mockData = {
      devices: 'desktop',
      users: 1250,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    // Check if device label is rendered with translation
    expect(screen.getByText('DESKTOP:')).toBeInTheDocument();

    // Check if formatted user count and translation are rendered
    expect(screen.getByText('1,250 USERS')).toBeInTheDocument();
  });

  test('renders tooltip with mobile device data', () => {
    const mockData = {
      devices: 'mobile',
      users: 850,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    expect(screen.getByText('MOBILE:')).toBeInTheDocument();
    expect(screen.getByText('850 USERS')).toBeInTheDocument();
  });

  test('renders tooltip with tablet device data', () => {
    const mockData = {
      devices: 'tablet',
      users: 320,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    expect(screen.getByText('TABLET:')).toBeInTheDocument();
    expect(screen.getByText('320 USERS')).toBeInTheDocument();
  });

  test('renders tooltip with zero users', () => {
    const mockData = {
      devices: 'desktop',
      users: 0,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    expect(screen.getByText('DESKTOP:')).toBeInTheDocument();
    expect(screen.getByText('0 USERS')).toBeInTheDocument();
  });

  test('renders tooltip with large user numbers formatted with locale', () => {
    const mockData = {
      devices: 'mobile',
      users: 15000,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    expect(screen.getByText('MOBILE:')).toBeInTheDocument();
    expect(screen.getByText('15,000 USERS')).toBeInTheDocument();
  });

  test('applies correct CSS classes for styling', () => {
    const mockData = {
      devices: 'desktop',
      users: 500,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    // Check container classes
    const container = screen.getByText('DESKTOP:').parentElement;
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'gap-1',
      'bg-white',
      'p-2',
      'shadow-md',
      'rounded-[4px]'
    );

    // Check device label classes
    const deviceElement = screen.getByText('DESKTOP:');
    expect(deviceElement).toHaveClass('text-sm', 'text-high-emphasis');

    // Check user count classes
    const userElement = screen.getByText('500 USERS');
    expect(userElement).toHaveClass('text-sm', 'font-semibold', 'text-medium-emphasis');
  });

  test('converts device name to uppercase for translation', () => {
    const mockData = {
      devices: 'desktop',
      users: 100,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    // Since we mock t to return the key, it should show the uppercase version
    expect(screen.getByText('DESKTOP:')).toBeInTheDocument();
  });

  test('uses translation function for USERS text', () => {
    const mockData = {
      devices: 'mobile',
      users: 75,
    };

    render(<DashboardUserPlatformTooltip data={mockData} />);

    // Since we mock t to return the key, it should show 'USERS'
    expect(screen.getByText('75 USERS')).toBeInTheDocument();
  });
});

describe('ChartTooltipWrapper Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockTooltipProps = (payloadData?: any): TooltipProps<ValueType, NameType> => ({
    payload: payloadData ? [{ payload: payloadData }] : undefined,
    label: '',
    active: true,
  });

  test('renders DashboardUserPlatformTooltip when payload has valid data', () => {
    const mockPayloadData = {
      devices: 'desktop',
      users: 1000,
    };

    const mockProps = createMockTooltipProps(mockPayloadData);

    render(<ChartTooltipWrapper {...mockProps} />);

    expect(screen.getByText('DESKTOP:')).toBeInTheDocument();
    expect(screen.getByText('1,000 USERS')).toBeInTheDocument();
  });

  test('renders DashboardUserPlatformTooltip with mobile data', () => {
    const mockPayloadData = {
      devices: 'mobile',
      users: 750,
    };

    const mockProps = createMockTooltipProps(mockPayloadData);

    render(<ChartTooltipWrapper {...mockProps} />);

    expect(screen.getByText('MOBILE:')).toBeInTheDocument();
    expect(screen.getByText('750 USERS')).toBeInTheDocument();
  });

  test('returns null when payload is undefined', () => {
    const mockProps = createMockTooltipProps();

    const { container } = render(<ChartTooltipWrapper {...mockProps} />);

    expect(container.firstChild).toBeNull();
  });

  test('returns null when payload is empty array', () => {
    const mockProps: TooltipProps<ValueType, NameType> = {
      payload: [],
      label: '',
      active: true,
    };

    const { container } = render(<ChartTooltipWrapper {...mockProps} />);

    expect(container.firstChild).toBeNull();
  });

  test('returns null when payload first item has no payload data', () => {
    const mockProps: TooltipProps<ValueType, NameType> = {
      payload: [{ payload: null }],
      label: '',
      active: true,
    };

    const { container } = render(<ChartTooltipWrapper {...mockProps} />);

    expect(container.firstChild).toBeNull();
  });

  test('handles different device types correctly', () => {
    const deviceTypes = [
      { devices: 'desktop', users: 1200 },
      { devices: 'mobile', users: 800 },
      { devices: 'tablet', users: 400 },
    ];

    deviceTypes.forEach(({ devices, users }) => {
      const mockProps = createMockTooltipProps({ devices, users });
      const { unmount } = render(<ChartTooltipWrapper {...mockProps} />);

      expect(screen.getByText(`${devices.toUpperCase()}:`)).toBeInTheDocument();
      expect(screen.getByText(`${users.toLocaleString()} USERS`)).toBeInTheDocument();

      unmount();
    });
  });

  test('extracts data from nested payload structure correctly', () => {
    const mockPayloadData = {
      devices: 'tablet',
      users: 300,
      // Additional properties that might exist in real payload
      fill: '#8884d8',
      dataKey: 'users',
    };

    const mockProps = createMockTooltipProps(mockPayloadData);

    render(<ChartTooltipWrapper {...mockProps} />);

    // Should extract and use only the relevant data
    expect(screen.getByText('TABLET:')).toBeInTheDocument();
    expect(screen.getByText('300 USERS')).toBeInTheDocument();
  });
});
