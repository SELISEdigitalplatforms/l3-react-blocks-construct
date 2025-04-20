import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardUserActivityGraph } from './dashboard-user-activity-graph';

jest.mock('components/ui/chart', () => ({
  ...jest.requireActual('components/ui/chart'),
  ChartTooltipContent: () => <div data-testid="tooltip-content" />,
}));

interface MockComponentProps {
  children?: React.ReactNode;
  onMouseOver?: () => void;
}

jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: MockComponentProps) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: MockComponentProps) => <div data-testid="bar-chart">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Bar: ({ onMouseOver, children }: MockComponentProps) => (
    <div data-testid="bar" onMouseOver={onMouseOver}>
      {children}
    </div>
  ),
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

  it('displays tooltip content when bar is hovered', async () => {
    render(<DashboardUserActivityGraph />);
    const barElement = screen.getByTestId('bar');
    fireEvent.mouseOver(barElement);

    await waitFor(() => {
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });
  });
});
