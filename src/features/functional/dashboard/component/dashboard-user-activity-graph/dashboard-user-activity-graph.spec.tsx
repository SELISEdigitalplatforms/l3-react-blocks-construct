import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardUserActivityGraph } from './dashboard-user-activity-graph';

jest.mock('components/ui/chart', () => ({
  ...jest.requireActual('components/ui/chart'),
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: ({ content }: { content: any }) => {
    const mockPayload = [{ value: 10 }];
    const mockLabel = 'Week 1';
    return content({ payload: mockPayload, label: mockLabel });
  },
}));

interface MockComponentProps {
  children?: React.ReactNode;
}

jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: MockComponentProps) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: MockComponentProps) => <div data-testid="bar-chart">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Bar: ({ children }: MockComponentProps) => <div data-testid="bar">{children}</div>,
  CartesianGrid: () => <div />,
  ChartTooltip: ({ children }: MockComponentProps) => <div data-testid="tooltip">{children}</div>,
}));

jest.mock('../../services/dashboard-service', () => ({
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

// Setup ResizeObserver mock
const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

declare global {
  interface Window {
    ResizeObserver: jest.Mock;
  }
}

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver as any;
});

afterAll(() => {
  delete (window as any).ResizeObserver;
});

describe('DashboardUserActivityGraph Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the chart with tooltip content', () => {
    render(<DashboardUserActivityGraph />);
    expect(screen.getByText('Week 1:')).toBeInTheDocument();
    expect(screen.getByText(/10 ACTION/)).toBeInTheDocument();
  });
});
