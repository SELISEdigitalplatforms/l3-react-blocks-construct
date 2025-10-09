import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceRevenueExpenseGraph } from './finance-revenue-expense-graph';

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
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Bar: ({ dataKey, name }: any) => <div data-testid="bar" data-key={dataKey} data-name={name} />,
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
}));

// Mock UI Chart components
vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: ({ content }: any) => <div data-testid="chart-tooltip">{content}</div>,
}));

// Mock tooltip component
vi.mock('../finance-revenue-expense-graph-tooltip/finance-revenue-expense-graph-tooltip', () => ({
  FinanceRevenueExpenseTooltipContent: ({ hoveredKey }: any) => (
    <div data-testid="tooltip-content" data-hovered-key={hoveredKey}>
      Tooltip Content
    </div>
  ),
}));

// Mock finance services
vi.mock('../../services/finance-services', () => ({
  chartConfig: {
    revenue: {
      label: 'REVENUE',
      color: 'hsl(var(--secondary-600))',
    },
    expenses: {
      label: 'EXPENSES',
      color: 'hsl(var(--burgundy-100))',
    },
  },
  expenseChartData: [
    { month: 'Jan', revenue: 25000, expenses: 9000 },
    { month: 'Feb', revenue: 82000, expenses: 23000 },
    { month: 'Mar', revenue: 41000, expenses: 15000 },
  ],
  timePeriods: [
    { value: 'this-year', label: 'THIS_YEAR' },
    { value: 'last-year', label: 'LAST_YEAR' },
    { value: 'last-6-months', label: 'LAST_SIX_MONTHS' },
  ],
}));

describe('FinanceRevenueExpenseGraph Component', () => {
  it('should render without crashing', () => {
    render(<FinanceRevenueExpenseGraph />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('should render the card with correct structure', () => {
    render(<FinanceRevenueExpenseGraph />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');

    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should render the title and time period selector', () => {
    render(<FinanceRevenueExpenseGraph />);

    const title = screen.getByTestId('card-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'text-high-emphasis');
    expect(title).toHaveTextContent('REVENUE_EXPENSE_TREND');

    const description = screen.getByTestId('card-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('COMPARE_TOTAL_REVENUE_EXPENSES_ACROSS');

    const selectTrigger = screen.getByTestId('select-trigger');
    expect(selectTrigger).toBeInTheDocument();
    expect(selectTrigger).toHaveClass('w-[105px]', 'h-[28px]', 'px-2', 'py-1');
  });

  it('should render chart components correctly', () => {
    render(<FinanceRevenueExpenseGraph />);

    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
  });

  it('should render both revenue and expense bars', () => {
    render(<FinanceRevenueExpenseGraph />);

    const bars = screen.getAllByTestId('bar');
    expect(bars).toHaveLength(2);

    // Check revenue bar
    expect(bars[0]).toHaveAttribute('data-key', 'revenue');
    expect(bars[0]).toHaveAttribute('data-name', 'REVENUE');

    // Check expenses bar
    expect(bars[1]).toHaveAttribute('data-key', 'expenses');
    expect(bars[1]).toHaveAttribute('data-name', 'EXPENSES');
  });

  it('should render time period selector with correct options', () => {
    render(<FinanceRevenueExpenseGraph />);

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

  it('should render legend with revenue and expense labels', () => {
    render(<FinanceRevenueExpenseGraph />);

    expect(screen.getByText('REVENUE')).toBeInTheDocument();
    expect(screen.getByText('EXPENSES')).toBeInTheDocument();
  });

  it('should have correct chart data key', () => {
    render(<FinanceRevenueExpenseGraph />);

    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('data-key', 'month');
  });

  it('should export component correctly', () => {
    expect(FinanceRevenueExpenseGraph).toBeDefined();
    expect(typeof FinanceRevenueExpenseGraph).toBe('function');
  });
});
