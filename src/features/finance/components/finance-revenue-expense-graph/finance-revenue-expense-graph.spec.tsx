import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceRevenueExpenseGraph } from './finance-revenue-expense-graph';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UI components with inline factory functions to avoid hoisting issues
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

// Mock Recharts components
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

// Test data constants to reduce duplication
const TEST_DATA = {
  cardClasses: ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm'],
  titleClasses: ['text-2xl', 'font-semibold', 'text-high-emphasis'],
  selectTriggerClasses: ['w-[105px]', 'h-[28px]', 'px-2', 'py-1'],
  chartComponents: [
    'chart-container',
    'bar-chart',
    'cartesian-grid',
    'x-axis',
    'y-axis',
    'chart-tooltip',
  ],
  barData: [
    { key: 'revenue', name: 'REVENUE' },
    { key: 'expenses', name: 'EXPENSES' },
  ],
  timePeriodValues: ['this-year', 'last-year', 'last-6-months'],
  labels: ['REVENUE', 'EXPENSES'],
  timePeriodLabels: ['LAST_YEAR', 'LAST_SIX_MONTHS'],
  textContent: {
    title: 'REVENUE_EXPENSE_TREND',
    description: 'COMPARE_TOTAL_REVENUE_EXPENSES_ACROSS',
    xAxisKey: 'month',
  },
} as const;

// Helper functions to reduce duplication
const renderComponent = () => render(<FinanceRevenueExpenseGraph />);

const expectElementWithClasses = (testId: string, classes: readonly string[]) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass(...classes);
  return element;
};

const expectElementsExist = (testIds: readonly string[]) => {
  testIds.forEach((testId) => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
};

const expectTextContent = (testId: string, content: string) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(content);
  return element;
};

const expectElementsWithAttributes = (
  testId: string,
  expectedCount: number,
  attributeChecks: Array<{ attribute: string; value: string }>
) => {
  const elements = screen.getAllByTestId(testId);
  expect(elements).toHaveLength(expectedCount);
  attributeChecks.forEach((check, index) => {
    expect(elements[index]).toHaveAttribute(check.attribute, check.value);
  });
};

const expectLabelsInDocument = (labels: readonly string[]) => {
  labels.forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument();
  });
};

describe('FinanceRevenueExpenseGraph Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render the card with correct structure', () => {
      renderComponent();
      expectElementWithClasses('card', TEST_DATA.cardClasses);
      expectElementsExist(['card-header', 'card-content']);
    });
  });

  describe('Header Section', () => {
    it('should render the title and time period selector', () => {
      renderComponent();

      const title = expectElementWithClasses('card-title', TEST_DATA.titleClasses);
      expect(title).toHaveTextContent(TEST_DATA.textContent.title);

      expectTextContent('card-description', TEST_DATA.textContent.description);
      expectElementWithClasses('select-trigger', TEST_DATA.selectTriggerClasses);
    });
  });

  describe('Chart Components', () => {
    it('should render chart components correctly', () => {
      renderComponent();
      expectElementsExist(TEST_DATA.chartComponents);
    });

    it('should render both revenue and expense bars', () => {
      renderComponent();
      expectElementsWithAttributes('bar', 2, [
        { attribute: 'data-key', value: TEST_DATA.barData[0].key },
        { attribute: 'data-key', value: TEST_DATA.barData[1].key },
      ]);
    });

    it('should have correct chart data key', () => {
      renderComponent();
      expect(screen.getByTestId('x-axis')).toHaveAttribute(
        'data-key',
        TEST_DATA.textContent.xAxisKey
      );
    });
  });

  describe('Time Period Selector', () => {
    it('should render time period selector with correct options', () => {
      renderComponent();
      expectElementsWithAttributes('select-item', 3, [
        { attribute: 'data-value', value: TEST_DATA.timePeriodValues[0] },
        { attribute: 'data-value', value: TEST_DATA.timePeriodValues[1] },
        { attribute: 'data-value', value: TEST_DATA.timePeriodValues[2] },
      ]);

      // Check labels with duplicate handling
      expect(screen.getAllByText('THIS_YEAR')).toHaveLength(2);
      expectLabelsInDocument(TEST_DATA.timePeriodLabels);
    });
  });

  describe('Legend', () => {
    it('should render legend with revenue and expense labels', () => {
      renderComponent();
      expectLabelsInDocument(TEST_DATA.labels);
    });
  });

  describe('Component Export', () => {
    it('should export component correctly', () => {
      expect(FinanceRevenueExpenseGraph).toBeDefined();
      expect(typeof FinanceRevenueExpenseGraph).toBe('function');
    });
  });
});
