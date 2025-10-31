import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogGroup } from './activity-log-group';
import { ActivityItem } from '../../types/activity-log.types';
import '../../../../../test-utils/shared-test-utils';

// Mock dependencies - V2 specific
vi.mock('../activity-log-item/activity-log-item', () => ({
  ActivityLogItem: ({
    time,
    category,
    description,
    isEven,
    isFirst,
    isLast,
  }: ActivityItem & {
    isEven: boolean;
    isFirst: boolean;
    isLast: boolean;
  }) => (
    <div
      data-testid="activity-log-item"
      data-time={time}
      data-category={category}
      data-is-even={isEven}
      data-is-first={isFirst}
      data-is-last={isLast}
    >
      {description}
    </div>
  ),
}));

vi.mock('../../utils/activity-log-utils', () => ({
  getFormattedDateLabel: vi.fn((date: string) => {
    // Mock implementation for predictable testing
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

// Test data
const mockActivityItems: ActivityItem[] = [
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

const mockProps = {
  date: '2024-01-15',
  items: mockActivityItems,
  isLastIndex: false,
  isFirstIndex: false,
};

// Helper functions to reduce code duplication - V2 specific
const renderActivityLogGroupV2 = (props = mockProps) => {
  return render(<ActivityLogGroup {...props} />);
};

const getExpectedDateLabel = (date: string) => `MOCK_WEEKDAY - ${date}`;

const expectActivityItemsToBeRenderedV2 = (items: ActivityItem[], isLastIndex = false) => {
  const activityItems = screen.queryAllByTestId('activity-log-item');
  expect(activityItems).toHaveLength(items.length);

  items.forEach((item, index) => {
    expect(activityItems[index]).toHaveAttribute('data-time', item.time);
    expect(activityItems[index]).toHaveAttribute('data-category', item.category);
    expect(activityItems[index]).toHaveTextContent(item.description);

    // V2-specific props
    expect(activityItems[index]).toHaveAttribute('data-is-even', String(index % 2 === 0));
    expect(activityItems[index]).toHaveAttribute('data-is-first', String(index === 0));
    expect(activityItems[index]).toHaveAttribute(
      'data-is-last',
      String(index === items.length - 1 && isLastIndex)
    );
  });
};

const expectDateLabelToBeDisplayedV2 = (date: string) => {
  const expectedLabel = getExpectedDateLabel(date);
  expect(screen.getByText(expectedLabel)).toBeInTheDocument();
};

const expectV2DateBadgeStyling = () => {
  const dateLabel = screen.getByText(getExpectedDateLabel(mockProps.date));
  expect(dateLabel).toHaveClass(
    'bg-secondary-50',
    'text-secondary-800',
    'text-xs',
    'font-medium',
    'py-1',
    'px-2',
    'rounded'
  );
};

const expectV2ContainerStructure = (container: HTMLElement) => {
  const mainContainer = container.firstChild as HTMLElement;
  expect(mainContainer).toHaveClass('mb-8', 'relative');

  const dateBadgeContainer = container.querySelector('.flex.justify-center.mb-4.relative.z-10');
  expect(dateBadgeContainer).toBeInTheDocument();

  const itemsContainer = container.querySelector('.relative:last-child');
  expect(itemsContainer).toBeInTheDocument();
  expect(itemsContainer).toHaveClass('relative');
};

describe('ActivityLogGroup V2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct V2 structure', () => {
      const { container } = renderActivityLogGroupV2();
      expectV2ContainerStructure(container);
    });

    it('should render the date badge with correct V2 styling', () => {
      renderActivityLogGroupV2();
      expectV2DateBadgeStyling();
    });

    it('should render the date badge container with centered layout', () => {
      const { container } = renderActivityLogGroupV2();
      expectV2ContainerStructure(container);
    });

    it('should render the items container with correct styling', () => {
      const { container } = renderActivityLogGroupV2();
      expectV2ContainerStructure(container);
    });

    it('should render all activity items with V2-specific props', () => {
      renderActivityLogGroupV2();
      expectActivityItemsToBeRenderedV2(mockActivityItems, false);
    });
  });

  describe('Date Label Formatting', () => {
    it('should call getFormattedDateLabel with the correct date', async () => {
      const { getFormattedDateLabel } = vi.mocked(await import('../../utils/activity-log-utils'));

      renderActivityLogGroupV2();

      expect(getFormattedDateLabel).toHaveBeenCalledWith(mockProps.date);
    });

    it('should display the formatted date label', () => {
      renderActivityLogGroupV2();
      expectDateLabelToBeDisplayedV2(mockProps.date);
    });

    it('should handle different date formats', () => {
      const testDate = '2024-12-25';
      const propsWithDifferentDate = { ...mockProps, date: testDate };

      renderActivityLogGroupV2(propsWithDifferentDate);
      expectDateLabelToBeDisplayedV2(testDate);
    });
  });

  describe('Activity Items Rendering', () => {
    it('should render items with unique keys', () => {
      const { container } = renderActivityLogGroupV2();

      const activityItems = container.querySelectorAll('[data-testid="activity-log-item"]');
      expect(activityItems).toHaveLength(mockActivityItems.length);

      // Verify items are rendered in correct order
      mockActivityItems.forEach((item, index) => {
        expect(activityItems[index]).toHaveTextContent(item.description);
      });
    });

    it('should handle empty items array', () => {
      const emptyItems: ActivityItem[] = [];
      const propsWithEmptyItems = { ...mockProps, items: emptyItems };

      renderActivityLogGroupV2(propsWithEmptyItems);

      expectActivityItemsToBeRenderedV2(emptyItems, false);
      expectDateLabelToBeDisplayedV2(mockProps.date);
    });

    it('should handle single item', () => {
      const singleItem = [mockActivityItems[0]];
      const propsWithSingleItem = { ...mockProps, items: singleItem };

      renderActivityLogGroupV2(propsWithSingleItem);
      expectActivityItemsToBeRenderedV2(singleItem, false);
    });
  });

  describe('V2-Specific Props Testing', () => {
    it('should pass isLast=true to the last item when isLastIndex=true', () => {
      const propsWithLastIndex = { ...mockProps, isLastIndex: true };
      renderActivityLogGroupV2(propsWithLastIndex);
      expectActivityItemsToBeRenderedV2(mockActivityItems, true);
    });

    it('should pass isLast=false to all items when isLastIndex=false', () => {
      renderActivityLogGroupV2();
      expectActivityItemsToBeRenderedV2(mockActivityItems, false);
    });

    it('should correctly alternate isEven prop for items', () => {
      renderActivityLogGroupV2();
      expectActivityItemsToBeRenderedV2(mockActivityItems, false);
    });

    it('should pass isFirst=true only to the first item', () => {
      renderActivityLogGroupV2();
      expectActivityItemsToBeRenderedV2(mockActivityItems, false);
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
        isFirstIndex: false,
      };

      renderActivityLogGroupV2(testProps);

      expectDateLabelToBeDisplayedV2(testProps.date);
      expectActivityItemsToBeRenderedV2(testProps.items, true);

      // V2 doesn't use separators
      expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
    });

    it('should pass correct props to ActivityLogItem components', () => {
      renderActivityLogGroupV2();
      expectActivityItemsToBeRenderedV2(mockActivityItems, false);
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper V2 DOM hierarchy', () => {
      const { container } = renderActivityLogGroupV2();
      expectV2ContainerStructure(container);

      // V2 doesn't have separators
      expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
    });

    it('should render components in correct order', () => {
      const { container } = renderActivityLogGroupV2();

      const mainContainer = container.firstChild as HTMLElement;
      const children = Array.from(mainContainer.children);

      // V2 structure: only 2 children (no separator)
      expect(children).toHaveLength(2);

      // First child: date badge container
      expect(children[0]).toHaveClass('flex', 'justify-center', 'mb-4', 'relative', 'z-10');
      expect(children[0]).toContainElement(screen.getByText(getExpectedDateLabel(mockProps.date)));

      // Second child: items container
      expect(children[1]).toHaveClass('relative');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long descriptions', () => {
      const longDescriptionItem = {
        time: '10:30',
        category: 'system',
        description:
          'This is a very long description that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or functionality',
      };
      const propsWithLongDescription = { ...mockProps, items: [longDescriptionItem] };

      renderActivityLogGroupV2(propsWithLongDescription);
      expectActivityItemsToBeRenderedV2([longDescriptionItem], false);
    });

    it('should handle special characters in descriptions', () => {
      const specialCharsItem = {
        time: '10:30',
        category: 'system',
        description: 'Special chars: @#$%^&*()_+-=[]{}|;:,.<>?',
      };
      const propsWithSpecialChars = { ...mockProps, items: [specialCharsItem] };

      renderActivityLogGroupV2(propsWithSpecialChars);
      expectActivityItemsToBeRenderedV2([specialCharsItem], false);
    });

    it('should handle different time formats', () => {
      const differentTimeItems = [
        { time: '9:05', category: 'system', description: 'Morning activity' },
        { time: '13:30', category: 'task', description: 'Afternoon activity' },
        { time: '23:59', category: 'notification', description: 'Late night activity' },
      ];
      const propsWithDifferentTimes = { ...mockProps, items: differentTimeItems };

      renderActivityLogGroupV2(propsWithDifferentTimes);
      expectActivityItemsToBeRenderedV2(differentTimeItems, false);
    });
  });
});
