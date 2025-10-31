import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceOverviewMetricCard } from './finance-overview-metric-card';
import { MetricData } from '../../types/finance.type';
import '../../../../test-utils/shared-test-utils';

// Helper functions to reduce duplication
const createMockTranslation = () => (key: string) => key;

const createMockIcon = (testId: string) => {
  const MockIcon = ({ className }: { className?: string }) => (
    <svg data-testid={testId} className={className}>
      <title>{testId}</title>
    </svg>
  );
  MockIcon.displayName = `MockIcon_${testId}`;
  return MockIcon;
};

const createMetricWithTrend = (overrides: Partial<MetricData> = {}): MetricData => ({
  titleKey: 'TEST_METRIC',
  amount: '1,000.00',
  icon: createMockIcon('test-icon'),
  iconColor: 'text-primary',
  trend: {
    icon: createMockIcon('trending-up-icon'),
    value: '+5%',
    color: 'text-success',
    textKey: 'FROM_LAST_MONTH',
  },
  ...overrides,
});

const createMetricWithoutTrend = (overrides: Partial<MetricData> = {}): MetricData => ({
  titleKey: 'TEST_METRIC_NO_TREND',
  amount: '2,000.00',
  icon: createMockIcon('test-icon-no-trend'),
  iconColor: 'text-secondary',
  ...overrides,
});

const renderMetricCard = (metric: MetricData, t = createMockTranslation()) =>
  render(<FinanceOverviewMetricCard metric={metric} t={t} />);

// Helper functions for element assertions
const expectElementWithClasses = (element: HTMLElement, classes: string[]) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass(...classes);
};

const expectTextContent = (element: HTMLElement, expectedText: string) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(expectedText);
};

