import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FinanceRevenueExpenseTooltipContent } from './finance-revenue-expense-graph-tooltip';
import '../../../../lib/utils/test-utils/shared-test-utils';

// Mock finance services
vi.mock('../../services/finance-services', () => ({
  chartConfig: {
    revenue: {
      label: 'REVENUE',
      color: 'hsl(var(--secondary-600))',
    },
    expenses: {
      label: 'EXPENSES',
      color: 'hsl(var(--burgundy-100))',
    },
  },
}));

describe('FinanceRevenueExpenseTooltipContent Component', () => {
  const mockPayload = [
    {
      dataKey: 'revenue',
      value: 25000,
      name: 'REVENUE',
    },
    {
      dataKey: 'expenses',
      value: 9000,
      name: 'EXPENSES',
    },
  ];

  it('should render nothing when payload is null', () => {
    const { container } = render(
      <FinanceRevenueExpenseTooltipContent payload={undefined} label="Jan" hoveredKey="revenue" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when hoveredKey is null', () => {
    const { container } = render(
      <FinanceRevenueExpenseTooltipContent payload={mockPayload} label="Jan" hoveredKey={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when no matching data is found', () => {
    const { container } = render(
      <FinanceRevenueExpenseTooltipContent
        payload={mockPayload}
        label="Jan"
        hoveredKey={'nonexistent' as any}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render revenue tooltip correctly', () => {
    render(
      <FinanceRevenueExpenseTooltipContent payload={mockPayload} label="Jan" hoveredKey="revenue" />
    );

    // Check tooltip container
    const tooltip = screen.getByText(/REVENUE \(Jan\):/);
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass('text-sm', 'text-white', 'mb-2');

    // Check formatted value
    expect(screen.getByText('CHF 25,000')).toBeInTheDocument();
  });

  it('should render expenses tooltip correctly', () => {
    render(
      <FinanceRevenueExpenseTooltipContent
        payload={mockPayload}
        label="Feb"
        hoveredKey="expenses"
      />
    );

    // Check tooltip container
    const tooltip = screen.getByText(/EXPENSES \(Feb\):/);
    expect(tooltip).toBeInTheDocument();

    // Check formatted value
    expect(screen.getByText('CHF 9,000')).toBeInTheDocument();
  });

  it('should render tooltip with correct styling', () => {
    const { container } = render(
      <FinanceRevenueExpenseTooltipContent payload={mockPayload} label="Jan" hoveredKey="revenue" />
    );

    const tooltipContainer = container.firstChild as HTMLElement;
    expect(tooltipContainer).toHaveClass('rounded-md', 'bg-neutral-700', 'p-3', 'shadow-lg');
  });

  it('should render color indicator correctly', () => {
    render(
      <FinanceRevenueExpenseTooltipContent payload={mockPayload} label="Jan" hoveredKey="revenue" />
    );

    const colorIndicator = screen.getByText('CHF 25,000').previousElementSibling;
    expect(colorIndicator).toHaveClass('inline-block', 'w-3', 'h-3', 'rounded-sm', 'mr-2');
    expect(colorIndicator).toHaveStyle({ backgroundColor: 'hsl(var(--secondary-600))' });
  });

  it('should handle zero value correctly', () => {
    const zeroPayload = [
      {
        dataKey: 'revenue',
        value: 0,
        name: 'REVENUE',
      },
    ];

    render(
      <FinanceRevenueExpenseTooltipContent payload={zeroPayload} label="Jan" hoveredKey="revenue" />
    );

    expect(screen.getByText('CHF 0')).toBeInTheDocument();
  });

  it('should handle undefined value correctly', () => {
    const undefinedPayload = [
      {
        dataKey: 'revenue',
        value: undefined,
        name: 'REVENUE',
      },
    ];

    render(
      <FinanceRevenueExpenseTooltipContent
        payload={undefinedPayload}
        label="Jan"
        hoveredKey="revenue"
      />
    );

    expect(screen.getByText('CHF 0')).toBeInTheDocument();
  });

  it('should export component correctly', () => {
    expect(FinanceRevenueExpenseTooltipContent).toBeDefined();
    expect(typeof FinanceRevenueExpenseTooltipContent).toBe('function');
  });
});
