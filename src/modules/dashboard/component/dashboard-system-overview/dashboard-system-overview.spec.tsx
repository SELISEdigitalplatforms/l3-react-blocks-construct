import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import '../../../../lib/utils/test-utils/shared-test-utils';
import { DashboardSystemOverview } from './dashboard-system-overview';

vi.mock(
  '../dashboard-system-overview-statistic-item/dashboard-system-overview-statistic-item',
  () => ({
    DashboardSystemOverviewStatisticItem: ({ stat, t }: any) => (
      <div data-testid="statistic-item" data-title={stat.title} data-value={stat.value}>
        <span data-testid="stat-title">{t(stat.title)}</span>
        <span data-testid="stat-value">{stat.value}</span>
        <span data-testid="stat-percentage">{stat.percentage}</span>
      </div>
    ),
  })
);

// Mock dashboard service data
vi.mock('../../services/dashboard-service', () => ({
  statsData: [
    {
      title: 'CPU_USAGE',
      value: '75%',
      max: '100%',
      percentage: 75,
      strokeColor: 'text-primary',
    },
    {
      title: 'MEMORY_USAGE',
      value: '8 GB',
      max: '16 GB',
      percentage: 50,
      strokeColor: 'text-success',
    },
    {
      title: 'BANDWIDTH',
      value: '2.5 GB',
      max: 'UNLIMITED',
      percentage: 25,
      strokeColor: 'text-warning',
    },
  ],
  daysOfWeek: [
    { value: 'monday', label: 'MONDAY' },
    { value: 'tuesday', label: 'TUESDAY' },
    { value: 'wednesday', label: 'WEDNESDAY' },
    { value: 'thursday', label: 'THURSDAY' },
    { value: 'friday', label: 'FRIDAY' },
    { value: 'saturday', label: 'SATURDAY' },
    { value: 'sunday', label: 'SUNDAY' },
  ],
}));

describe('DashboardSystemOverview', () => {
  test('renders system overview with title', () => {
    render(<DashboardSystemOverview />);

    // Test title is displayed
    expect(screen.getByText('SYSTEM_USAGE_OVERVIEW')).toBeInTheDocument();

    // Test title has correct styling classes
    const title = screen.getByTestId('card-title');
    expect(title).toHaveClass('text-xl', 'text-high-emphasis');
  });

  test('renders day selector with correct attributes', () => {
    render(<DashboardSystemOverview />);

    // Test select trigger exists
    const selectTrigger = screen.getByTestId('select-trigger');
    expect(selectTrigger).toBeInTheDocument();

    // Test select trigger styling
    expect(selectTrigger).toHaveClass('w-[120px]', 'h-[28px]', 'px-2', 'py-1');

    // Test select value placeholder
    const selectValue = screen.getByTestId('select-value');
    expect(selectValue).toHaveTextContent('TODAY');
  });

  test('renders all day options in select dropdown', () => {
    render(<DashboardSystemOverview />);

    // Test all day options are rendered
    const selectItems = screen.getAllByTestId('select-item');
    expect(selectItems).toHaveLength(7);

    // Test specific day options
    expect(screen.getByText('MONDAY')).toBeInTheDocument();
    expect(screen.getByText('TUESDAY')).toBeInTheDocument();
    expect(screen.getByText('WEDNESDAY')).toBeInTheDocument();
    expect(screen.getByText('THURSDAY')).toBeInTheDocument();
    expect(screen.getByText('FRIDAY')).toBeInTheDocument();
    expect(screen.getByText('SATURDAY')).toBeInTheDocument();
    expect(screen.getByText('SUNDAY')).toBeInTheDocument();
  });

  test('renders all statistic items', () => {
    render(<DashboardSystemOverview />);

    // Test all statistic items are rendered
    const statisticItems = screen.getAllByTestId('statistic-item');
    expect(statisticItems).toHaveLength(3);

    // Test specific statistic items
    expect(screen.getByText('CPU_USAGE')).toBeInTheDocument();
    expect(screen.getByText('MEMORY_USAGE')).toBeInTheDocument();
    expect(screen.getByText('BANDWIDTH')).toBeInTheDocument();
  });

  test('renders card with correct styling', () => {
    render(<DashboardSystemOverview />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');
  });

  test('renders header with correct layout structure', () => {
    render(<DashboardSystemOverview />);

    const cardHeader = screen.getByTestId('card-header');
    expect(cardHeader).toBeInTheDocument();

    // Test header container structure
    const headerContainer = screen.getByText('SYSTEM_USAGE_OVERVIEW').parentElement;
    expect(headerContainer).toHaveClass('flex', 'items-center', 'justify-between');
  });

  test('renders content with correct grid layout', () => {
    render(<DashboardSystemOverview />);

    const cardContent = screen.getByTestId('card-content');
    expect(cardContent).toBeInTheDocument();

    // Test grid container
    const gridContainer = screen.getAllByTestId('statistic-item')[0].parentElement;
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
      'gap-6'
    );
  });

  test('passes correct props to statistic items', () => {
    render(<DashboardSystemOverview />);

    // Test CPU usage item using getAllByTestId
    const statisticItems = screen.getAllByTestId('statistic-item');
    const cpuItem = statisticItems.find((item) => item.getAttribute('data-title') === 'CPU_USAGE');
    expect(cpuItem).toHaveAttribute('data-title', 'CPU_USAGE');
    expect(cpuItem).toHaveAttribute('data-value', '75%');

    // Test all statistic values are present
    const statValues = screen.getAllByTestId('stat-value');
    expect(statValues).toHaveLength(3);
    expect(statValues[0]).toHaveTextContent('75%');
    expect(statValues[1]).toHaveTextContent('8 GB');
    expect(statValues[2]).toHaveTextContent('2.5 GB');
  });

  test('renders select components in correct order', () => {
    render(<DashboardSystemOverview />);

    // Test select structure
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('select-content')).toBeInTheDocument();
    expect(screen.getByTestId('select-group')).toBeInTheDocument();
  });

  test('renders card description component', () => {
    render(<DashboardSystemOverview />);

    const cardDescription = screen.getByTestId('card-description');
    expect(cardDescription).toBeInTheDocument();
  });
});
