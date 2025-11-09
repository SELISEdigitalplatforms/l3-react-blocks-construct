import { vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogTimeline } from './activity-log-timeline';
import { ActivityGroup } from '../../types/activity-log.types';
import '../../../../../test-utils/shared-test-utils';

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

// Helper functions to reduce code duplication
const renderActivityLogTimeline = (activities: ActivityGroup[] = mockActivityGroups) => {
  return render(<ActivityLogTimeline activities={activities} />);
};

const expectEmptyStateToBeRendered = () => {
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

const expectCardToBeRendered = () => {
  const card = screen.getByTestId('card');
  expect(card).toBeInTheDocument();
  expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');
};

const expectActivityGroupsToBeRendered = (expectedGroups: ActivityGroup[]) => {
  const activityGroups = screen.queryAllByTestId('activity-log-group');
  expect(activityGroups).toHaveLength(expectedGroups.length);

  expectedGroups.forEach((group, index) => {
    expect(activityGroups[index]).toHaveAttribute('data-date', group.date);
    expect(activityGroups[index]).toHaveAttribute(
      'data-is-last',
      String(index === expectedGroups.length - 1)
    );
  });
};

const expectGroupDatesAndItemCounts = (expectedGroups: ActivityGroup[]) => {
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

const expectInfiniteScrollToBeCalledWith = (mockFn: any, totalItems: number) => {
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn).toHaveBeenCalledWith(totalItems);
};

describe('ActivityLogTimeline V1', () => {
  const mockUseInfiniteScroll = hoisted.mockUseInfiniteScroll as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default behavior
    mockUseInfiniteScroll.mockImplementation((totalItems: number) => ({
      visibleCount: Math.min(totalItems, 5),
      containerRef: { current: null },
    }));
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
      renderActivityLogTimeline();
      expectCardToBeRendered();
    });

    it('should render scrollable container with correct styling', () => {
      const { container } = renderActivityLogTimeline();

      const scrollContainer = container.querySelector(
        '.px-12.py-8.h-\\[800px\\].overflow-y-auto.scrollbar-hide'
      );
      expect(scrollContainer).toBeInTheDocument();
    });

    it('should render timeline visual indicator', () => {
      const { container } = renderActivityLogTimeline();

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
      renderActivityLogTimeline();
      expectActivityGroupsToBeRendered(mockActivityGroups);
    });

    it('should pass correct isLastIndex prop to groups', () => {
      renderActivityLogTimeline();
      expectActivityGroupsToBeRendered(mockActivityGroups);
    });

    it('should render group dates and item counts correctly', () => {
      renderActivityLogTimeline();
      expectGroupDatesAndItemCounts(mockActivityGroups);
    });
  });

  describe('Infinite Scroll Integration', () => {
    it('should call useInfiniteScroll hook with correct parameters', () => {
      renderActivityLogTimeline();
      expectInfiniteScrollToBeCalledWith(mockUseInfiniteScroll, mockActivityGroups.length);
    });

    it('should render only visible activities based on visibleCount', () => {
      // Mock to show only 2 activities
      mockUseInfiniteScroll.mockReturnValue({
        visibleCount: 2,
        containerRef: { current: null },
      });

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
      const largeActivityList = Array.from({ length: 20 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        items: [{ time: '10:00', category: 'test', description: `Activity ${i + 1}` }],
      }));

      renderActivityLogTimeline(largeActivityList);
      expectInfiniteScrollToBeCalledWith(mockUseInfiniteScroll, 20);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single activity group', () => {
      const singleGroup = [mockActivityGroups[0]];
      renderActivityLogTimeline(singleGroup);
      expectActivityGroupsToBeRendered(singleGroup);
    });

    it('should handle activities with no items', () => {
      const emptyItemsGroup = [
        {
          date: '2024-01-15',
          items: [],
        },
      ];

      renderActivityLogTimeline(emptyItemsGroup);
      expectActivityGroupsToBeRendered(emptyItemsGroup);
      expectGroupDatesAndItemCounts(emptyItemsGroup);
    });

    it('should use translation for empty state message', () => {
      renderActivityLogTimeline([]);
      expectEmptyStateToBeRendered();
    });
  });
});
