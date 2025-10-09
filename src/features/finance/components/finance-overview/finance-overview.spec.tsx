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

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ChartNoAxesCombined: ({ className }: { className?: string }) => (
    <svg data-testid="chart-icon" className={className}>
      <title>Chart</title>
    </svg>
  ),
  Wallet: ({ className }: { className?: string }) => (
    <svg data-testid="wallet-icon" className={className}>
      <title>Wallet</title>
    </svg>
  ),
  CreditCard: ({ className }: { className?: string }) => (
    <svg data-testid="credit-card-icon" className={className}>
      <title>Credit Card</title>
    </svg>
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg data-testid="file-text-icon" className={className}>
      <title>File Text</title>
    </svg>
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <svg data-testid="trending-up-icon" className={className}>
      <title>Trending Up</title>
    </svg>
  ),
}));

// Mock finance services with compressed structure
vi.mock('../../services/finance-services', () => ({
  monthsOfYear: Array.from({ length: 12 }, (_, i) => {
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
    return { value: months[i], label: months[i].toUpperCase() };
  }),
  metricsData: [
    {
      titleKey: 'NET_PROFIT',
      amount: '44,450.00',
      icon: ({ className }: { className?: string }) => (
        <svg data-testid="chart-icon" className={className}><title>Chart</title></svg>
      ),
      iconColor: 'text-primary',
      trend: {
        icon: ({ className }: { className?: string }) => (
          <svg data-testid="trending-up-icon" className={className}><title>Trending Up</title></svg>
        ),
        value: '+8%',
        color: 'text-success',
        textKey: 'FROM_LAST_MONTH',
      },
    },
    {
      titleKey: 'TOTAL_REVENUE',
      amount: '142,300.00',
      icon: ({ className }: { className?: string }) => (
        <svg data-testid="wallet-icon" className={className}><title>Wallet</title></svg>
      ),
      iconColor: 'text-secondary',
      iconBg: 'bg-surface rounded-[4px]',
      trend: {
        icon: ({ className }: { className?: string }) => (
          <svg data-testid="trending-up-icon" className={className}><title>Trending Up</title></svg>
        ),
        value: '+10.2%',
        color: 'text-success',
        textKey: 'FROM_LAST_MONTH',
      },
    },
    {
      titleKey: 'TOTAL_EXPENSES',
      amount: '97,850.00',
      icon: ({ className }: { className?: string }) => (
        <svg data-testid="credit-card-icon" className={className}><title>Credit Card</title></svg>
      ),
      iconColor: 'text-rose-500',
      iconBg: 'bg-surface rounded-[4px]',
      trend: {
        icon: ({ className }: { className?: string }) => (
          <svg data-testid="trending-up-icon" className={className}><title>Trending Up</title></svg>
        ),
        value: '+2.5%',
        color: 'text-error',
        textKey: 'FROM_LAST_MONTH',
      },
    },
    {
      titleKey: 'OUTSTANDING_INVOICES',
      amount: '11,200.00',
      icon: ({ className }: { className?: string }) => (
        <svg data-testid="file-text-icon" className={className}><title>File Text</title></svg>
      ),
      iconColor: 'text-purple-500',
      iconBg: 'bg-surface rounded-[4px]',
    },
  ],
}));

// Mock FinanceOverviewMetricCard component
vi.mock('../finance-overview-metric-card/finance-overview-metric-card', () => ({
  FinanceOverviewMetricCard: ({ metric, t }: any) => {
    const IconComponent = metric.icon;
    const TrendIcon = metric.trend?.icon;
    
    return (
      <div data-testid="metric-card" className="flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2">
        <div className={`flex h-14 w-14 items-center justify-center ${metric.iconBg || ''}`}>
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

// Helper functions to reduce duplication
const renderComponent = () => render(<FinanceOverview />);

const expectElementWithClasses = (testId: string, classes: string[]) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass(...classes);
  return element;
};

const expectMetricTexts = (texts: string[]) => {
  texts.forEach((text) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
};

const expectAmountPatterns = (patterns: RegExp[]) => {
  patterns.forEach((pattern) => {
    expect(screen.getByText(pattern)).toBeInTheDocument();
  });
};

const expectIcons = (iconIds: string[]) => {
  iconIds.forEach((iconId) => {
    expect(screen.getByTestId(iconId)).toBeInTheDocument();
  });
};

describe('FinanceOverview Component', () => {
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

  it('should render the title and month selector', () => {
    renderComponent();

    const title = expectElementWithClasses('card-title', ['text-xl', 'text-high-emphasis']);
    expect(title).toHaveTextContent('OVERVIEW');

    expectElementWithClasses('select-trigger', ['w-[120px]', 'h-[28px]', 'px-2', 'py-1']);
  });

  it('should render all metric cards', () => {
    renderComponent();

    // Check metric titles using helper
    expectMetricTexts(['NET_PROFIT', 'TOTAL_REVENUE', 'TOTAL_EXPENSES', 'OUTSTANDING_INVOICES']);

    // Check amounts using helper
    expectAmountPatterns([/44,450\.00/, /142,300\.00/, /97,850\.00/, /11,200\.00/]);
  });

  it('should render all icons correctly', () => {
    renderComponent();

    expectIcons(['chart-icon', 'wallet-icon', 'credit-card-icon', 'file-text-icon']);

    // Trending icons count validation
    const trendingIcons = screen.getAllByTestId('trending-up-icon');
    expect(trendingIcons).toHaveLength(3);
  });

  it('should render month selector with correct options', () => {
    renderComponent();

    const selectItems = screen.getAllByTestId('select-item');
    expect(selectItems).toHaveLength(12);

    // Check boundary month values
    expect(selectItems[0]).toHaveAttribute('data-value', 'january');
    expect(selectItems[11]).toHaveAttribute('data-value', 'december');
  });

  it('should export component correctly', () => {
    expect(FinanceOverview).toBeDefined();
    expect(typeof FinanceOverview).toBe('function');
  });
});
