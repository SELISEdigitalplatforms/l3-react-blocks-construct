import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogTimeline } from './activity-log-timeline';
import { ActivityGroup } from '../../types/activity-log.types';
import { useInfiniteScroll } from '../../hooks/use-infinite-scroll';
import '../../../../test-utils/shared-test-utils';

// Mock dependencies
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('../activity-log-group/activity-log-group', () => ({
  ActivityLogGroup: ({
    date,
    items,
    isLastIndex,
  }: {
    date: string;
    items: any[];
    isLastIndex: boolean;
  }) => (
    <div data-testid="activity-log-group" data-date={date} data-is-last={isLastIndex}>
      <div data-testid="group-date">{date}</div>
      <div data-testid="group-items-count">{items.length}</div>
    </div>
  ),
}));

vi.mock('../../hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: vi.fn((totalItems: number) => ({
    visibleCount: Math.min(totalItems, 5), // Default batch size
    containerRef: { current: null },
  })),
}));

// Mock the illustration asset
vi.mock('@/assets/images/Illustration.svg', () => ({
  default: 'mocked-illustration.svg',
}));

// Test data
const mockActivityGroups: ActivityGroup[] = [
  {
    date: '2024-01-15',
    items: [
      {
        time: '10:30',
        category: 'system',
        description: 'User logged in successfully',
      },
      {
        time: '11:45',
        category: 'task',
        description: 'Task completed: Review documents',
      },
    ],
  },
  {
    date: '2024-01-14',
    items: [
      {
        time: '14:20',
        category: 'notification',
        description: 'New message received',
      },
    ],
  },
  {
    date: '2024-01-13',
    items: [
      {
        time: '09:15',
        category: 'meeting',
        description: 'Team standup completed',
      },
    ],
  },
];

describe('ActivityLogTimeline V1', () => {
  const mockUseInfiniteScroll = vi.mocked(useInfiniteScroll);

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default behavior
    mockUseInfiniteScroll.mockImplementation((totalItems: number) => ({
      visibleCount: Math.min(totalItems, 5),
      containerRef: { current: null },
    }));
  });

  describe('Empty State', () => {
    it('should render empty state when no activities provided', () => {
      render(<ActivityLogTimeline activities={[]} />);

      // Should show illustration (using presentation role since alt="")
      const illustration = screen.getByRole('presentation');
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute('src', 'mocked-illustration.svg');
      expect(illustration).toHaveAttribute('alt', '');
      expect(illustration).toHaveClass('h-[160px]', 'w-[240px]');

      // Should show empty message
      expect(screen.getByText('COULDNT_FIND_ANYTHING_MATCHING')).toBeInTheDocument();

      // Should not render Card component
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('should render empty state with correct styling', () => {
      const { container } = render(<ActivityLogTimeline activities={[]} />);

      const emptyStateContainer = container.querySelector(
        '.flex.h-full.w-full.flex-col.gap-6.items-center.justify-center.p-8.text-center'
      );
      expect(emptyStateContainer).toBeInTheDocument();

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveClass('text-xl', 'font-medium');
    });
  });

  describe('Timeline with Activities', () => {
    it('should render Card component when activities are provided', () => {
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');
    });

    it('should render scrollable container with correct styling', () => {
      const { container } = render(<ActivityLogTimeline activities={mockActivityGroups} />);

      const scrollContainer = container.querySelector(
        '.px-12.py-8.h-\\[800px\\].overflow-y-auto.scrollbar-hide'
      );
      expect(scrollContainer).toBeInTheDocument();
    });

    it('should render timeline visual indicator', () => {
      const { container } = render(<ActivityLogTimeline activities={mockActivityGroups} />);

      // Main timeline line
      const timelineLine = container.querySelector(
        '.absolute.left-1\\.5.-ml-6.top-0.bottom-0.w-0\\.5.bg-gray-200'
      );
      expect(timelineLine).toBeInTheDocument();

      // Top fade
      const topFade = container.querySelector('.absolute.top-0.h-12.w-0\\.5.bg-white');
      expect(topFade).toBeInTheDocument();

      // Bottom fade
      const bottomFade = container.querySelector('.absolute.bottom-0.h-8.w-0\\.5.bg-white');
      expect(bottomFade).toBeInTheDocument();
    });
  });

  describe('Activity Groups Rendering', () => {
    it('should render all activity groups', () => {
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(3);

      // Verify each group is rendered with correct date
      expect(activityGroups[0]).toHaveAttribute('data-date', '2024-01-15');
      expect(activityGroups[1]).toHaveAttribute('data-date', '2024-01-14');
      expect(activityGroups[2]).toHaveAttribute('data-date', '2024-01-13');
    });

    it('should pass correct isLastIndex prop to groups', () => {
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');

      // Only the last group should have isLastIndex=true
      expect(activityGroups[0]).toHaveAttribute('data-is-last', 'false');
      expect(activityGroups[1]).toHaveAttribute('data-is-last', 'false');
      expect(activityGroups[2]).toHaveAttribute('data-is-last', 'true');
    });

    it('should render group dates and item counts correctly', () => {
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      // Check dates are displayed
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('2024-01-14')).toBeInTheDocument();
      expect(screen.getByText('2024-01-13')).toBeInTheDocument();

      // Check item counts (from our mock)
      const itemCounts = screen.getAllByTestId('group-items-count');
      expect(itemCounts[0]).toHaveTextContent('2'); // First group has 2 items
      expect(itemCounts[1]).toHaveTextContent('1'); // Second group has 1 item
      expect(itemCounts[2]).toHaveTextContent('1'); // Third group has 1 item
    });
  });

  describe('Infinite Scroll Integration', () => {
    it('should call useInfiniteScroll hook with correct parameters', () => {
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      expect(mockUseInfiniteScroll).toHaveBeenCalledTimes(1);
      expect(mockUseInfiniteScroll).toHaveBeenCalledWith(3);
    });

    it('should render only visible activities based on visibleCount', () => {
      // Mock to show only 2 activities
      mockUseInfiniteScroll.mockReturnValue({
        visibleCount: 2,
        containerRef: { current: null },
      });

      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(2); // Only first 2 should be visible
      expect(activityGroups[0]).toHaveAttribute('data-date', '2024-01-15');
      expect(activityGroups[1]).toHaveAttribute('data-date', '2024-01-14');
    });

    it('should handle large number of activities', () => {
      const largeActivityList = Array.from({ length: 20 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        items: [{ time: '10:00', category: 'test', description: `Activity ${i + 1}` }],
      }));

      render(<ActivityLogTimeline activities={largeActivityList} />);

      // Should call useInfiniteScroll with total count
      expect(mockUseInfiniteScroll).toHaveBeenCalledTimes(1);
      expect(mockUseInfiniteScroll).toHaveBeenCalledWith(20);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single activity group', () => {
      const singleGroup = [mockActivityGroups[0]];
      render(<ActivityLogTimeline activities={singleGroup} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(1);
      expect(activityGroups[0]).toHaveAttribute('data-is-last', 'true');
    });

    it('should handle activities with no items', () => {
      const emptyItemsGroup = [
        {
          date: '2024-01-15',
          items: [],
        },
      ];

      render(<ActivityLogTimeline activities={emptyItemsGroup} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(1);

      const itemCount = screen.getByTestId('group-items-count');
      expect(itemCount).toHaveTextContent('0');
    });

    it('should use translation for empty state message', () => {
      render(<ActivityLogTimeline activities={[]} />);

      // The translation mock should return the key as-is
      expect(screen.getByText('COULDNT_FIND_ANYTHING_MATCHING')).toBeInTheDocument();
    });
  });
});
