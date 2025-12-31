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
  expectActivityGroupsToBeRenderedV1,
  expectGroupDatesAndItemCounts,
  expectInfiniteScrollToBeCalledWith,
  expectEmptyStateContainerStyling,
  expectV1TimelineVisualIndicator,
  expectV1ScrollableContainer,
  setupInfiniteScrollMock,
  mockInfiniteScrollWithVisibleCount,
} from '../../../test-utils/activity-log-timeline-test-utils';

// Hoisted mock container to satisfy Vitest hoisting
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

vi.mock('@/modules/activity-log/hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: hoisted.mockUseInfiniteScroll,
}));

vi.mock('@/assets/images/Illustration.svg', () => ({ default: 'mocked-illustration.svg' }));

// Test data
const mockActivityGroups = createMockActivityGroups();

// Helper function to render component
const renderActivityLogTimeline = (activities = mockActivityGroups) => {
  return render(<ActivityLogTimeline activities={activities} />);
};

describe('ActivityLogTimeline V1', () => {
  const mockUseInfiniteScroll = hoisted.mockUseInfiniteScroll as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    setupInfiniteScrollMock(mockUseInfiniteScroll);
  });

  vi.mock('../../hooks/use-infinite-scroll', () => ({
    useInfiniteScroll: mockUseInfiniteScroll,
  }));

  describe('Empty State', () => {
    it('should render empty state when no activities provided', () => {
      renderActivityLogTimeline([]);
      expectEmptyStateToBeRendered();
    });

    it('should render empty state with correct styling', () => {
      const { container } = renderActivityLogTimeline([]);
      expectEmptyStateContainerStyling(container);
    });
  });

  describe('Timeline with Activities', () => {
    it('should render Card component when activities are provided', () => {
      renderActivityLogTimeline();
      expectCardToBeRendered();
    });

    it('should render scrollable container with correct styling', () => {
      const { container } = renderActivityLogTimeline();
      expectV1ScrollableContainer(container);
    });

    it('should render timeline visual indicator', () => {
      const { container } = renderActivityLogTimeline();
      expectV1TimelineVisualIndicator(container);
    });
  });

  describe('Activity Groups Rendering', () => {
    it('should render all activity groups with correct props', () => {
      renderActivityLogTimeline();
      expectActivityGroupsToBeRenderedV1(mockActivityGroups);
      expectGroupDatesAndItemCounts(mockActivityGroups);
    });
  });

  describe('Infinite Scroll Integration', () => {
    it('should call useInfiniteScroll hook with correct parameters', () => {
      renderActivityLogTimeline();
      expectInfiniteScrollToBeCalledWith(mockUseInfiniteScroll, mockActivityGroups.length);
    });

    it('should render only visible activities based on visibleCount', () => {
      mockInfiniteScrollWithVisibleCount(mockUseInfiniteScroll, 2);
      renderActivityLogTimeline();

      // Check that only 2 activities are rendered
      const activityGroups = screen.queryAllByTestId('activity-log-group');
      expect(activityGroups).toHaveLength(2);
      expect(activityGroups[0]).toHaveAttribute('data-date', '2024-01-15');
      expect(activityGroups[1]).toHaveAttribute('data-date', '2024-01-14');

      // The isLastIndex is based on the original array length, not visible count
      // So with 3 total activities, only index 2 would have isLastIndex=true
      // Since we only render index 0 and 1, both should have isLastIndex=false
      expect(activityGroups[0]).toHaveAttribute('data-is-last', 'false');
      expect(activityGroups[1]).toHaveAttribute('data-is-last', 'false');
    });

    it('should handle large number of activities', () => {
      const largeActivityList = createLargeActivityList(20);
      renderActivityLogTimeline(largeActivityList);
      expectInfiniteScrollToBeCalledWith(mockUseInfiniteScroll, 20);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single activity group', () => {
      renderActivityLogTimeline([mockActivityGroups[0]]);
      expectActivityGroupsToBeRenderedV1([mockActivityGroups[0]]);
    });

    it('should handle activities with no items', () => {
      const emptyItemsGroup = createEmptyItemsGroup();
      renderActivityLogTimeline(emptyItemsGroup);
      expectActivityGroupsToBeRenderedV1(emptyItemsGroup);
      expectGroupDatesAndItemCounts(emptyItemsGroup);
    });
  });
});
