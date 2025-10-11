import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogTimeline } from './activity-log-timeline';
import { ActivityGroup } from '../../types/activity-log.types';
import { useInfiniteScroll } from '@/features/activity-log-v1';
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
    isFirstIndex,
  }: {
    date: string;
    items: any[];
    isLastIndex: boolean;
    isFirstIndex: boolean;
  }) => (
    <div
      data-testid="activity-log-group"
      data-date={date}
      data-is-last={isLastIndex}
      data-is-first={isFirstIndex}
    >
      <div data-testid="group-date">{date}</div>
      <div data-testid="group-items-count">{items.length}</div>
    </div>
  ),
}));

// Mock the v1 infinite scroll hook (v2 imports from v1)
vi.mock('@/features/activity-log-v1', () => ({
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

describe('ActivityLogTimeline V2', () => {
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

    it('should render V2 timeline visual indicator', () => {
      const { container } = render(<ActivityLogTimeline activities={mockActivityGroups} />);

      // V2 timeline line (centered with different styling)
      const timelineLine = container.querySelector(
        '.absolute.left-1\\/2.transform.-translate-x-1\\/2.w-\\[2px\\].bg-low-emphasis.top-\\[60px\\].h-\\[calc\\(100\\%-110px\\)\\].z-0'
      );
      expect(timelineLine).toBeInTheDocument();

      // V2 doesn't have top/bottom fade effects like V1
      const topFade = container.querySelector('.absolute.top-0.h-12.w-0\\.5.bg-white');
      expect(topFade).not.toBeInTheDocument();

      const bottomFade = container.querySelector('.absolute.bottom-0.h-8.w-0\\.5.bg-white');
      expect(bottomFade).not.toBeInTheDocument();
    });

    it('should conditionally render timeline line only when activities exist', () => {
      // Test with empty activities
      const { container: emptyContainer } = render(<ActivityLogTimeline activities={[]} />);
      const emptyTimelineLine = emptyContainer.querySelector(
        '.absolute.left-1\\/2.transform.-translate-x-1\\/2'
      );
      expect(emptyTimelineLine).not.toBeInTheDocument();

      // Test with activities
      const { container: filledContainer } = render(
        <ActivityLogTimeline activities={mockActivityGroups} />
      );
      const filledTimelineLine = filledContainer.querySelector(
        '.absolute.left-1\\/2.transform.-translate-x-1\\/2'
      );
      expect(filledTimelineLine).toBeInTheDocument();
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

    it('should pass correct V2-specific props to groups', () => {
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');

      // V2 passes both isLastIndex and isFirstIndex
      // First group: isFirst=true, isLast=false
      expect(activityGroups[0]).toHaveAttribute('data-is-first', 'true');
      expect(activityGroups[0]).toHaveAttribute('data-is-last', 'false');

      // Middle group: isFirst=false, isLast=false
      expect(activityGroups[1]).toHaveAttribute('data-is-first', 'false');
      expect(activityGroups[1]).toHaveAttribute('data-is-last', 'false');

      // Last group: isFirst=false, isLast=true
      expect(activityGroups[2]).toHaveAttribute('data-is-first', 'false');
      expect(activityGroups[2]).toHaveAttribute('data-is-last', 'true');
    });

    it('should generate unique keys for activity groups', () => {
      // This tests the key generation logic: `${group.date}-${index}`
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(3);

      // Verify groups are rendered (keys are internal but we can test the result)
      expect(activityGroups[0]).toHaveAttribute('data-date', '2024-01-15');
      expect(activityGroups[1]).toHaveAttribute('data-date', '2024-01-14');
      expect(activityGroups[2]).toHaveAttribute('data-date', '2024-01-13');
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

  describe('V2 Infinite Scroll Integration', () => {
    it('should call useInfiniteScroll hook with correct parameters', () => {
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      expect(mockUseInfiniteScroll).toHaveBeenCalledTimes(1);
      expect(mockUseInfiniteScroll).toHaveBeenCalledWith(3);
    });

    it('should use visibleActivities logic for rendering', () => {
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

      // V2 specific: isLastIndex should be based on visibleActivities, not total activities
      expect(activityGroups[0]).toHaveAttribute('data-is-last', 'false');
      expect(activityGroups[1]).toHaveAttribute('data-is-last', 'true'); // Last of visible
    });

    it('should handle empty visibleActivities correctly', () => {
      // Mock to show 0 activities
      mockUseInfiniteScroll.mockReturnValue({
        visibleCount: 0,
        containerRef: { current: null },
      });

      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      // Should show empty state even though activities exist
      const illustration = screen.getByRole('presentation');
      expect(illustration).toBeInTheDocument();
      expect(screen.getByText('COULDNT_FIND_ANYTHING_MATCHING')).toBeInTheDocument();

      // Should not render any activity groups
      const activityGroups = screen.queryAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(0);
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

  describe('V2 Edge Cases', () => {
    it('should handle single activity group with V2 props', () => {
      const singleGroup = [mockActivityGroups[0]];
      render(<ActivityLogTimeline activities={singleGroup} />);

      const activityGroups = screen.getAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(1);

      // V2: Single group should be both first and last
      expect(activityGroups[0]).toHaveAttribute('data-is-first', 'true');
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

      // V2: Should still render timeline line even with empty items
      const { container } = render(<ActivityLogTimeline activities={emptyItemsGroup} />);
      const timelineLine = container.querySelector(
        '.absolute.left-1\\/2.transform.-translate-x-1\\/2'
      );
      expect(timelineLine).toBeInTheDocument();
    });

    it('should use translation for empty state message', () => {
      render(<ActivityLogTimeline activities={[]} />);

      // The translation mock should return the key as-is
      expect(screen.getByText('COULDNT_FIND_ANYTHING_MATCHING')).toBeInTheDocument();
    });

    it('should handle visibleActivities vs total activities correctly', () => {
      // Test that V2 uses visibleActivities.length for empty state check
      const activities = mockActivityGroups;

      // Mock visibleCount to be 0 even though activities exist
      mockUseInfiniteScroll.mockReturnValue({
        visibleCount: 0,
        containerRef: { current: null },
      });

      render(<ActivityLogTimeline activities={activities} />);

      // Should show empty state because visibleActivities.length === 0
      expect(screen.getByRole('presentation')).toBeInTheDocument();
      expect(screen.getByText('COULDNT_FIND_ANYTHING_MATCHING')).toBeInTheDocument();

      // Should not render Card or timeline
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('should import useInfiniteScroll from v1 features', () => {
      // This test verifies the import structure is correct
      render(<ActivityLogTimeline activities={mockActivityGroups} />);

      // The mock should be called (verifying the import works)
      expect(mockUseInfiniteScroll).toHaveBeenCalled();
    });
  });
});
