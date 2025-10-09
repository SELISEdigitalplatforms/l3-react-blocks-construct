import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceProfitOverviewGraph } from './finance-profit-overview-graph';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children, className }: any) => (
    <button data-testid="select-trigger" className={className}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectGroup: ({ children }: any) => <div data-testid="select-group">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

// Mock Recharts
vi.mock('recharts', () => ({
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Area: ({ dataKey }: any) => <div data-testid="area" data-key={dataKey} />,
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

// Mock finance services
vi.mock('../../services/finance-services', () => ({
  CHART_CONFIG: {
    minHeight: 400,
    margins: { top: 10, right: 10, left: 10, bottom: 10 },
    colors: {
      grid: 'hsl(var(--neutral-100))',
      axis: 'hsl(var(--medium-emphasis))',
    },
    yAxisDomain: [0, 100000],
    yAxisTicks: [0, 20000, 40000, 60000, 80000, 100000],
  },
  chartData: [
    { month: 'Jan', profit: 42000 },
    { month: 'Feb', profit: 48000 },
    { month: 'Mar', profit: 55000 },
  ],
  timePeriods: [
    { value: 'this-year', label: 'THIS_YEAR' },
    { value: 'last-year', label: 'LAST_YEAR' },
    { value: 'last-6-months', label: 'LAST_SIX_MONTHS' },
  ],
}));

// Mock utility functions
vi.mock('../../utils/finance-profit-graph', () => ({
  createYAxisLabel: (text: string) => ({ value: text }),
  formatTooltipValue: (value: number) => `CHF ${value.toLocaleString()}`,
  formatYAxisValue: (value: number) => `${value / 1000}k`,
}));

describe('FinanceProfitOverviewGraph Component', () => {
  it('should render without crashing', () => {
    render(<FinanceProfitOverviewGraph />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('should render the card with correct structure', () => {
    render(<FinanceProfitOverviewGraph />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');

    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should render the title and time period selector', () => {
    render(<FinanceProfitOverviewGraph />);

    const title = screen.getByTestId('card-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'text-high-emphasis');
    expect(title).toHaveTextContent('PROFIT_OVERVIEW');

    const description = screen.getByTestId('card-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('MONITOR_YOUR_PROFIT_TRENDS');

    const selectTrigger = screen.getByTestId('select-trigger');
    expect(selectTrigger).toBeInTheDocument();
    expect(selectTrigger).toHaveClass('w-[105px]', 'h-[28px]', 'px-2', 'py-1');
  });

  it('should render chart components correctly', () => {
    render(<FinanceProfitOverviewGraph />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });

  it('should render time period selector with correct options', () => {
    render(<FinanceProfitOverviewGraph />);

    const selectItems = screen.getAllByTestId('select-item');
    expect(selectItems).toHaveLength(3); // 3 time periods

    // Check time period values
    expect(selectItems[0]).toHaveAttribute('data-value', 'this-year');
    expect(selectItems[1]).toHaveAttribute('data-value', 'last-year');
    expect(selectItems[2]).toHaveAttribute('data-value', 'last-6-months');

    // Check time period labels (using getAllByText since some appear in both select value and items)
    expect(screen.getAllByText('THIS_YEAR')).toHaveLength(2); // Select value + select item
    expect(screen.getByText('LAST_YEAR')).toBeInTheDocument();
    expect(screen.getByText('LAST_SIX_MONTHS')).toBeInTheDocument();
  });

  it('should have correct chart data key', () => {
    render(<FinanceProfitOverviewGraph />);

    const area = screen.getByTestId('area');
    expect(area).toHaveAttribute('data-key', 'profit');

    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('data-key', 'month');
  });

  it('should export component correctly', () => {
    expect(FinanceProfitOverviewGraph).toBeDefined();
    expect(typeof FinanceProfitOverviewGraph).toBe('function');
  });
});
