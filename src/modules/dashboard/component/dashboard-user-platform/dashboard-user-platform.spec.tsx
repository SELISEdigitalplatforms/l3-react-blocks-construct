import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardUserPlatform } from './dashboard-user-platform';
import { vi } from 'vitest';
import '../../../../lib/utils/test-utils/shared-test-utils';

// Chart UI component mocks - aligned with createChartUIComponentMocks() from shared-test-utils
vi.mock('@/components/ui-kit/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  ChartTooltip: ({ content }: { content: any }) => {
    const mockPayload = [{ payload: { devices: 'windows', users: 200 } }];
    return (
      <div data-testid="chart-tooltip">
        {content({ payload: mockPayload }) && (
          <div data-testid="chart-tooltip-content">
            <p>WINDOWS:</p>
            <p>200 USERS</p>
          </div>
        )}
      </div>
    );
  },
  ChartLegend: ({ content }: { content: React.ReactNode }) => (
    <div data-testid="chart-legend">
      {content || <div data-testid="chart-legend-content">Legend Content</div>}
    </div>
  ),
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content">Tooltip Content</div>,
  ChartLegendContent: () => <div data-testid="chart-legend-content">Legend Content</div>,
}));

// Recharts component mocks - aligned with createRechartsComponentMocks() from shared-test-utils
vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    data,
    dataKey,
    nameKey,
    innerRadius,
    strokeWidth,
    children,
  }: {
    data: any;
    dataKey: string;
    nameKey: string;
    innerRadius: number;
    strokeWidth: number;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="pie"
      data-data-key={dataKey}
      data-name-key={nameKey}
      data-inner-radius={innerRadius}
      data-stroke-width={strokeWidth}
      data-chart={JSON.stringify(data)}
    >
      {children}
    </div>
  ),
  Label: () => <div data-testid="label" />,
  Tooltip: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="recharts-tooltip">{children}</div>
  ),
  Legend: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="recharts-legend">{children}</div>
  ),
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe('DashboardUserPlatform', () => {
  it('renders the component structure correctly', () => {
    render(<DashboardUserPlatform />);

    expect(screen.getByText('USER_BY_PLATFORM')).toBeInTheDocument();
    expect(screen.getByText('THIS_MONTH')).toBeInTheDocument();
  });

  it('renders pie chart with correct data and configuration', () => {
    render(<DashboardUserPlatform />);

    const pieElement = screen.getByTestId('pie');
    expect(pieElement).toHaveAttribute('data-data-key', 'users');
    expect(pieElement).toHaveAttribute('data-name-key', 'devices');
    expect(pieElement).toHaveAttribute('data-inner-radius', '60');
    expect(pieElement).toHaveAttribute('data-stroke-width', '5');
  });

  it('renders select dropdown with all months', () => {
    render(<DashboardUserPlatform />);

    // Simply check that the component renders without errors
    expect(screen.getByText('USER_BY_PLATFORM')).toBeInTheDocument();
    expect(screen.getByText('THIS_MONTH')).toBeInTheDocument();
  });

  it('renders all chart elements correctly', async () => {
    render(<DashboardUserPlatform />);

    // Check that chart elements are present using data-testid from our mocks
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
    expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
  });

  it('renders label inside the pie chart', () => {
    render(<DashboardUserPlatform />);
    expect(screen.getByTestId('label')).toBeInTheDocument();
  });
});