describe('FinanceOverviewMetricCard Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const metric = createMetricWithTrend();
      renderMetricCard(metric);

      expect(screen.getByTestId('metric-card-container')).toBeInTheDocument();
    });

    it('should render with correct container classes', () => {
      const metric = createMetricWithTrend();
      renderMetricCard(metric);

      const container = screen.getByTestId('metric-card-container');
      expectElementWithClasses(container, [
        'flex',
        'flex-col',
        'hover:bg-primary-50',
        'cursor-pointer',
        'gap-4',
        'rounded-lg',
        'px-3',
        'py-2',
      ]);
    });
  });

  describe('Icon Rendering', () => {
    it('should render icon with correct classes', () => {
      const metric = createMetricWithTrend({
        iconColor: 'text-blue-500',
      });
      renderMetricCard(metric);

      const icon = screen.getByTestId('test-icon');
      expectElementWithClasses(icon, ['h-7', 'w-7', 'text-blue-500']);
    });

    it('should render icon container with background when iconBg is provided', () => {
      const metric = createMetricWithTrend({
        iconBg: 'bg-surface rounded-[4px]',
      });
      renderMetricCard(metric);

      const iconContainer = screen.getByTestId('test-icon').parentElement;
      expect(iconContainer).toBeTruthy();
      if (iconContainer) {
        expectElementWithClasses(iconContainer, [
          'flex',
          'h-14',
          'w-14',
          'items-center',
          'justify-center',
          'bg-surface',
          'rounded-[4px]',
        ]);
      }
    });

    it('should render icon container without background when iconBg is not provided', () => {
      const metric = createMetricWithTrend();
      renderMetricCard(metric);

      const iconContainer = screen.getByTestId('test-icon').parentElement;
      expect(iconContainer).toBeTruthy();
      if (iconContainer) {
        expectElementWithClasses(iconContainer, [
          'flex',
          'h-14',
          'w-14',
          'items-center',
          'justify-center',
        ]);
      }
    });
  });

  describe('Content Rendering', () => {
    it('should render metric title correctly', () => {
      const metric = createMetricWithTrend({ titleKey: 'TOTAL_REVENUE' });
      renderMetricCard(metric);

      const title = screen.getByRole('heading', { level: 3 });
      expectElementWithClasses(title, ['text-sm', 'font-normal', 'text-high-emphasis']);
      expectTextContent(title, 'TOTAL_REVENUE');
    });

    it('should render metric amount with CHF currency', () => {
      const metric = createMetricWithTrend({ amount: '50,000.00' });
      renderMetricCard(metric);

      const amount = screen.getByRole('heading', { level: 1 });
      expectElementWithClasses(amount, ['text-[32px]', 'font-semibold', 'text-high-emphasis']);
      expectTextContent(amount, 'CHF 50,000.00');
    });
  });

  describe('Trend Rendering', () => {
    it('should render trend information when trend is provided', () => {
      const metric = createMetricWithTrend({
        trend: {
          icon: createMockIcon('trend-icon'),
          value: '+12.5%',
          color: 'text-success',
          textKey: 'FROM_LAST_QUARTER',
        },
      });
      renderMetricCard(metric);

      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();

      const trendValue = screen.getByText('+12.5%');
      expectElementWithClasses(trendValue, ['text-sm', 'text-success', 'font-semibold']);

      expectTextContent(screen.getByText('FROM_LAST_QUARTER'), 'FROM_LAST_QUARTER');
    });

    it('should not render trend information when trend is not provided', () => {
      const metric = createMetricWithoutTrend();
      renderMetricCard(metric);

      expect(screen.queryByTestId('trending-up-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('FROM_LAST_MONTH')).not.toBeInTheDocument();
    });

    it('should render trend with different colors', () => {
      const testCases = [
        { color: 'text-success', value: '+8%' },
        { color: 'text-error', value: '-3%' },
        { color: 'text-warning', value: '+1%' },
      ];

      testCases.forEach(({ color, value }) => {
        const metric = createMetricWithTrend({
          trend: {
            icon: createMockIcon('trend-icon'),
            value,
            color,
            textKey: 'FROM_LAST_MONTH',
          },
        });

        const { unmount } = renderMetricCard(metric);

        const trendValue = screen.getByText(value);
        expectElementWithClasses(trendValue, ['text-sm', color, 'font-semibold']);

        unmount();
      });
    });
  });

  describe('Outstanding Invoices Special Case', () => {
    it('should render outstanding invoices footer when titleKey is OUTSTANDING_INVOICES', () => {
      const metric = createMetricWithoutTrend({
        titleKey: 'OUTSTANDING_INVOICES',
      });
      renderMetricCard(metric);

      expectTextContent(screen.getByText('2'), '2');
      expectTextContent(screen.getByText('OVERDUE'), 'OVERDUE');
      expectTextContent(screen.getByText('3'), '3');
      expectTextContent(screen.getByText('PENDING'), 'PENDING');

      // Check classes for overdue and pending counts
      const overdueCount = screen.getByText('2');
      expectElementWithClasses(overdueCount, ['text-sm', 'text-error', 'font-semibold']);

      const pendingCount = screen.getByText('3');
      expectElementWithClasses(pendingCount, ['text-sm', 'text-warning', 'font-semibold']);
    });

    it('should not render outstanding invoices footer for other metrics', () => {
      const metric = createMetricWithTrend({ titleKey: 'TOTAL_REVENUE' });
      renderMetricCard(metric);

      expect(screen.queryByText('OVERDUE')).not.toBeInTheDocument();
      expect(screen.queryByText('PENDING')).not.toBeInTheDocument();
    });
  });

  describe('Translation Function', () => {
    it('should use translation function for all text content', () => {
      const mockT = vi.fn((key: string) => `translated_${key}`);
      const metric = createMetricWithTrend({
        titleKey: 'NET_PROFIT',
        trend: {
          icon: createMockIcon('trend-icon'),
          value: '+8%',
          color: 'text-success',
          textKey: 'FROM_LAST_MONTH',
        },
      });

      renderMetricCard(metric, mockT);

      expect(mockT).toHaveBeenCalledWith('NET_PROFIT');
      expect(mockT).toHaveBeenCalledWith('CHF');
      expect(mockT).toHaveBeenCalledWith('FROM_LAST_MONTH');
    });
  });

  describe('Component Export', () => {
    it('should export component correctly', () => {
      expect(FinanceOverviewMetricCard).toBeDefined();
      expect(typeof FinanceOverviewMetricCard).toBe('function');
    });
  });
});
