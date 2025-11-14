import { screen } from '@testing-library/react';
import { ActivityItem } from '../activity-log-v1/types/activity-log.types';

/**
 * Shared test utilities for ActivityLogGroup components (V1 and V2)
 * This file reduces code duplication between V1 and V2 test files
 */

// ============================================================================
// SHARED MOCK DATA
// ============================================================================

export const mockActivityItems: ActivityItem[] = [
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
  {
    time: '14:20',
    category: 'notification',
    description: 'New message received',
  },
];

// ============================================================================
// SHARED HELPER FUNCTIONS
// ============================================================================

/**
 * NOTE: Mock factories cannot be exported and used in vi.mock() calls due to
 * Vitest hoisting rules. Mocks must be defined inline in each test file.
 *
 * The getFormattedDateLabel mock should be inlined as:
 * vi.mock('../../utils/activity-log-utils', () => ({
 *   getFormattedDateLabel: vi.fn((date: string) => {
 *     const today = new Date();
 *     const yesterday = new Date();
 *     yesterday.setDate(today.getDate() - 1);
 *     if (date === today.toISOString().split('T')[0]) return `TODAY - ${date}`;
 *     else if (date === yesterday.toISOString().split('T')[0]) return `YESTERDAY - ${date}`;
 *     else return `MOCK_WEEKDAY - ${date}`;
 *   }),
 * }));
 */

// ============================================================================
// SHARED HELPER FUNCTIONS
// ============================================================================

/**
 * Gets the expected date label for testing
 */
export const getExpectedDateLabel = (date: string) => `MOCK_WEEKDAY - ${date}`;

/**
 * Expects the date label to be displayed
 */
export const expectDateLabelToBeDisplayed = (date: string) => {
  const expectedLabel = getExpectedDateLabel(date);
  expect(screen.getByText(expectedLabel)).toBeInTheDocument();
};

/**
 * Expects activity items to have basic attributes (time, category, description)
 */
export const expectBasicActivityItemAttributes = (
  activityItems: Element[],
  items: ActivityItem[]
) => {
  items.forEach((item, index) => {
    expect(activityItems[index]).toHaveAttribute('data-time', item.time);
    expect(activityItems[index]).toHaveAttribute('data-category', item.category);
    expect(activityItems[index]).toHaveTextContent(item.description);
  });
};

/**
 * Expects activity items to be rendered in correct order
 */
export const expectItemsInCorrectOrder = (items: ActivityItem[]) => {
  const activityItems = Array.from(document.querySelectorAll('[data-testid="activity-log-item"]'));

  items.forEach((item, index) => {
    expect(activityItems[index]).toHaveTextContent(item.description);
  });
};

// ============================================================================
// SHARED TEST DATA FACTORIES
// ============================================================================

/**
 * Creates test data for edge case: very long description
 */
export const createLongDescriptionItem = () => ({
  time: '10:30',
  category: 'system',
  description:
    'This is a very long description that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or functionality',
});

/**
 * Creates test data for edge case: special characters
 */
export const createSpecialCharsItem = () => ({
  time: '10:30',
  category: 'system',
  description: 'Special chars: @#$%^&*()_+-=[]{}|;:,.<>?',
});

/**
 * Creates test data for edge case: different time formats
 */
export const createDifferentTimeItems = () => [
  { time: '9:05', category: 'system', description: 'Morning activity' },
  { time: '13:30', category: 'task', description: 'Afternoon activity' },
  { time: '23:59', category: 'notification', description: 'Late night activity' },
];

/**
 * Creates test data for single item test
 */
export const createSingleItem = () => [mockActivityItems[0]];

/**
 * Creates test data for empty items
 */
export const createEmptyItems = (): ActivityItem[] => [];
