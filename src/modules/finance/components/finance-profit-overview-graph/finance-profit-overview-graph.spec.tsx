import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  expectFinanceCardStructure,
  expectFinanceChartComponents,
  expectFinanceChartDataKeys,
  expectFinanceTimePeriodSelector,
  expectFinanceComponentExport,
  expectLabelsInDocument,
  createRechartsAreaChartMock,
  createFinanceServicesMock,
  createFinanceUtilsMock,
  FINANCE_CHART_COMPONENTS,
  FINANCE_TIME_PERIODS,
} from '../../../../lib/utils/test-utils/shared-test-utils';

import { FinanceProfitOverviewGraph } from './finance-profit-overview-graph';

// Mock Recharts components using shared factory
vi.mock('recharts', () => createRechartsAreaChartMock());

// Mock services using shared factory
vi.mock('../../services/finance-services', () =>
  createFinanceServicesMock(
    [
      { month: 'Jan', profit: 42000 },
      { month: 'Feb', profit: 48000 },
      { month: 'Mar', profit: 55000 },
    ],
    [
      { value: 'this-year', label: 'THIS_YEAR' },
      { value: 'last-year', label: 'LAST_YEAR' },
      { value: 'last-6-months', label: 'LAST_SIX_MONTHS' },
    ]
  )
);

// Mock utilities using shared factory
vi.mock('../../utils/finance-profit-graph', () => createFinanceUtilsMock());

// Test data constants - only component-specific data
const TEST_DATA = {
  title: 'PROFIT_OVERVIEW',
  description: 'MONITOR_YOUR_PROFIT_TRENDS',
  areaDataKey: 'profit',
  xAxisDataKey: 'month',
} as const;

// Render helper
const renderComponent = () => render(<FinanceProfitOverviewGraph />);

describe('FinanceProfitOverviewGraph Component', () => {
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
      expectFinanceChartComponents(FINANCE_CHART_COMPONENTS);
    });

    it('should have correct chart data keys', () => {
      renderComponent();
      expectFinanceChartDataKeys(TEST_DATA.areaDataKey, TEST_DATA.xAxisDataKey);
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

  describe('Component Export', () => {
    it('should export component correctly', () => {
      expectFinanceComponentExport(FinanceProfitOverviewGraph);
    });
  });
});
