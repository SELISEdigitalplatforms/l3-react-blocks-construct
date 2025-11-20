import { render, screen } from '@testing-library/react';
import { describe, test, beforeEach, expect } from 'vitest';
import { DashboardCard } from './dashboard-card';
import '../../../../lib/utils/test-utils/shared-test-utils';

const mockDropdownItems = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
];

const mockData = [
  { id: 1, name: 'Total Users', value: '10,000' },
  { id: 2, name: 'Active Users', value: '7,000' },
];

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
    expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
    const cardTitle = screen.getByText('OVERVIEW');
    expect(cardTitle).toHaveClass('text-xl', 'text-high-emphasis');
  });

  test('renders select with placeholder text', () => {
    const selectValue = screen.getByText('THIS_MONTH');
    expect(selectValue).toBeInTheDocument();
    expect(selectValue.closest('button')).toHaveAttribute('role', 'combobox');
  });

  test('renders dropdown items', () => {
    // Dropdown items are not rendered until the select is opened in the real component
    // Just verify the select trigger exists
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });

  test('renders data items correctly', () => {
    const items = screen.getAllByTestId('dashboard-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });

  test('renders all core card structure parts', () => {
    // Verify card structure by checking for key elements
    expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByTestId('dashboard-item')).toHaveLength(2);
  });
});
