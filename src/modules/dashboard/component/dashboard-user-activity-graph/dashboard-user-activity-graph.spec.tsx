import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardUserActivityGraph } from './dashboard-user-activity-graph';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('components/ui/chart', async () => {
  const actual = await vi.importActual('components/ui/chart');
  return {
    ...actual,
    ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ChartTooltip: ({ content }: { content: any }) => {
      const mockPayload = [{ value: 10 }];
      const mockLabel = 'Week 1';
      return content({ payload: mockPayload, label: mockLabel });
    },
  };
});

interface MockComponentProps {
  children?: React.ReactNode;
}

vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: MockComponentProps) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children }: MockComponentProps) => <div data-testid="bar-chart">{children}</div>,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Bar: ({ children }: MockComponentProps) => <div data-testid="bar">{children}</div>,
    CartesianGrid: () => <div />,
    ChartTooltip: ({ children }: MockComponentProps) => <div data-testid="tooltip">{children}</div>,
  };
});

vi.mock('../../services/dashboard-service', () => ({
  chartConfig: {},
  chartData: [{ week: 'Week 1', noOfActions: 10 }],
  daysOfWeek: [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ],
}));

// Mock ResizeObserver if it doesn't exist
if (!global.ResizeObserver) {
  global.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

describe('DashboardUserActivityGraph Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the chart with basic components', () => {
    render(<DashboardUserActivityGraph />);

    // Check for main UI elements that are actually rendered
    expect(screen.getByText('USER_ACTIVITY_TRENDS')).toBeInTheDocument();
    expect(screen.getByText('TRACK_ENGAGEMENT_PATTERN')).toBeInTheDocument();
    expect(screen.getByText('THIS_WEEK')).toBeInTheDocument();

    // Check for chart container elements
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });
});
