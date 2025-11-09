import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  expectFinanceOverviewCardStructure,
  expectFinanceOverviewMetrics,
  expectFinanceOverviewIcons,
  expectFinanceOverviewMonthSelector,
  expectFinanceComponentExport,
  createMockIcon,
  createFinanceOverviewServicesMock,
} from '../../../../test-utils/shared-test-utils';
import { FinanceOverview } from './finance-overview';

// Mock Lucide React icons using shared factory
vi.mock('lucide-react', () => ({
  ChartNoAxesCombined: createMockIcon('chart-icon', 'Chart'),
  Wallet: createMockIcon('wallet-icon', 'Wallet'),
  CreditCard: createMockIcon('credit-card-icon', 'Credit Card'),
  FileText: createMockIcon('file-text-icon', 'File Text'),
  TrendingUp: createMockIcon('trending-up-icon', 'Trending Up'),
}));

// Mock finance services using shared factory
vi.mock('../../services/finance-services', () => createFinanceOverviewServicesMock());

// Mock FinanceOverviewMetricCard component
vi.mock('../finance-overview-metric-card/finance-overview-metric-card', () => ({
  FinanceOverviewMetricCard: ({ metric, t }: any) => {
    const IconComponent = metric.icon;
    const TrendIcon = metric.trend?.icon;

    return (
      <div
        data-testid="metric-card"
        className="flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2"
      >
        <div className={`flex h-14 w-14 items-center justify-center ${metric.iconBg ?? ''}`}>
          <IconComponent className={`h-7 w-7 ${metric.iconColor}`} />
        </div>
        <div>
          <h3 className="text-sm font-normal text-high-emphasis">{t(metric.titleKey)}</h3>
          <h1 className="text-[32px] font-semibold text-high-emphasis">
            {t('CHF')} {metric.amount}
          </h1>
          <div className="flex gap-1 items-center">
            {metric.trend && TrendIcon && (
              <>
                <TrendIcon className={`h-4 w-4 ${metric.trend.color}`} />
                <span className={`text-sm ${metric.trend.color} font-semibold`}>
                  {metric.trend.value}
                </span>
                <span className="text-sm text-medium-emphasis">{t(metric.trend.textKey)}</span>
              </>
            )}
            {metric.titleKey === 'OUTSTANDING_INVOICES' && (
              <>
                <span className="text-sm text-error font-semibold">2</span>
                <span className="text-sm text-medium-emphasis">{t('OVERDUE')}</span>
                <span className="text-sm text-warning font-semibold">3</span>
                <span className="text-sm text-medium-emphasis">{t('PENDING')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
}));

// Test data constants - only component-specific data
const TEST_DATA = {
  title: 'OVERVIEW',
  metricTitles: ['NET_PROFIT', 'TOTAL_REVENUE', 'TOTAL_EXPENSES', 'OUTSTANDING_INVOICES'],
  amountPatterns: [/44,450\.00/, /142,300\.00/, /97,850\.00/, /11,200\.00/],
  iconIds: ['chart-icon', 'wallet-icon', 'credit-card-icon', 'file-text-icon'],
  monthsCount: 12,
  trendingIconsCount: 3,
  boundaryMonths: { first: 'january', last: 'december' },
} as const;

// Render helper
const renderComponent = () => render(<FinanceOverview />);

describe('FinanceOverview Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing and have correct structure', () => {
      renderComponent();
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expectFinanceOverviewCardStructure(TEST_DATA.title);
    });
  });

  describe('Metric Cards', () => {
    it('should render all metric cards with correct data', () => {
      renderComponent();
      expectFinanceOverviewMetrics(TEST_DATA.metricTitles, TEST_DATA.amountPatterns);
    });

    it('should render all icons correctly', () => {
      renderComponent();
      expectFinanceOverviewIcons(TEST_DATA.iconIds, TEST_DATA.trendingIconsCount);
    });
  });

  describe('Month Selector', () => {
    it('should render month selector with correct options', () => {
      renderComponent();
      expectFinanceOverviewMonthSelector(
        TEST_DATA.monthsCount,
        TEST_DATA.boundaryMonths.first,
        TEST_DATA.boundaryMonths.last
      );
    });
  });

  describe('Component Export', () => {
    it('should export component correctly', () => {
      expectFinanceComponentExport(FinanceOverview);
    });
  });
});
