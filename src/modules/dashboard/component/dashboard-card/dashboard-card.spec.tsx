import { render, screen } from '@testing-library/react';
import { vi, describe, test, beforeEach, expect } from 'vitest';
import { DashboardCard } from './dashboard-card';

// Mock Card and Select components - Must be defined before imports to avoid hoisting issues
vi.mock('@/components/ui-kit/card', () => ({
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
}));

vi.mock('@/components/ui-kit/select', () => ({
  Select: ({ children, ...props }: any) => (
    <div data-testid="select" {...props}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className, ...props }: any) => (
    <button className={className} data-testid="select-trigger" {...props}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder, ...props }: any) => (
    <span data-testid="select-value" {...props}>
      {placeholder}
    </span>
  ),
  SelectContent: ({ children, ...props }: any) => (
    <div data-testid="select-content" {...props}>
      {children}
    </div>
  ),
  SelectGroup: ({ children, ...props }: any) => (
    <div data-testid="select-group" {...props}>
      {children}
    </div>
  ),
  SelectItem: ({ children, value, ...props }: any) => (
    <div data-testid={`select-item-${value}`} data-value={value} {...props}>
      {children}
    </div>
  ),
}));

// Import shared test utils for react-i18next mock AFTER mocks
import '../../../../lib/utils/test-utils/shared-test-utils';

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
