import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DashboardSystemOverviewStatisticItem, type Statistic } from './dashboard-system-overview-statistic-item';

// Mock CircularProgress component
vi.mock('../circular-progress/circular-progress', () => ({
  CircularProgress: ({ percentage, strokeColor }: { percentage: number; strokeColor: string }) => (
    <div 
      data-testid="circular-progress" 
      data-percentage={percentage}
      data-stroke-color={strokeColor}
    />
  ),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DashboardSystemOverviewStatisticItem', () => {
  const mockT = vi.fn((key: string) => key);

  const defaultStat: Statistic = {
    title: 'CPU_USAGE',
    value: '75%',
    max: '100%',
    percentage: 75,
    strokeColor: 'text-primary',
  };

  const defaultProps = {
    stat: defaultStat,
    t: mockT,
  };

  beforeEach(() => {
    mockT.mockClear();
  });

  test('renders statistic item with all required props', () => {
    render(<DashboardSystemOverviewStatisticItem {...defaultProps} />);

    // Test title is displayed and translated
    expect(screen.getByText('CPU_USAGE')).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('CPU_USAGE');
    
    // Test value is displayed
    expect(screen.getByText('75%')).toBeInTheDocument();
    
    // Test max value is displayed (text is split across elements)
    expect(screen.getByText('/', { exact: false })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === ' /100%';
    })).toBeInTheDocument();
  });

  test('renders title with correct styling', () => {
    render(<DashboardSystemOverviewStatisticItem {...defaultProps} />);

    const title = screen.getByText('CPU_USAGE');
    expect(title).toHaveClass('text-sm', 'font-normal', 'text-high-emphasis');
    expect(title.tagName).toBe('H3');
  });

  test('renders value with correct styling', () => {
    render(<DashboardSystemOverviewStatisticItem {...defaultProps} />);

    const value = screen.getByText('75%');
    expect(value).toHaveClass('text-[24px]', 'font-semibold', 'text-high-emphasis');
  });

  test('renders max value with correct styling', () => {
    render(<DashboardSystemOverviewStatisticItem {...defaultProps} />);

    // Find the span containing the max value (text is split across elements)
    const maxValueSpan = screen.getByText((content, element) => {
      return element?.textContent === ' /100%';
    });
    expect(maxValueSpan).toHaveClass('text-sm', 'text-medium-emphasis');
  });

  test('renders circular progress with correct props', () => {
    render(<DashboardSystemOverviewStatisticItem {...defaultProps} />);
    
    const circularProgress = screen.getByTestId('circular-progress');
    expect(circularProgress).toBeInTheDocument();
    expect(circularProgress).toHaveAttribute('data-percentage', '75');
    expect(circularProgress).toHaveAttribute('data-stroke-color', 'text-primary');
  });

  test('renders with correct layout structure', () => {
    render(<DashboardSystemOverviewStatisticItem {...defaultProps} />);

    const container = screen.getByText('CPU_USAGE').closest('div')?.parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'gap-6', 'sm:gap-4');
  });

  test('renders with numeric value', () => {
    const numericStat: Statistic = {
      ...defaultStat,
      value: 1024,
    };

    render(<DashboardSystemOverviewStatisticItem stat={numericStat} t={mockT} />);
    expect(screen.getByText('1024')).toBeInTheDocument();
  });

  test('renders with different stroke colors', () => {
    const colorStat: Statistic = {
      ...defaultStat,
      strokeColor: 'text-success',
    };

    render(<DashboardSystemOverviewStatisticItem stat={colorStat} t={mockT} />);
    
    const circularProgress = screen.getByTestId('circular-progress');
    expect(circularProgress).toHaveAttribute('data-stroke-color', 'text-success');
  });

  test('handles BANDWIDTH title with translation for max value', () => {
    const bandwidthStat: Statistic = {
      title: 'BANDWIDTH',
      value: '2.5 GB',
      max: 'UNLIMITED',
      percentage: 25,
      strokeColor: 'text-warning',
    };

    render(<DashboardSystemOverviewStatisticItem stat={bandwidthStat} t={mockT} />);

    // Test that max value is translated when title is BANDWIDTH
    expect(mockT).toHaveBeenCalledWith('BANDWIDTH');
    expect(mockT).toHaveBeenCalledWith('UNLIMITED');
    expect(screen.getByText('/', { exact: false })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === ' /UNLIMITED';
    })).toBeInTheDocument();
  });

  test('handles non-BANDWIDTH title without translating max value', () => {
    const memoryStat: Statistic = {
      title: 'MEMORY_USAGE',
      value: '8 GB',
      max: '16 GB',
      percentage: 50,
      strokeColor: 'text-info',
    };

    render(<DashboardSystemOverviewStatisticItem stat={memoryStat} t={mockT} />);

    // Test that max value is not translated when title is not BANDWIDTH
    expect(mockT).toHaveBeenCalledWith('MEMORY_USAGE');
    expect(mockT).not.toHaveBeenCalledWith('16 GB');
    expect(screen.getByText('/', { exact: false })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === ' /16 GB';
    })).toBeInTheDocument();
  });

  test('renders with different percentage values', () => {
    const highPercentageStat: Statistic = {
      ...defaultStat,
      percentage: 95,
    };

    render(<DashboardSystemOverviewStatisticItem stat={highPercentageStat} t={mockT} />);
    
    const circularProgress = screen.getByTestId('circular-progress');
    expect(circularProgress).toHaveAttribute('data-percentage', '95');
  });

  test('renders with long title and value', () => {
    const longContentStat: Statistic = {
      title: 'Total Active Users This Month',
      value: '1,234,567',
      max: 'UNLIMITED',
      percentage: 25,
      strokeColor: 'text-warning',
    };

    render(<DashboardSystemOverviewStatisticItem stat={longContentStat} t={mockT} />);
    
    expect(screen.getByText('Total Active Users This Month')).toBeInTheDocument();
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });
});
