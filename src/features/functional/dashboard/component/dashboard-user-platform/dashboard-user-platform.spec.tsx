import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardUserPlatform } from './dashboard-user-platform';

jest.mock('components/ui/chart', () => ({
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

// Valid PieChart mock with proper data handling
jest.mock('recharts', () => ({
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
}));

jest.mock('components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="card-title">{children}</h2>
  ),
  CardDescription: () => <p data-testid="card-description">Description</p>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

jest.mock('components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select">{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-group">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`select-item-${value}`} data-value={value}>
      {children}
    </div>
  ),
}));

describe('DashboardUserPlatform', () => {
  it('renders the component structure correctly', () => {
    render(<DashboardUserPlatform />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('USER_BY_PLATFORM');
    expect(screen.getByTestId('card-description')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('select-value')).toHaveTextContent('THIS_MONTH');
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

    const mockMonths = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    mockMonths.forEach((month) => {
      expect(screen.getByTestId(`select-item-${month}`)).toHaveTextContent(
        month.toUpperCase()
      );
    });
  });

  it('renders all chart elements correctly', async () => {
    render(<DashboardUserPlatform />);

    await waitFor(() => {
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
      expect(screen.getByTestId('chart-legend-content')).toBeInTheDocument();
      expect(screen.getByTestId('chart-tooltip-content')).toBeInTheDocument();
    });
  });

  it('renders label inside the pie chart', () => {
    render(<DashboardUserPlatform />);
    expect(screen.getByTestId('label')).toBeInTheDocument();
  });
});
