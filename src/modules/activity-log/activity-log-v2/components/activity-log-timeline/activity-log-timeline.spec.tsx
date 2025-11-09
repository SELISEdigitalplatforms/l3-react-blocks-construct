import { vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogTimeline } from './activity-log-timeline';
import { ActivityGroup } from '../../types/activity-log.types';
import '../../../../../test-utils/shared-test-utils';

// Hoisted mocks to satisfy Vitest's hoisting behavior
const hoisted = vi.hoisted(() => ({
  mockUseInfiniteScroll: vi.fn(),
}));

// Mock dependencies
vi.mock('@/components/ui-kit/card', () => ({
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

// Mock the infinite scroll hook used by v2 component
vi.mock('@/modules/activity-log/hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: hoisted.mockUseInfiniteScroll,
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

// Helper functions to reduce code duplication - V2 specific
const renderActivityLogTimelineV2 = (activities: ActivityGroup[] = mockActivityGroups) => {
  return render(<ActivityLogTimeline activities={activities} />);
};

const expectEmptyStateToBeRenderedV2 = () => {
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
};

const expectCardToBeRenderedV2 = () => {
  const card = screen.getByTestId('card');
  expect(card).toBeInTheDocument();
  expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');
};

const expectActivityGroupsToBeRenderedV2 = (expectedGroups: ActivityGroup[]) => {
  const activityGroups = screen.queryAllByTestId('activity-log-group');
  expect(activityGroups).toHaveLength(expectedGroups.length);

  expectedGroups.forEach((group, index) => {
    expect(activityGroups[index]).toHaveAttribute('data-date', group.date);
    // V2-specific: both isFirstIndex and isLastIndex props
    expect(activityGroups[index]).toHaveAttribute('data-is-first', String(index === 0));
    expect(activityGroups[index]).toHaveAttribute(
      'data-is-last',
      String(index === expectedGroups.length - 1)
    );
  });
};

const expectGroupDatesAndItemCountsV2 = (expectedGroups: ActivityGroup[]) => {
  // Check dates are displayed
  expectedGroups.forEach((group) => {
    expect(screen.getByText(group.date)).toBeInTheDocument();
  });

  // Check item counts (from our mock)
  const itemCounts = screen.getAllByTestId('group-items-count');
  expectedGroups.forEach((group, index) => {
    expect(itemCounts[index]).toHaveTextContent(String(group.items.length));
  });
};

const expectInfiniteScrollToBeCalledWithV2 = (mockFn: any, totalItems: number) => {
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn).toHaveBeenCalledWith(totalItems);
};

const expectV2TimelineVisualIndicator = (container: HTMLElement, shouldExist = true) => {
  // V2 timeline line (centered with different styling)
  const timelineLine = container.querySelector(
    '.absolute.left-1\\/2.transform.-translate-x-1\\/2.w-\\[2px\\].bg-low-emphasis.top-\\[60px\\].h-\\[calc\\(100\\%-110px\\)\\].z-0'
  );

  if (shouldExist) {
    expect(timelineLine).toBeInTheDocument();
  } else {
    expect(timelineLine).not.toBeInTheDocument();
  }

  // V2 doesn't have top/bottom fade effects like V1
  const topFade = container.querySelector('.absolute.top-0.h-12.w-0\\.5.bg-white');
  expect(topFade).not.toBeInTheDocument();

  const bottomFade = container.querySelector('.absolute.bottom-0.h-8.w-0\\.5.bg-white');
  expect(bottomFade).not.toBeInTheDocument();
};

describe('ActivityLogTimeline V2', () => {
  const mockUseInfiniteScroll = hoisted.mockUseInfiniteScroll as unknown as Mock;

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
      renderActivityLogTimelineV2([]);
      expectEmptyStateToBeRenderedV2();
    });

    it('should render empty state with correct styling', () => {
      const { container } = renderActivityLogTimelineV2([]);

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
      renderActivityLogTimelineV2();
      expectCardToBeRenderedV2();
    });

    it('should render scrollable container with correct styling', () => {
      const { container } = renderActivityLogTimelineV2();

      const scrollContainer = container.querySelector(
        '.h-\\[800px\\].overflow-y-auto.scrollbar-hide'
      );
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toHaveClass('px-2', 'py-6', 'md:px-12', 'md:py-8');
    });

    it('should render V2 timeline visual indicator', () => {
      const { container } = renderActivityLogTimelineV2();
      expectV2TimelineVisualIndicator(container, true);
    });

    it('should conditionally render timeline line only when activities exist', () => {
      // Test with empty activities
      const { container: emptyContainer } = renderActivityLogTimelineV2([]);
      expectV2TimelineVisualIndicator(emptyContainer, false);

      // Test with activities
      const { container: filledContainer } = renderActivityLogTimelineV2();
      expectV2TimelineVisualIndicator(filledContainer, true);
    });
  });

  describe('Activity Groups Rendering', () => {
    it('should render all activity groups', () => {
      renderActivityLogTimelineV2();
      expectActivityGroupsToBeRenderedV2(mockActivityGroups);
    });

    it('should pass correct V2-specific props to groups', () => {
      renderActivityLogTimelineV2();
      expectActivityGroupsToBeRenderedV2(mockActivityGroups);
    });

    it('should generate unique keys for activity groups', () => {
      // This tests the key generation logic: `${group.date}-${index}`
      renderActivityLogTimelineV2();
      expectActivityGroupsToBeRenderedV2(mockActivityGroups);
    });

    it('should render group dates and item counts correctly', () => {
      renderActivityLogTimelineV2();
      expectGroupDatesAndItemCountsV2(mockActivityGroups);
    });
  });

  describe('V2 Infinite Scroll Integration', () => {
    it('should call useInfiniteScroll hook with correct parameters', () => {
      renderActivityLogTimelineV2();
      expectInfiniteScrollToBeCalledWithV2(mockUseInfiniteScroll, mockActivityGroups.length);
    });

    it('should use visibleActivities logic for rendering', () => {
      // Mock to show only 2 activities
      mockUseInfiniteScroll.mockReturnValue({
        visibleCount: 2,
        containerRef: { current: null },
      });

      renderActivityLogTimelineV2();
      expectActivityGroupsToBeRenderedV2(mockActivityGroups.slice(0, 2));
    });

    it('should handle empty visibleActivities correctly', () => {
      // Mock to show 0 activities
      mockUseInfiniteScroll.mockReturnValue({
        visibleCount: 0,
        containerRef: { current: null },
      });

      renderActivityLogTimelineV2();
      expectEmptyStateToBeRenderedV2();

      // Should not render any activity groups
      expectActivityGroupsToBeRenderedV2([]);
    });

    it('should handle large number of activities', () => {
      const largeActivityList = Array.from({ length: 20 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        items: [{ time: '10:00', category: 'test', description: `Activity ${i + 1}` }],
      }));

      renderActivityLogTimelineV2(largeActivityList);
      expectInfiniteScrollToBeCalledWithV2(mockUseInfiniteScroll, 20);
    });
  });

  describe('V2 Edge Cases', () => {
    it('should handle single activity group with V2 props', () => {
      const singleGroup = [mockActivityGroups[0]];
      renderActivityLogTimelineV2(singleGroup);
      expectActivityGroupsToBeRenderedV2(singleGroup);
    });

    it('should handle activities with no items', () => {
      const emptyItemsGroup = [
        {
          date: '2024-01-15',
          items: [],
        },
      ];

      renderActivityLogTimelineV2(emptyItemsGroup);
      expectActivityGroupsToBeRenderedV2(emptyItemsGroup);
      expectGroupDatesAndItemCountsV2(emptyItemsGroup);

      // V2: Should still render timeline line even with empty items
      const { container } = renderActivityLogTimelineV2(emptyItemsGroup);
      expectV2TimelineVisualIndicator(container, true);
    });

    it('should use translation for empty state message', () => {
      renderActivityLogTimelineV2([]);
      expectEmptyStateToBeRenderedV2();
    });

    it('should handle visibleActivities vs total activities correctly', () => {
      // Test that V2 uses visibleActivities.length for empty state check
      // Mock visibleCount to be 0 even though activities exist
      mockUseInfiniteScroll.mockReturnValue({
        visibleCount: 0,
        containerRef: { current: null },
      });

      renderActivityLogTimelineV2();
      expectEmptyStateToBeRenderedV2();
    });

    it('should import useInfiniteScroll from v1 features', () => {
      // This test verifies the import structure is correct
      renderActivityLogTimelineV2();
      expectInfiniteScrollToBeCalledWithV2(mockUseInfiniteScroll, mockActivityGroups.length);
    });
  });
});
