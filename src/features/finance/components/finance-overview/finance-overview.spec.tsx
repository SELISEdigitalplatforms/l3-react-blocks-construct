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

// Mock finance services
vi.mock('../../services/finance-services', () => ({
  monthsOfYear: [
    { value: 'january', label: 'JANUARY' },
    { value: 'february', label: 'FEBRUARY' },
    { value: 'march', label: 'MARCH' },
    { value: 'april', label: 'APRIL' },
    { value: 'may', label: 'MAY' },
    { value: 'june', label: 'JUNE' },
    { value: 'july', label: 'JULY' },
    { value: 'august', label: 'AUGUST' },
    { value: 'september', label: 'SEPTEMBER' },
    { value: 'october', label: 'OCTOBER' },
    { value: 'november', label: 'NOVEMBER' },
    { value: 'december', label: 'DECEMBER' },
  ],
}));

describe('FinanceOverview Component', () => {
  it('should render without crashing', () => {
    render(<FinanceOverview />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('should render the card with correct structure', () => {
    render(<FinanceOverview />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');

    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should render the title and month selector', () => {
    render(<FinanceOverview />);

    const title = screen.getByTestId('card-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-xl', 'text-high-emphasis');
    expect(title).toHaveTextContent('OVERVIEW');

    const selectTrigger = screen.getByTestId('select-trigger');
    expect(selectTrigger).toBeInTheDocument();
    expect(selectTrigger).toHaveClass('w-[120px]', 'h-[28px]', 'px-2', 'py-1');
  });

  it('should render all metric cards', () => {
    render(<FinanceOverview />);

    // Check for all metric titles
    expect(screen.getByText('NET_PROFIT')).toBeInTheDocument();
    expect(screen.getByText('TOTAL_REVENUE')).toBeInTheDocument();
    expect(screen.getByText('TOTAL_EXPENSES')).toBeInTheDocument();
    expect(screen.getByText('OUTSTANDING_INVOICES')).toBeInTheDocument();

    // Check for all amounts (using partial text match since CHF and amount are separate)
    expect(screen.getByText(/44,450\.00/)).toBeInTheDocument();
    expect(screen.getByText(/142,300\.00/)).toBeInTheDocument();
    expect(screen.getByText(/97,850\.00/)).toBeInTheDocument();
    expect(screen.getByText(/11,200\.00/)).toBeInTheDocument();
  });

  it('should render all icons correctly', () => {
    render(<FinanceOverview />);

    expect(screen.getByTestId('chart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-icon')).toBeInTheDocument();
    expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument();
    expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();

    // Should have 4 trending up icons (one per metric)
    const trendingIcons = screen.getAllByTestId('trending-up-icon');
    expect(trendingIcons).toHaveLength(3); // Net profit doesn't have trending icon in container
  });

  it('should render month selector with correct options', () => {
    render(<FinanceOverview />);

    const selectItems = screen.getAllByTestId('select-item');
    expect(selectItems).toHaveLength(12); // 12 months

    // Check some month values
    expect(selectItems[0]).toHaveAttribute('data-value', 'january');
    expect(selectItems[11]).toHaveAttribute('data-value', 'december');
  });

  it('should export component correctly', () => {
    expect(FinanceOverview).toBeDefined();
    expect(typeof FinanceOverview).toBe('function');
  });
});
