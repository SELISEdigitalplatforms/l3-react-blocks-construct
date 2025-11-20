import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogGroup } from './activity-log-group';
import { ActivityItem } from '../../types/activity-log.types';
import '../../../../../lib/utils/test-utils/shared-test-utils';

// Mock dependencies - Must be defined before imports to avoid hoisting issues
vi.mock('@/components/ui-kit/separator', () => ({
  Separator: () => <div data-testid="separator" />,
}));

vi.mock('../activity-log-item/activity-log-item', () => ({
  ActivityLogItem: ({ time, category, description }: ActivityItem) => (
    <div data-testid="activity-log-item" data-time={time} data-category={category}>
      {description}
    </div>
  ),
}));

vi.mock('../../utils/activity-log-utils', () => ({
  getFormattedDateLabel: vi.fn((date: string) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date === today.toISOString().split('T')[0]) {
      return `TODAY - ${date}`;
    } else if (date === yesterday.toISOString().split('T')[0]) {
      return `YESTERDAY - ${date}`;
    } else {
      return `MOCK_WEEKDAY - ${date}`;
    }
  }),
}));

// Import shared utilities AFTER mocks to avoid hoisting issues
import {
  mockActivityItems,
  getExpectedDateLabel,
  expectDateLabelToBeDisplayed,
  expectBasicActivityItemAttributes,
  expectItemsInCorrectOrder,
  createLongDescriptionItem,
  createSpecialCharsItem,
  createDifferentTimeItems,
  createSingleItem,
  createEmptyItems,
} from '../../../test-utils/activity-log-group-test-utils';

// Test data
const mockProps = {
  date: '2024-01-15',
  items: mockActivityItems,
  isLastIndex: false,
};

// Helper functions to reduce code duplication
const renderActivityLogGroup = (props = mockProps) => {
  return render(<ActivityLogGroup {...props} />);
};

const expectActivityItemsToBeRendered = (items: ActivityItem[]) => {
  const activityItems = screen.queryAllByTestId('activity-log-item');
  expect(activityItems).toHaveLength(items.length);
  expectBasicActivityItemAttributes(Array.from(activityItems), items);
};

const expectSeparatorVisibility = (shouldBeVisible: boolean) => {
  const separator = screen.queryByTestId('separator');
  if (shouldBeVisible) {
    expect(separator).toBeInTheDocument();
  } else {
    expect(separator).not.toBeInTheDocument();
  }
};

