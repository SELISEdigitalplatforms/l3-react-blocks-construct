import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  expectElementWithClasses,
  expectElementsExist,
  expectTextContent,
  expectElementsWithAttributes,
  expectLabelsInDocument,
} from '../../../../test-utils/shared-test-utils';
import { FinanceProfitOverviewGraph } from './finance-profit-overview-graph';

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

// Test data constants to reduce duplication
const TEST_DATA = {
  cardClasses: ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm'],
  titleClasses: ['text-2xl', 'font-semibold', 'text-high-emphasis'],
  selectTriggerClasses: ['w-[105px]', 'h-[28px]', 'px-2', 'py-1'],
  chartComponents: [
    'responsive-container',
    'area-chart',
    'cartesian-grid',
    'x-axis',
    'y-axis',
    'tooltip',
    'area',
  ],
  timePeriodValues: ['this-year', 'last-year', 'last-6-months'],
  timePeriodLabels: ['LAST_YEAR', 'LAST_SIX_MONTHS'],
  textContent: {
    title: 'PROFIT_OVERVIEW',
    description: 'MONITOR_YOUR_PROFIT_TRENDS',
    areaDataKey: 'profit',
    xAxisDataKey: 'month',
  },
} as const;

// Render helper remains local
const renderComponent = () => render(<FinanceProfitOverviewGraph />);

describe('FinanceProfitOverviewGraph Component', () => {
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

    it('should have correct chart data keys', () => {
      renderComponent();
      expect(screen.getByTestId('area')).toHaveAttribute(
        'data-key',
        TEST_DATA.textContent.areaDataKey
      );
      expect(screen.getByTestId('x-axis')).toHaveAttribute(
        'data-key',
        TEST_DATA.textContent.xAxisDataKey
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

  describe('Component Export', () => {
    it('should export component correctly', () => {
      expect(FinanceProfitOverviewGraph).toBeDefined();
      expect(typeof FinanceProfitOverviewGraph).toBe('function');
    });
  });
});
