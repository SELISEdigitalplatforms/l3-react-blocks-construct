import { render, screen } from '@testing-library/react';
import { vi, describe, test, beforeEach, expect } from 'vitest';
import { DashboardCard } from './dashboard-card';
import '../../../../lib/utils/test-utils/shared-test-utils';

vi.mock('@/components/ui-kit/card', () => {
  return {
    Card: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card" {...props}>
        {children}
      </div>
    ),
    CardHeader: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card-header" {...props}>
        {children}
      </div>
    ),
    CardContent: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card-content" {...props}>
        {children}
      </div>
    ),
    CardTitle: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card-title" {...props}>
        {children}
      </div>
    ),
    CardDescription: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="card-description" {...props}>
        {children}
      </div>
    ),
  };
});

vi.mock('@/components/ui-kit/select', () => {
  return {
    Select: ({ children }: any) => <div data-testid="select">{children}</div>,
    SelectTrigger: ({ children }: any) => <button data-testid="select-trigger">{children}</button>,
    SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
    SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
    SelectGroup: ({ children }: any) => <div data-testid="select-group">{children}</div>,
    SelectItem: ({ children, value }: any) => (
      <div data-testid={`select-item-${value}`}>{children}</div>
    ),
  };
});

// -----------------------------------------------------------------------------
// 🔹 Mock react-i18next
// -----------------------------------------------------------------------------
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// -----------------------------------------------------------------------------
// 🔹 Test Data
// -----------------------------------------------------------------------------
const mockDropdownItems = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
];

const mockData = [
  { id: 1, name: 'Total Users', value: '10,000' },
  { id: 2, name: 'Active Users', value: '7,000' },
];

// -----------------------------------------------------------------------------
// 🔹 Tests
// -----------------------------------------------------------------------------
describe('DashboardCard Component', () => {
  beforeEach(() => {
    render(
      <DashboardCard
        titleKey="OVERVIEW"
        placeholderKey="THIS_MONTH"
        dropdownItems={mockDropdownItems}
        data={mockData}
        renderItem={(item) => (
          <div key={item.id} data-testid="dashboard-item">
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
        )}
      />
    );
  });

  test('renders the card with the title', () => {
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
  });

  test('renders select with placeholder text', () => {
    expect(screen.getByTestId('select-value')).toHaveTextContent('THIS_MONTH');
  });

  test('renders dropdown items', () => {
    expect(screen.getByTestId('select-item-january')).toHaveTextContent('January');
    expect(screen.getByTestId('select-item-february')).toHaveTextContent('February');
  });

  test('renders data items correctly', () => {
    const items = screen.getAllByTestId('dashboard-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });

  test('renders all core card structure parts', () => {
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-description')).toBeInTheDocument();
  });
});
