import { vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogTimeline } from './activity-log-timeline';
import '../../../../../lib/utils/test-utils/shared-test-utils';
import {
  createMockActivityGroups,
  createLargeActivityList,
  createEmptyItemsGroup,
  expectEmptyStateToBeRendered,
  expectCardToBeRendered,
  expectActivityGroupsToBeRenderedV2,
  expectGroupDatesAndItemCounts,
  expectInfiniteScrollToBeCalledWith,
  expectEmptyStateContainerStyling,
  expectV2TimelineVisualIndicator,
  expectV2ScrollableContainer,
  setupInfiniteScrollMock,
  mockInfiniteScrollWithVisibleCount,
} from '../../../test-utils/activity-log-timeline-test-utils';

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

vi.mock('@/assets/images/Illustration.svg', () => ({ default: 'mocked-illustration.svg' }));

// Test data
const mockActivityGroups = createMockActivityGroups();

// Helper function to render component
const renderActivityLogTimelineV2 = (activities = mockActivityGroups) => {
  return render(<ActivityLogTimeline activities={activities} />);
};

describe('ActivityLogTimeline V2', () => {
  const mockUseInfiniteScroll = hoisted.mockUseInfiniteScroll as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    setupInfiniteScrollMock(mockUseInfiniteScroll);
  });

  describe('Empty State', () => {
    it('should render empty state when no activities provided', () => {
      renderActivityLogTimelineV2([]);
      expectEmptyStateToBeRendered();
    });

    it('should render empty state with correct styling', () => {
      const { container } = renderActivityLogTimelineV2([]);
      expectEmptyStateContainerStyling(container);
    });
  });

  describe('Timeline with Activities', () => {
    it('should render Card component when activities are provided', () => {
      renderActivityLogTimelineV2();
      expectCardToBeRendered();
    });

    it('should render scrollable container with correct styling', () => {
      const { container } = renderActivityLogTimelineV2();
      expectV2ScrollableContainer(container);
    });

    it('should render V2 timeline visual indicator', () => {
      const { container } = renderActivityLogTimelineV2();
      expectV2TimelineVisualIndicator(container);
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
    it('should render all activity groups with V2-specific props', () => {
      renderActivityLogTimelineV2();
      expectActivityGroupsToBeRenderedV2(mockActivityGroups);
      expectGroupDatesAndItemCounts(mockActivityGroups);
    });
  });

  describe('V2 Infinite Scroll Integration', () => {
    it('should call useInfiniteScroll hook with correct parameters', () => {
      renderActivityLogTimelineV2();
      expectInfiniteScrollToBeCalledWith(mockUseInfiniteScroll, mockActivityGroups.length);
    });

    it('should use visibleActivities logic for rendering', () => {
      mockInfiniteScrollWithVisibleCount(mockUseInfiniteScroll, 2);
      renderActivityLogTimelineV2();

      // V2 uses visibleActivities which is sliced, so isFirstIndex and isLastIndex
      // are based on the visible array, not the original
      const activityGroups = screen.queryAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(2);
      expect(activityGroups[0]).toHaveAttribute('data-date', '2024-01-15');
      expect(activityGroups[0]).toHaveAttribute('data-is-first', 'true');
      expect(activityGroups[0]).toHaveAttribute('data-is-last', 'false');

      expect(activityGroups[1]).toHaveAttribute('data-date', '2024-01-14');
      expect(activityGroups[1]).toHaveAttribute('data-is-first', 'false');
      expect(activityGroups[1]).toHaveAttribute('data-is-last', 'true');
    });

    it('should handle empty visibleActivities correctly', () => {
      mockInfiniteScrollWithVisibleCount(mockUseInfiniteScroll, 0);
      renderActivityLogTimelineV2();
      expectEmptyStateToBeRendered();
      expectActivityGroupsToBeRenderedV2([]);
    });

    it('should handle large number of activities', () => {
      const largeActivityList = createLargeActivityList(20);
      renderActivityLogTimelineV2(largeActivityList);
      expectInfiniteScrollToBeCalledWith(mockUseInfiniteScroll, 20);
    });
  });

  describe('V2 Edge Cases', () => {
    it('should handle single activity group with V2 props', () => {
      renderActivityLogTimelineV2([mockActivityGroups[0]]);
      expectActivityGroupsToBeRenderedV2([mockActivityGroups[0]]);
    });

    it('should handle activities with no items', () => {
      const emptyItemsGroup = createEmptyItemsGroup();
      renderActivityLogTimelineV2(emptyItemsGroup);
      expectActivityGroupsToBeRenderedV2(emptyItemsGroup);
      expectGroupDatesAndItemCounts(emptyItemsGroup);

      // V2: Should still render timeline line even with empty items
      const { container } = renderActivityLogTimelineV2(emptyItemsGroup);
      expectV2TimelineVisualIndicator(container);
    });

    it('should handle empty visibleActivities correctly', () => {
      mockInfiniteScrollWithVisibleCount(mockUseInfiniteScroll, 0);
      renderActivityLogTimelineV2();
      expectEmptyStateToBeRendered();
    });
  });
});
