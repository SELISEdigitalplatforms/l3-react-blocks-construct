import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardUserActivityGraph } from './dashboard-user-activity-graph';
import { vi, describe, test, beforeEach, expect } from 'vitest';

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

  test('renders the chart with tooltip content', () => {
    render(<DashboardUserActivityGraph />);
    expect(screen.getByText('Week 1:')).toBeInTheDocument();
    expect(screen.getByText(/10 ACTION/)).toBeInTheDocument();
  });
});