describe('ActivityLogGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct structure', () => {
      const { container } = renderActivityLogGroup();

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('mb-6', 'relative');
    });

    it('should render the date label container with correct styling', () => {
      renderActivityLogGroup();

      const dateLabel = screen.getByText(getExpectedDateLabel(mockProps.date));
      expect(dateLabel).toBeInTheDocument();
      expect(dateLabel).toHaveClass('text-low-emphasis', 'font-medium', 'text-xs', 'mb-2', 'pb-1');
    });

    it('should render the items container with correct styling', () => {
      const { container } = renderActivityLogGroup();

      const itemsContainer = container.querySelector('.relative:last-child');
      expect(itemsContainer).toBeInTheDocument();
      expect(itemsContainer).toHaveClass('relative');
    });

    it('should render all activity items', () => {
      renderActivityLogGroup();
      const activityItems = screen.queryAllByTestId('activity-log-item');
      expect(activityItems).toHaveLength(mockActivityItems.length);
      expectActivityItemsToBeRendered(mockActivityItems);
    });
  });

  describe('Date Label Formatting', () => {
    it('should call getFormattedDateLabel with the correct date', async () => {
      const { getFormattedDateLabel } = vi.mocked(await import('../../utils/activity-log-utils'));

      renderActivityLogGroup();

      expect(getFormattedDateLabel).toHaveBeenCalledWith(mockProps.date);
    });

    it('should display the formatted date label', () => {
      renderActivityLogGroup();
      expectDateLabelToBeDisplayed(mockProps.date);
    });

    it('should handle different date formats', () => {
      const testDate = '2024-12-25';
      const propsWithDifferentDate = { ...mockProps, date: testDate };

      renderActivityLogGroup(propsWithDifferentDate);
      expectDateLabelToBeDisplayed(testDate);
    });
  });

  describe('Activity Items Rendering', () => {
    it('should render items with unique keys', () => {
      renderActivityLogGroup();
      const activityItems = screen.queryAllByTestId('activity-log-item');
      expect(activityItems).toHaveLength(mockActivityItems.length);
      expectItemsInCorrectOrder(mockActivityItems);
    });

    it('should handle empty items array', () => {
      const emptyItems = createEmptyItems();
      const propsWithEmptyItems = { ...mockProps, items: emptyItems };

      renderActivityLogGroup(propsWithEmptyItems);

      expectActivityItemsToBeRendered(emptyItems);
      expectDateLabelToBeDisplayed(mockProps.date);
    });

    it('should handle single item', () => {
      const singleItem = createSingleItem();
      const propsWithSingleItem = { ...mockProps, items: singleItem };

      renderActivityLogGroup(propsWithSingleItem);
      expectActivityItemsToBeRendered(singleItem);
    });
  });

  describe('Separator Rendering', () => {
    it('should render separator when isLastIndex is false', () => {
      renderActivityLogGroup({ ...mockProps, isLastIndex: false });
      expectSeparatorVisibility(true);
    });

    it('should not render separator when isLastIndex is true', () => {
      renderActivityLogGroup({ ...mockProps, isLastIndex: true });
      expectSeparatorVisibility(false);
    });
  });

  describe('Props Validation', () => {
    it('should handle all required props correctly', () => {
      const testProps = {
        date: '2024-06-15',
        items: [
          {
            time: '09:00',
            category: 'meeting',
            description: 'Team standup meeting',
          },
        ],
        isLastIndex: true,
      };

      renderActivityLogGroup(testProps);

      expectDateLabelToBeDisplayed(testProps.date);
      expectActivityItemsToBeRendered(testProps.items);
      expectSeparatorVisibility(false);
    });

    it('should pass correct props to ActivityLogItem components', () => {
      renderActivityLogGroup();
      expectActivityItemsToBeRendered(mockActivityItems);
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper DOM hierarchy', () => {
      const { container } = renderActivityLogGroup();

      const mainContainer = container.firstChild as HTMLElement;

      // Check main container structure
      expect(mainContainer).toHaveClass('mb-6', 'relative');

      // Check date label is first child
      const dateLabel = mainContainer.firstChild as HTMLElement;
      expect(dateLabel).toHaveClass('text-low-emphasis', 'font-medium', 'text-xs', 'mb-2', 'pb-1');

      // Check items container is second child
      const itemsContainer = mainContainer.children[1] as HTMLElement;
      expect(itemsContainer).toHaveClass('relative');

      // Check separator is last child (when not isLastIndex)
      expectSeparatorVisibility(true);
    });

    it('should render components in correct order', () => {
      const { container } = renderActivityLogGroup();

      const mainContainer = container.firstChild as HTMLElement;
      const children = Array.from(mainContainer.children);

      // First child: date label
      expect(children[0]).toHaveTextContent(getExpectedDateLabel(mockProps.date));

      // Second child: items container
      expect(children[1]).toHaveClass('relative');

      // Third child: separator (when not last)
      expect(children[2]).toContainElement(screen.getByTestId('separator'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long descriptions', () => {
      const longDescriptionItem = createLongDescriptionItem();
      const propsWithLongDescription = { ...mockProps, items: [longDescriptionItem] };

      renderActivityLogGroup(propsWithLongDescription);
      expectActivityItemsToBeRendered([longDescriptionItem]);
    });

    it('should handle special characters in descriptions', () => {
      const specialCharsItem = createSpecialCharsItem();
      const propsWithSpecialChars = { ...mockProps, items: [specialCharsItem] };

      renderActivityLogGroup(propsWithSpecialChars);
      expectActivityItemsToBeRendered([specialCharsItem]);
    });

    it('should handle different time formats', () => {
      const differentTimeItems = createDifferentTimeItems();
      const propsWithDifferentTimes = { ...mockProps, items: differentTimeItems };

      renderActivityLogGroup(propsWithDifferentTimes);
      expectActivityItemsToBeRendered(differentTimeItems);
    });
  });
});
