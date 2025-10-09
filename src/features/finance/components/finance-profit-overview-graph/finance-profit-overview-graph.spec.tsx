import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceProfitOverviewGraph } from './finance-profit-overview-graph';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div data-testid="card-description" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, ...props }: any) => (
    <div data-testid="select" {...props}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <button data-testid="select-trigger" className={className}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
  SelectContent: ({ children, ...props }: any) => (
    <div data-testid="select-content" {...props}>
      {children}
    </div>
  ),
  SelectGroup: ({ children, ...props }: any) => (
    <div data-testid="select-group" {...props}>
      {children}
    </div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

// Mock Recharts components
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

// Mock services and utilities
vi.mock('../../services/finance-services', () => ({
  CHART_CONFIG: {
    minHeight: 400,
    margins: { top: 10, right: 10, left: 10, bottom: 10 },
    colors: { grid: 'hsl(var(--neutral-100))', axis: 'hsl(var(--medium-emphasis))' },
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

vi.mock('../../utils/finance-profit-graph', () => ({
  createYAxisLabel: (text: string) => ({ value: text }),
  formatTooltipValue: (value: number) => `CHF ${value.toLocaleString()}`,
  formatYAxisValue: (value: number) => `${value / 1000}k`,
}));

// Helper functions to reduce duplication
const renderComponent = () => render(<FinanceProfitOverviewGraph />);

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

describe('FinanceProfitOverviewGraph Component', () => {
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
    expect(title).toHaveTextContent('PROFIT_OVERVIEW');

    const description = screen.getByTestId('card-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('MONITOR_YOUR_PROFIT_TRENDS');

    expectElementWithClasses('select-trigger', ['w-[105px]', 'h-[28px]', 'px-2', 'py-1']);
  });

  it('should render chart components correctly', () => {
    renderComponent();
    expectChartComponents([
      'responsive-container',
      'area-chart',
      'cartesian-grid',
      'x-axis',
      'y-axis',
      'tooltip',
      'area',
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

  it('should have correct chart data key', () => {
    renderComponent();
    expect(screen.getByTestId('area')).toHaveAttribute('data-key', 'profit');
    expect(screen.getByTestId('x-axis')).toHaveAttribute('data-key', 'month');
  });

  it('should export component correctly', () => {
    expect(FinanceProfitOverviewGraph).toBeDefined();
    expect(typeof FinanceProfitOverviewGraph).toBe('function');
  });
});
