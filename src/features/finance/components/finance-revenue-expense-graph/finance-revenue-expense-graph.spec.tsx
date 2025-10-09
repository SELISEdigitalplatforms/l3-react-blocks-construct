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
    revenue: { label: 'REVENUE', color: 'hsl(var(--secondary-600))' },
    expenses: { label: 'EXPENSES', color: 'hsl(var(--burgundy-100))' },
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

// Helper functions to reduce duplication
const renderComponent = () => render(<FinanceRevenueExpenseGraph />);

const expectElementWithClasses = (testId: string, classes: string[]) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass(...classes);
  return element;
};

const expectChartComponents = (components: string[]) => {
  components.forEach((component) => {
    expect(screen.getByTestId(component)).toBeInTheDocument();
  });
};

const expectSelectItems = (expectedCount: number, values: string[]) => {
  const items = screen.getAllByTestId('select-item');
  expect(items).toHaveLength(expectedCount);
  values.forEach((value, index) => {
    expect(items[index]).toHaveAttribute('data-value', value);
  });
};

const expectBarsWithAttributes = (
  expectedCount: number,
  barData: Array<{ key: string; name: string }>
) => {
  const bars = screen.getAllByTestId('bar');
  expect(bars).toHaveLength(expectedCount);
  barData.forEach((data, index) => {
    expect(bars[index]).toHaveAttribute('data-key', data.key);
    expect(bars[index]).toHaveAttribute('data-name', data.name);
  });
};

describe('FinanceRevenueExpenseGraph Component', () => {
  it('should render without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('should render the card with correct structure', () => {
    renderComponent();
    expectElementWithClasses('card', ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm']);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should render the title and time period selector', () => {
    renderComponent();

    const title = expectElementWithClasses('card-title', [
      'text-2xl',
      'font-semibold',
      'text-high-emphasis',
    ]);
    expect(title).toHaveTextContent('REVENUE_EXPENSE_TREND');

    const description = screen.getByTestId('card-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('COMPARE_TOTAL_REVENUE_EXPENSES_ACROSS');

    expectElementWithClasses('select-trigger', ['w-[105px]', 'h-[28px]', 'px-2', 'py-1']);
  });

  it('should render chart components correctly', () => {
    renderComponent();
    expectChartComponents([
      'chart-container',
      'bar-chart',
      'cartesian-grid',
      'x-axis',
      'y-axis',
      'chart-tooltip',
    ]);
  });

  it('should render both revenue and expense bars', () => {
    renderComponent();
    expectBarsWithAttributes(2, [
      { key: 'revenue', name: 'REVENUE' },
      { key: 'expenses', name: 'EXPENSES' },
    ]);
  });

  it('should render time period selector with correct options', () => {
    renderComponent();
    expectSelectItems(3, ['this-year', 'last-year', 'last-6-months']);

    // Check labels with duplicate handling
    expect(screen.getAllByText('THIS_YEAR')).toHaveLength(2);
    ['LAST_YEAR', 'LAST_SIX_MONTHS'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('should render legend with revenue and expense labels', () => {
    renderComponent();
    ['REVENUE', 'EXPENSES'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('should have correct chart data key', () => {
    renderComponent();
    expect(screen.getByTestId('x-axis')).toHaveAttribute('data-key', 'month');
  });

  it('should export component correctly', () => {
    expect(FinanceRevenueExpenseGraph).toBeDefined();
    expect(typeof FinanceRevenueExpenseGraph).toBe('function');
  });
});
