import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Users } from 'lucide-react';
import { DashboardMetricCard } from './dashboard-metric-card';

// Import shared test utilities (provides react-i18next, card, select mocks)
import '../../../../lib/utils/test-utils/shared-test-utils';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  TrendingUp: ({ className }: any) => <div data-testid="trending-up-icon" className={className} />,
  Users: ({ className }: any) => <div data-testid="users-icon" className={className} />,
}));

describe('DashboardMetricCard', () => {
  const defaultProps = {
    title: 'Total Users',
    value: '1,234',
    trend: '+12%',
    trendLabel: 'from last month',
    icon: Users,
    iconColor: 'text-primary',
    bgColor: 'bg-primary-100',
  };

  test('renders metric card with all required props', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    // Test title is displayed
    expect(screen.getByText('Total Users')).toBeInTheDocument();

    // Test value is displayed
    expect(screen.getByText('1,234')).toBeInTheDocument();

    // Test trend is displayed
    expect(screen.getByText('+12%')).toBeInTheDocument();

    // Test trend label is displayed
    expect(screen.getByText('from last month')).toBeInTheDocument();
  });

  test('renders title with correct styling', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    const title = screen.getByText('Total Users');
    expect(title).toHaveClass('text-sm', 'font-normal', 'text-high-emphasis');
    expect(title.tagName).toBe('H3');
  });

  test('renders value with correct styling', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    const value = screen.getByText('1,234');
    expect(value).toHaveClass('text-[32px]', 'font-semibold', 'text-high-emphasis');
    expect(value.tagName).toBe('H1');
  });

  test('renders trend section with correct elements', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    // Test trending up icon
    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trending-up-icon')).toHaveClass('h-4', 'w-4', 'text-success');

    // Test trend percentage
    const trendText = screen.getByText('+12%');
    expect(trendText).toHaveClass('text-sm', 'text-success', 'font-semibold');

    // Test trend label
    const trendLabel = screen.getByText('from last month');
    expect(trendLabel).toHaveClass('text-sm', 'text-medium-emphasis');
  });

  test('renders custom icon with correct styling', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    // Test custom icon is rendered
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toHaveClass('h-7', 'w-7', 'text-primary');
  });

  test('renders icon container with correct styling', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    const iconContainer = screen.getByTestId('users-icon').parentElement;
    expect(iconContainer).toHaveClass(
      'flex',
      'h-14',
      'w-14',
      'bg-primary-100',
      'rounded-[4px]',
      'items-center',
      'justify-center'
    );
  });

  test('renders with correct layout structure', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    // Get the root container (parent of the div containing the title)
    const container = screen.getByText('Total Users').closest('div')?.parentElement;
    expect(container).toHaveClass(
      'flex',
      'justify-between',
      'hover:bg-primary-50',
      'hover:rounded-[4px]',
      'cursor-pointer',
      'p-2'
    );
  });

  test('renders trend container with correct layout', () => {
    render(<DashboardMetricCard {...defaultProps} />);

    const trendContainer = screen.getByTestId('trending-up-icon').parentElement;
    expect(trendContainer).toHaveClass('flex', 'gap-1', 'items-center');
  });

  test('renders with numeric value', () => {
    const numericProps = {
      ...defaultProps,
      value: 5678,
    };

    render(<DashboardMetricCard {...numericProps} />);
    expect(screen.getByText('5678')).toBeInTheDocument();
  });

  test('renders with different icon colors and background', () => {
    const customStyleProps = {
      ...defaultProps,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
    };

    render(<DashboardMetricCard {...customStyleProps} />);

    const icon = screen.getByTestId('users-icon');
    expect(icon).toHaveClass('text-red-500');

    const iconContainer = icon.parentElement;
    expect(iconContainer).toHaveClass('bg-red-100');
  });

  test('renders with different trend values', () => {
    const negativeTrendProps = {
      ...defaultProps,
      trend: '-5%',
      trendLabel: 'from last week',
    };

    render(<DashboardMetricCard {...negativeTrendProps} />);

    expect(screen.getByText('-5%')).toBeInTheDocument();
    expect(screen.getByText('from last week')).toBeInTheDocument();
  });

  test('renders with long title and value', () => {
    const longContentProps = {
      ...defaultProps,
      title: 'Total Active Users This Month',
      value: '1,234,567',
    };

    render(<DashboardMetricCard {...longContentProps} />);

    expect(screen.getByText('Total Active Users This Month')).toBeInTheDocument();
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });
});
