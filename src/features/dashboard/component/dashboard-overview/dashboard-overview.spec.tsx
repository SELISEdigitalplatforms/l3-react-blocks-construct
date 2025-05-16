import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardOverview } from './dashboard-overview';

jest.mock('components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardDescription: () => <div data-testid="card-description" />,
}));

jest.mock('components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select">{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-group">{children}</div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-item">{children}</div>
  ),
}));

jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="icon-trending-up" />,
  Users: () => <div data-testid="icon-users" />,
  UserCog: () => <div data-testid="icon-user-cog" />,
  UserPlus: () => <div data-testid="icon-user-plus" />,
}));

jest.mock('../../services/dashboard-service', () => ({
  monthsOfYear: [
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' },
  ],
}));

describe('DashboardOverview Component', () => {
  beforeEach(() => {
    render(<DashboardOverview />);
  });

  test('renders the card with the Overview title', () => {
    expect(screen.getByTestId('card-title')).toHaveTextContent('OVERVIEW');
  });

  test('renders the select with default placeholder "This month"', () => {
    expect(screen.getByTestId('select-value')).toHaveTextContent('THIS_MONTH');
  });

  test('renders months in the select dropdown', () => {
    // Ensure the select group is rendered and contains the mocked month labels
    expect(screen.getByTestId('select-group')).toBeInTheDocument();
    const selectItems = screen.getAllByTestId('select-item');
    const monthLabels = selectItems.map((item) => item.textContent);
    expect(monthLabels).toEqual(
      expect.arrayContaining([
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ])
    );
  });

  test('renders the "Total users" section with correct details', () => {
    expect(screen.getByText('TOTAL_USERS')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
    expect(screen.getByText('+2.5%')).toBeInTheDocument();
    expect(screen.getAllByText('FROM_LAST_MONTH')).toHaveLength(3);
    expect(screen.getAllByTestId('icon-trending-up')).toHaveLength(3);
    expect(screen.getByTestId('icon-users')).toBeInTheDocument();
  });

  test('renders the "Total active users" section with correct details', () => {
    expect(screen.getByText('TOTAL_ACTIVE_USERS')).toBeInTheDocument();
    expect(screen.getByText('7,000')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-user-cog')).toBeInTheDocument();
  });

  test('renders the "New sign-ups" section with correct details', () => {
    expect(screen.getByText('NEW_SIGN_UPS')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('+8%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-user-plus')).toBeInTheDocument();
  });
});
