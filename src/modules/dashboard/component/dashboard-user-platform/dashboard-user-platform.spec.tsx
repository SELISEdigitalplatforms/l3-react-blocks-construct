import { render, screen } from '@testing-library/react';
import { DashboardUserPlatform } from './dashboard-user-platform';
import { vi } from 'vitest';
import '../../../../lib/utils/test-utils/shared-test-utils';

vi.mock('@/components/ui-kit/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  ChartTooltip: ({ content }: { content: any }) => (
    <div data-testid="chart-tooltip">
      {content({ payload: [{ payload: { devices: 'windows', users: 200 } }] }) && (
        <div data-testid="chart-tooltip-content">
          <p>WINDOWS:</p>
          <p>200 USERS</p>
        </div>
      )}
    </div>
  ),
  ChartLegend: ({ content }: { content: React.ReactNode }) => (
    <div data-testid="chart-legend">
      {content || <div data-testid="chart-legend-content">Legend Content</div>}
    </div>
  ),
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content">Tooltip Content</div>,
  ChartLegendContent: () => <div data-testid="chart-legend-content">Legend Content</div>,
}));

vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data, dataKey, nameKey, innerRadius, strokeWidth, children }: any) => (
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

const expectElementsToExist = (testIds: string[]) => {
  testIds.forEach((testId) => expect(screen.getByTestId(testId)).toBeInTheDocument());
};

const expectPieChartAttributes = (element: HTMLElement, attributes: Record<string, string>) => {
  Object.entries(attributes).forEach(([key, value]) => {
    expect(element).toHaveAttribute(key, value);
  });
};

describe('DashboardUserPlatform', () => {
  beforeEach(() => {
    render(<DashboardUserPlatform />);
  });

  it('renders component with title and month selector', () => {
    expect(screen.getByText('USER_BY_PLATFORM')).toBeInTheDocument();
    expect(screen.getByText('THIS_MONTH')).toBeInTheDocument();
  });

  it('renders pie chart with correct configuration', () => {
    const pieElement = screen.getByTestId('pie');
    expectPieChartAttributes(pieElement, {
      'data-data-key': 'users',
      'data-name-key': 'devices',
      'data-inner-radius': '60',
      'data-stroke-width': '5',
    });
  });

  it('renders all chart elements', () => {
    expectElementsToExist([
      'chart-container',
      'pie-chart',
      'pie',
      'chart-legend',
      'chart-tooltip',
      'label',
    ]);
  });
});
