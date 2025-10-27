import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  expectFinanceCardStructure,
  expectFinanceChartComponents,
  expectFinanceBarChartDataKeys,
  expectFinanceTimePeriodSelector,
  expectFinanceComponentExport,
  expectLabelsInDocument,
  createRechartsBarChartMock,
  createUIChartMock,
  createRevenueExpenseServicesMock,
  FINANCE_BAR_CHART_COMPONENTS,
  FINANCE_TIME_PERIODS,
} from '../../../../test-utils/shared-test-utils';

import { FinanceRevenueExpenseGraph } from './finance-revenue-expense-graph';

// Mock Recharts components using shared factory
vi.mock('recharts', () => createRechartsBarChartMock());

// Mock UI Chart components using shared factory
vi.mock('@/components/ui-kit/chart', () => createUIChartMock());

// Mock tooltip component
vi.mock('../finance-revenue-expense-graph-tooltip/finance-revenue-expense-graph-tooltip', () => ({
  FinanceRevenueExpenseTooltipContent: ({ hoveredKey }: any) => (
    <div data-testid="tooltip-content" data-hovered-key={hoveredKey}>
      Tooltip Content
    </div>
  ),
}));

// Mock finance services using shared factory
vi.mock('../../services/finance-services', () =>
  createRevenueExpenseServicesMock(
    [
      { month: 'Jan', revenue: 25000, expenses: 9000 },
      { month: 'Feb', revenue: 82000, expenses: 23000 },
      { month: 'Mar', revenue: 41000, expenses: 15000 },
    ],
    [
      { value: 'this-year', label: 'THIS_YEAR' },
      { value: 'last-year', label: 'LAST_YEAR' },
      { value: 'last-6-months', label: 'LAST_SIX_MONTHS' },
    ]
  )
);

// Test data constants - only component-specific data
const TEST_DATA = {
  title: 'REVENUE_EXPENSE_TREND',
  description: 'COMPARE_TOTAL_REVENUE_EXPENSES_ACROSS',
  xAxisKey: 'month',
  barData: [
    { key: 'revenue', name: 'REVENUE' },
    { key: 'expenses', name: 'EXPENSES' },
  ],
  labels: ['REVENUE', 'EXPENSES'],
} as const;

// Render helper
const renderComponent = () => render(<FinanceRevenueExpenseGraph />);

describe('FinanceRevenueExpenseGraph Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing and have correct structure', () => {
      renderComponent();
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expectFinanceCardStructure(TEST_DATA.title, TEST_DATA.description);
    });
  });

  describe('Chart Components', () => {
    it('should render chart components correctly', () => {
      renderComponent();
      expectFinanceChartComponents(FINANCE_BAR_CHART_COMPONENTS);
    });

    it('should render both revenue and expense bars with correct data keys', () => {
      renderComponent();
      expectFinanceBarChartDataKeys(TEST_DATA.xAxisKey, TEST_DATA.barData);
    });
  });

  describe('Time Period Selector', () => {
    it('should render time period selector with correct options', () => {
      renderComponent();
      expectFinanceTimePeriodSelector(FINANCE_TIME_PERIODS.values);

      // Check labels with duplicate handling
      expect(screen.getAllByText('THIS_YEAR')).toHaveLength(2);
      expectLabelsInDocument(['LAST_YEAR', 'LAST_SIX_MONTHS']);
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
      expectFinanceComponentExport(FinanceRevenueExpenseGraph);
    });
  });
});
