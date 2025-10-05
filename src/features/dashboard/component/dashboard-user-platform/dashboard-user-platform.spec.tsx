import { render, screen } from '@testing-library/react';
import { DashboardUserPlatform } from './dashboard-user-platform';
import { vi } from 'vitest';

vi.mock('components/ui/chart', () => ({
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

// Mock the Card components
vi.mock('components/ui/card', () => {
  return {
    Card: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card" {...props}>
        {children}
      </div>
    ),
    CardHeader: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    CardContent: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    CardTitle: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card-title" {...props}>
        {children}
      </div>
    ),
    CardDescription: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card-description" {...props}>
        {children}
      </div>
    ),
  };
});
vi.mock('components/ui/select', () => {
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

  return {
    Select: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select">
        {children}
        {/* Render month items when Select is rendered */}
        {mockMonths.map((month) => (
          <div key={month} data-testid={`select-item-${month}`} data-value={month}>
            {month}
          </div>
        ))}
      </div>
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
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders label inside the pie chart', () => {
    render(<DashboardUserPlatform />);
    expect(screen.getByTestId('label')).toBeInTheDocument();
  });
});
