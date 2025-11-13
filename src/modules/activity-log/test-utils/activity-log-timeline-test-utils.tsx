import { screen } from '@testing-library/react';
import { ActivityGroup } from '../activity-log-v1/types/activity-log.types';

/**
 * Shared test utilities for ActivityLogTimeline components (V1 and V2)
 * Reduces code duplication across test files
 */

// ============================================================================
// MOCK DATA
// ============================================================================

export const createMockActivityGroups = (): ActivityGroup[] => [
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

export const createLargeActivityList = (count: number): ActivityGroup[] =>
  Array.from({ length: count }, (_, i) => ({
    date: `2024-01-${String(i + 1).padStart(2, '0')}`,
    items: [{ time: '10:00', category: 'test', description: `Activity ${i + 1}` }],
  }));

export const createEmptyItemsGroup = (): ActivityGroup[] => [
  {
    date: '2024-01-15',
    items: [],
  },
];

// ============================================================================
// SHARED EXPECTATION HELPERS
// ============================================================================
// Note: Mock factories cannot be exported due to Vitest hoisting restrictions.
// Mocks must be defined inline in test files.

export const expectEmptyStateToBeRendered = () => {
  const illustration = screen.getByRole('presentation');
  expect(illustration).toBeInTheDocument();
  expect(illustration).toHaveAttribute('src', 'mocked-illustration.svg');
  expect(illustration).toHaveAttribute('alt', '');
  expect(illustration).toHaveClass('h-[160px]', 'w-[240px]');
  expect(screen.getByText('COULDNT_FIND_ANYTHING_MATCHING')).toBeInTheDocument();
  expect(screen.queryByTestId('card')).not.toBeInTheDocument();
};

export const expectCardToBeRendered = () => {
  const card = screen.getByTestId('card');
  expect(card).toBeInTheDocument();
  expect(card).toHaveClass('w-full', 'border-none', 'rounded-[8px]', 'shadow-sm');
};

export const expectGroupDatesAndItemCounts = (expectedGroups: ActivityGroup[]) => {
  expectedGroups.forEach((group) => {
    expect(screen.getByText(group.date)).toBeInTheDocument();
  });

  const itemCounts = screen.getAllByTestId('group-items-count');
  expectedGroups.forEach((group, index) => {
    expect(itemCounts[index]).toHaveTextContent(String(group.items.length));
  });
};

export const expectInfiniteScrollToBeCalledWith = (mockFn: any, totalItems: number) => {
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn).toHaveBeenCalledWith(totalItems);
};

export const expectEmptyStateContainerStyling = (container: HTMLElement) => {
  const emptyStateContainer = container.querySelector(
    '.flex.h-full.w-full.flex-col.gap-6.items-center.justify-center.p-8.text-center'
  );
  expect(emptyStateContainer).toBeInTheDocument();

  const heading = screen.getByRole('heading', { level: 3 });
  expect(heading).toHaveClass('text-xl', 'font-medium');
};

// ============================================================================
// VERSION-SPECIFIC HELPERS
// ============================================================================

/**
 * V1-specific: Activity groups have only isLastIndex prop
 */
export const expectActivityGroupsToBeRenderedV1 = (expectedGroups: ActivityGroup[]) => {
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

/**
 * V2-specific: Activity groups have both isFirstIndex and isLastIndex props
 */
export const expectActivityGroupsToBeRenderedV2 = (expectedGroups: ActivityGroup[]) => {
  const activityGroups = screen.queryAllByTestId('activity-log-group');
  expect(activityGroups).toHaveLength(expectedGroups.length);

  expectedGroups.forEach((group, index) => {
    expect(activityGroups[index]).toHaveAttribute('data-date', group.date);
    expect(activityGroups[index]).toHaveAttribute('data-is-first', String(index === 0));
    expect(activityGroups[index]).toHaveAttribute(
      'data-is-last',
      String(index === expectedGroups.length - 1)
    );
  });
};

/**
 * V1-specific: Timeline visual indicator with fade effects
 */
export const expectV1TimelineVisualIndicator = (container: HTMLElement) => {
  const timelineLine = container.querySelector(
    '.absolute.left-1\\.5.-ml-6.top-0.bottom-0.w-0\\.5.bg-gray-200'
  );
  expect(timelineLine).toBeInTheDocument();

  const topFade = container.querySelector('.absolute.top-0.h-12.w-0\\.5.bg-white');
  expect(topFade).toBeInTheDocument();

  const bottomFade = container.querySelector('.absolute.bottom-0.h-8.w-0\\.5.bg-white');
  expect(bottomFade).toBeInTheDocument();
};

/**
 * V2-specific: Centered timeline without fade effects
 */
export const expectV2TimelineVisualIndicator = (
  container: HTMLElement,
  shouldExist = true
) => {
  const timelineLine = container.querySelector(
    '.absolute.left-1\\/2.transform.-translate-x-1\\/2.w-\\[2px\\].bg-low-emphasis.top-\\[60px\\].h-\\[calc\\(100\\%-110px\\)\\].z-0'
  );

  if (shouldExist) {
    expect(timelineLine).toBeInTheDocument();
  } else {
    expect(timelineLine).not.toBeInTheDocument();
  }

  // V2 doesn't have fade effects
  const topFade = container.querySelector('.absolute.top-0.h-12.w-0\\.5.bg-white');
  expect(topFade).not.toBeInTheDocument();

  const bottomFade = container.querySelector('.absolute.bottom-0.h-8.w-0\\.5.bg-white');
  expect(bottomFade).not.toBeInTheDocument();
};

/**
 * V1-specific: Scrollable container styling
 */
export const expectV1ScrollableContainer = (container: HTMLElement) => {
  const scrollContainer = container.querySelector(
    '.px-12.py-8.h-\\[800px\\].overflow-y-auto.scrollbar-hide'
  );
  expect(scrollContainer).toBeInTheDocument();
};

/**
 * V2-specific: Responsive scrollable container styling
 */
export const expectV2ScrollableContainer = (container: HTMLElement) => {
  const scrollContainer = container.querySelector('.h-\\[800px\\].overflow-y-auto.scrollbar-hide');
  expect(scrollContainer).toBeInTheDocument();
  expect(scrollContainer).toHaveClass('px-2', 'py-6', 'md:px-12', 'md:py-8');
};

// ============================================================================
// MOCK SETUP HELPERS
// ============================================================================

export const setupInfiniteScrollMock = (mockFn: any) => {
  mockFn.mockImplementation((totalItems: number) => ({
    visibleCount: Math.min(totalItems, 5),
    containerRef: { current: null },
  }));
};

export const mockInfiniteScrollWithVisibleCount = (mockFn: any, visibleCount: number) => {
  mockFn.mockReturnValue({
    visibleCount,
    containerRef: { current: null },
  });
};
