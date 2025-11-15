import { render, screen } from '@testing-library/react';
import { DashboardOverview } from './dashboard-overview';
import { vi } from 'vitest';
import '../../../../lib/utils/test-utils/shared-test-utils';

vi.mock('lucide-react', () => ({
  TrendingUp: ({ className }: { className?: string }) => (
    <svg data-testid="icon-trending-up" className={`lucide-trending-up ${className ?? ''}`} />
  ),
  Users: ({ className }: { className?: string }) => (
    <svg data-testid="icon-users" className={`lucide-users ${className ?? ''}`} />
  ),
  UserCog: ({ className }: { className?: string }) => (
    <svg data-testid="icon-user-cog" className={`lucide-user-cog ${className ?? ''}`} />
  ),
  UserPlus: ({ className }: { className?: string }) => (
    <svg data-testid="icon-user-plus" className={`lucide-user-plus ${className ?? ''}`} />
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-down" className={`lucide-chevron-down ${className ?? ''}`} />
  ),
  ChevronUp: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-up" className={`lucide-chevron-up ${className ?? ''}`} />
  ),
  Check: ({ className }: { className?: string }) => (
    <svg data-testid="icon-check" className={`lucide-check ${className ?? ''}`} />
  ),
}));

vi.mock('../../services/dashboard-service', () => ({
  monthsOfYear: Array.from({ length: 12 }, (_, i) => ({
    value: new Date(0, i).toLocaleString('en', { month: 'long' }).toLowerCase(),
    label: new Date(0, i).toLocaleString('en', { month: 'long' }),
  })),
  metricsConfigData: [
    {
      id: 'total-users',
      title: 'TOTAL_USERS',
      value: '10,000',
      trend: '+2.5%',
      icon: ({ className }: { className?: string }) => (
        <svg data-testid="icon-users" className={className} />
      ),
      iconColor: 'text-chart-500',
      bgColor: 'bg-surface',
    },
    {
      id: 'active-users',
      title: 'TOTAL_ACTIVE_USERS',
      value: '7,000',
      trend: '+5%',
      icon: ({ className }: { className?: string }) => (
        <svg data-testid="icon-user-cog" className={className} />
      ),
      iconColor: 'text-secondary',
      bgColor: 'bg-surface',
    },
    {
      id: 'new-signups',
      title: 'NEW_SIGN_UPS',
      value: '1,200',
      trend: '+8%',
      icon: ({ className }: { className?: string }) => (
        <svg data-testid="icon-user-plus" className={className} />
      ),
      iconColor: 'text-green',
      bgColor: 'bg-surface',
    },
  ],
}));

const expectMetricToBeRendered = (
  title: string,
  value: string,
  trend: string,
  iconTestId: string
) => {
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByText(value)).toBeInTheDocument();
  expect(screen.getByText(trend)).toBeInTheDocument();
  expect(screen.getByTestId(iconTestId)).toBeInTheDocument();
};

describe('DashboardOverview Component', () => {
  beforeEach(() => {
    render(<DashboardOverview />);
  });

  test('renders the card with overview title and month selector', () => {
    expect(screen.getAllByText('OVERVIEW')[0]).toBeInTheDocument();
    expect(screen.getAllByText('THIS_MONTH')[0]).toBeInTheDocument();
  });

  test('renders all metrics with correct details', () => {
    expectMetricToBeRendered('TOTAL_USERS', '10,000', '+2.5%', 'icon-users');
    expectMetricToBeRendered('TOTAL_ACTIVE_USERS', '7,000', '+5%', 'icon-user-cog');
    expectMetricToBeRendered('NEW_SIGN_UPS', '1,200', '+8%', 'icon-user-plus');

    expect(screen.getAllByText('FROM_LAST_MONTH')).toHaveLength(3);
    expect(screen.getAllByTestId('icon-trending-up')).toHaveLength(3);
  });
});
