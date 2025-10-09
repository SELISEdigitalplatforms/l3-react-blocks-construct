import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceOverview } from './finance-overview';

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

// Mock Lucide React icons using factory to reduce duplication
const createMockIcon = (testId: string, title: string) => {
  const MockIcon = ({ className }: { className?: string }) => (
    <svg data-testid={testId} className={className}>
      <title>{title}</title>
    </svg>
  );
  MockIcon.displayName = `MockIcon_${testId}`;
  return MockIcon;
};

vi.mock('lucide-react', () => ({
  ChartNoAxesCombined: createMockIcon('chart-icon', 'Chart'),
  Wallet: createMockIcon('wallet-icon', 'Wallet'),
  CreditCard: createMockIcon('credit-card-icon', 'Credit Card'),
  FileText: createMockIcon('file-text-icon', 'File Text'),
  TrendingUp: createMockIcon('trending-up-icon', 'Trending Up'),
}));

// Mock finance services with inline definitions to avoid hoisting issues
vi.mock('../../services/finance-services', () => {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const createInlineMockIcon = (testId: string, title: string) => {
    const InlineMockIcon = ({ className }: { className?: string }) => (
      <svg data-testid={testId} className={className}>
        <title>{title}</title>
      </svg>
    );
    InlineMockIcon.displayName = `InlineMockIcon_${testId}`;
    return InlineMockIcon;
  };

  const createInlineMetric = (
    titleKey: string,
    amount: string,
    iconTestId: string,
    iconColor: string,
    iconBg?: string,
    trend?: any
  ) => ({
    titleKey,
    amount,
    icon: createInlineMockIcon(iconTestId, titleKey),
    iconColor,
    ...(iconBg && { iconBg }),
    ...(trend && {
      trend: { ...trend, icon: createInlineMockIcon('trending-up-icon', 'Trending Up') },
    }),
  });

  return {
    monthsOfYear: months.map((month: string) => ({ value: month, label: month.toUpperCase() })),
    metricsData: [
      createInlineMetric('NET_PROFIT', '44,450.00', 'chart-icon', 'text-primary', undefined, {
        value: '+8%',
        color: 'text-success',
        textKey: 'FROM_LAST_MONTH',
      }),
      createInlineMetric(
        'TOTAL_REVENUE',
        '142,300.00',
        'wallet-icon',
        'text-secondary',
        'bg-surface rounded-[4px]',
        {
          value: '+10.2%',
          color: 'text-success',
          textKey: 'FROM_LAST_MONTH',
        }
      ),
      createInlineMetric(
        'TOTAL_EXPENSES',
        '97,850.00',
        'credit-card-icon',
        'text-rose-500',
        'bg-surface rounded-[4px]',
        {
          value: '+2.5%',
          color: 'text-error',
          textKey: 'FROM_LAST_MONTH',
        }
      ),
      createInlineMetric(
        'OUTSTANDING_INVOICES',
        '11,200.00',
        'file-text-icon',
        'text-purple-500',
        'bg-surface rounded-[4px]'
      ),
    ],
  };
});

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

// Test data constants to reduce duplication
const TEST_DATA = {
  cardClasses: ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm'],
  titleClasses: ['text-xl', 'text-high-emphasis'],
  selectTriggerClasses: ['w-[120px]', 'h-[28px]', 'px-2', 'py-1'],
  metricTitles: ['NET_PROFIT', 'TOTAL_REVENUE', 'TOTAL_EXPENSES', 'OUTSTANDING_INVOICES'],
  amountPatterns: [/44,450\.00/, /142,300\.00/, /97,850\.00/, /11,200\.00/],
  iconIds: ['chart-icon', 'wallet-icon', 'credit-card-icon', 'file-text-icon'],
  textContent: {
    title: 'OVERVIEW',
  },
  monthsCount: 12,
  trendingIconsCount: 3,
  boundaryMonths: { first: 'january', last: 'december' },
} as const;

// Helper functions to reduce duplication
const renderComponent = () => render(<FinanceOverview />);

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

const expectTextElements = (texts: readonly string[]) => {
  texts.forEach((text) => {
    const elements = screen.getAllByText(text);
    expect(elements.length).toBeGreaterThan(0);
    elements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
};

const expectPatternElements = (patterns: readonly RegExp[]) => {
  patterns.forEach((pattern) => {
    expect(screen.getByText(pattern)).toBeInTheDocument();
  });
};

const expectElementsWithCount = (testId: string, expectedCount: number) => {
  const elements = screen.getAllByTestId(testId);
  expect(elements).toHaveLength(expectedCount);
  return elements;
};

describe('FinanceOverview Component', () => {
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
    it('should render the title and month selector', () => {
      renderComponent();

      const title = expectElementWithClasses('card-title', TEST_DATA.titleClasses);
      expect(title).toHaveTextContent(TEST_DATA.textContent.title);

      expectElementWithClasses('select-trigger', TEST_DATA.selectTriggerClasses);
    });
  });

  describe('Metric Cards', () => {
    it('should render all metric cards', () => {
      renderComponent();
      expectTextElements(TEST_DATA.metricTitles);
      expectPatternElements(TEST_DATA.amountPatterns);
    });

    it('should render all icons correctly', () => {
      renderComponent();
      expectElementsExist(TEST_DATA.iconIds);
      expectElementsWithCount('trending-up-icon', TEST_DATA.trendingIconsCount);
    });
  });

  describe('Month Selector', () => {
    it('should render month selector with correct options', () => {
      renderComponent();
      const selectItems = expectElementsWithCount('select-item', TEST_DATA.monthsCount);

      // Check boundary month values
      expect(selectItems[0]).toHaveAttribute('data-value', TEST_DATA.boundaryMonths.first);
      expect(selectItems[11]).toHaveAttribute('data-value', TEST_DATA.boundaryMonths.last);
    });
  });

  describe('Component Export', () => {
    it('should export component correctly', () => {
      expect(FinanceOverview).toBeDefined();
      expect(typeof FinanceOverview).toBe('function');
    });
  });
});
