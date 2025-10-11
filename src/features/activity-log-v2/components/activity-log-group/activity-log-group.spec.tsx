import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogGroup } from './activity-log-group';
import { ActivityItem } from '../../types/activity-log.types';
import '../../../../test-utils/shared-test-utils';

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

describe('ActivityLogGroup V2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct V2 structure', () => {
      const { container } = render(<ActivityLogGroup {...mockProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('mb-8', 'relative');
    });

    it('should render the date badge with correct V2 styling', () => {
      render(<ActivityLogGroup {...mockProps} />);

      const dateLabel = screen.getByText('MOCK_WEEKDAY - 2024-01-15');
      expect(dateLabel).toBeInTheDocument();
      expect(dateLabel).toHaveClass(
        'bg-secondary-50',
        'text-secondary-800',
        'text-xs',
        'font-medium',
        'py-1',
        'px-2',
        'rounded'
      );
    });

    it('should render the date badge container with centered layout', () => {
      const { container } = render(<ActivityLogGroup {...mockProps} />);

      const dateBadgeContainer = container.querySelector('.flex.justify-center.mb-4.relative.z-10');
      expect(dateBadgeContainer).toBeInTheDocument();
    });

    it('should render the items container with correct styling', () => {
      const { container } = render(<ActivityLogGroup {...mockProps} />);

      const itemsContainer = container.querySelector('.relative:last-child');
      expect(itemsContainer).toBeInTheDocument();
      expect(itemsContainer).toHaveClass('relative');
    });

    it('should render all activity items with V2-specific props', () => {
      render(<ActivityLogGroup {...mockProps} />);

      const activityItems = screen.getAllByTestId('activity-log-item');
      expect(activityItems).toHaveLength(3);

      // Verify each item is rendered with correct props including V2-specific ones
      expect(activityItems[0]).toHaveAttribute('data-time', '10:30');
      expect(activityItems[0]).toHaveAttribute('data-category', 'system');
      expect(activityItems[0]).toHaveAttribute('data-is-even', 'true');
      expect(activityItems[0]).toHaveAttribute('data-is-first', 'true');
      expect(activityItems[0]).toHaveAttribute('data-is-last', 'false');
      expect(activityItems[0]).toHaveTextContent('User logged in successfully');

      expect(activityItems[1]).toHaveAttribute('data-time', '11:45');
      expect(activityItems[1]).toHaveAttribute('data-category', 'task');
      expect(activityItems[1]).toHaveAttribute('data-is-even', 'false');
      expect(activityItems[1]).toHaveAttribute('data-is-first', 'false');
      expect(activityItems[1]).toHaveAttribute('data-is-last', 'false');
      expect(activityItems[1]).toHaveTextContent('Task completed: Review documents');

      expect(activityItems[2]).toHaveAttribute('data-time', '14:20');
      expect(activityItems[2]).toHaveAttribute('data-category', 'notification');
      expect(activityItems[2]).toHaveAttribute('data-is-even', 'true');
      expect(activityItems[2]).toHaveAttribute('data-is-first', 'false');
      expect(activityItems[2]).toHaveAttribute('data-is-last', 'false');
      expect(activityItems[2]).toHaveTextContent('New message received');
    });
  });

  describe('Date Label Formatting', () => {
    it('should call getFormattedDateLabel with the correct date', async () => {
      const { getFormattedDateLabel } = vi.mocked(await import('../../utils/activity-log-utils'));

      render(<ActivityLogGroup {...mockProps} />);

      expect(getFormattedDateLabel).toHaveBeenCalledWith('2024-01-15');
    });

    it('should display the formatted date label', () => {
      render(<ActivityLogGroup {...mockProps} />);

      expect(screen.getByText('MOCK_WEEKDAY - 2024-01-15')).toBeInTheDocument();
    });

    it('should handle different date formats', () => {
      const propsWithDifferentDate = {
        ...mockProps,
        date: '2024-12-25',
      };

      render(<ActivityLogGroup {...propsWithDifferentDate} />);

      expect(screen.getByText('MOCK_WEEKDAY - 2024-12-25')).toBeInTheDocument();
    });
  });

  describe('Activity Items Rendering', () => {
    it('should render items with unique keys', () => {
      const { container } = render(<ActivityLogGroup {...mockProps} />);

      const activityItems = container.querySelectorAll('[data-testid="activity-log-item"]');
      expect(activityItems).toHaveLength(3);

      // Verify items are rendered in correct order
      expect(activityItems[0]).toHaveTextContent('User logged in successfully');
      expect(activityItems[1]).toHaveTextContent('Task completed: Review documents');
      expect(activityItems[2]).toHaveTextContent('New message received');
    });

    it('should handle empty items array', () => {
      const propsWithEmptyItems = {
        ...mockProps,
        items: [],
      };

      render(<ActivityLogGroup {...propsWithEmptyItems} />);

      const activityItems = screen.queryAllByTestId('activity-log-item');
      expect(activityItems).toHaveLength(0);

      // Date label should still be rendered
      expect(screen.getByText('MOCK_WEEKDAY - 2024-01-15')).toBeInTheDocument();
    });

    it('should handle single item', () => {
      const propsWithSingleItem = {
        ...mockProps,
        items: [mockActivityItems[0]],
      };

      render(<ActivityLogGroup {...propsWithSingleItem} />);

      const activityItems = screen.getAllByTestId('activity-log-item');
      expect(activityItems).toHaveLength(1);
      expect(activityItems[0]).toHaveTextContent('User logged in successfully');
    });
  });

  describe('V2-Specific Props Testing', () => {
    it('should pass isLast=true to the last item when isLastIndex=true', () => {
      const propsWithLastIndex = { ...mockProps, isLastIndex: true };
      render(<ActivityLogGroup {...propsWithLastIndex} />);

      const activityItems = screen.getAllByTestId('activity-log-item');
      const lastItem = activityItems[activityItems.length - 1];

      expect(lastItem).toHaveAttribute('data-is-last', 'true');
    });

    it('should pass isLast=false to all items when isLastIndex=false', () => {
      render(<ActivityLogGroup {...mockProps} />);

      const activityItems = screen.getAllByTestId('activity-log-item');
      activityItems.forEach((item) => {
        expect(item).toHaveAttribute('data-is-last', 'false');
      });
    });

    it('should correctly alternate isEven prop for items', () => {
      render(<ActivityLogGroup {...mockProps} />);

      const activityItems = screen.getAllByTestId('activity-log-item');

      expect(activityItems[0]).toHaveAttribute('data-is-even', 'true'); // index 0
      expect(activityItems[1]).toHaveAttribute('data-is-even', 'false'); // index 1
      expect(activityItems[2]).toHaveAttribute('data-is-even', 'true'); // index 2
    });

    it('should mark only the first item as isFirst=true', () => {
      render(<ActivityLogGroup {...mockProps} />);

      const activityItems = screen.getAllByTestId('activity-log-item');

      expect(activityItems[0]).toHaveAttribute('data-is-first', 'true');
      expect(activityItems[1]).toHaveAttribute('data-is-first', 'false');
      expect(activityItems[2]).toHaveAttribute('data-is-first', 'false');
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

      render(<ActivityLogGroup {...testProps} />);

      expect(screen.getByText('MOCK_WEEKDAY - 2024-06-15')).toBeInTheDocument();
      expect(screen.getByTestId('activity-log-item')).toHaveTextContent('Team standup meeting');

      // V2 doesn't use separators
      expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
    });

    it('should pass correct props to ActivityLogItem components', () => {
      render(<ActivityLogGroup {...mockProps} />);

      const activityItems = screen.getAllByTestId('activity-log-item');

      // Verify props are passed correctly to each ActivityLogItem
      mockActivityItems.forEach((item, index) => {
        expect(activityItems[index]).toHaveAttribute('data-time', item.time);
        expect(activityItems[index]).toHaveAttribute('data-category', item.category);
        expect(activityItems[index]).toHaveTextContent(item.description);
      });
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper V2 DOM hierarchy', () => {
      const { container } = render(<ActivityLogGroup {...mockProps} />);

      const mainContainer = container.firstChild as HTMLElement;

      // Check main container structure (V2 uses mb-8)
      expect(mainContainer).toHaveClass('mb-8', 'relative');

      // Check date badge container is first child
      const dateBadgeContainer = mainContainer.firstChild as HTMLElement;
      expect(dateBadgeContainer).toHaveClass('flex', 'justify-center', 'mb-4', 'relative', 'z-10');

      // Check items container is second child
      const itemsContainer = mainContainer.children[1] as HTMLElement;
      expect(itemsContainer).toHaveClass('relative');

      // V2 doesn't have separators
      expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
    });

    it('should render components in correct order', () => {
      const { container } = render(<ActivityLogGroup {...mockProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      const children = Array.from(mainContainer.children);

      // V2 structure: only 2 children (no separator)
      expect(children).toHaveLength(2);

      // First child: date badge container
      expect(children[0]).toHaveClass('flex', 'justify-center', 'mb-4', 'relative', 'z-10');
      expect(children[0]).toContainElement(screen.getByText('MOCK_WEEKDAY - 2024-01-15'));

      // Second child: items container
      expect(children[1]).toHaveClass('relative');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long descriptions', () => {
      const propsWithLongDescription = {
        ...mockProps,
        items: [
          {
            time: '10:30',
            category: 'system',
            description:
              'This is a very long description that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or functionality',
          },
        ],
      };

      render(<ActivityLogGroup {...propsWithLongDescription} />);

      const activityItem = screen.getByTestId('activity-log-item');
      expect(activityItem).toHaveTextContent(propsWithLongDescription.items[0].description);
    });

    it('should handle special characters in descriptions', () => {
      const propsWithSpecialChars = {
        ...mockProps,
        items: [
          {
            time: '10:30',
            category: 'system',
            description: 'Special chars: @#$%^&*()_+-=[]{}|;:,.<>?',
          },
        ],
      };

      render(<ActivityLogGroup {...propsWithSpecialChars} />);

      const activityItem = screen.getByTestId('activity-log-item');
      expect(activityItem).toHaveTextContent('Special chars: @#$%^&*()_+-=[]{}|;:,.<>?');
    });

    it('should handle different time formats', () => {
      const propsWithDifferentTimes = {
        ...mockProps,
        items: [
          { time: '9:05', category: 'system', description: 'Morning activity' },
          { time: '13:30', category: 'task', description: 'Afternoon activity' },
          { time: '23:59', category: 'notification', description: 'Late night activity' },
        ],
      };

      render(<ActivityLogGroup {...propsWithDifferentTimes} />);

      const activityItems = screen.getAllByTestId('activity-log-item');
      expect(activityItems[0]).toHaveAttribute('data-time', '9:05');
      expect(activityItems[1]).toHaveAttribute('data-time', '13:30');
      expect(activityItems[2]).toHaveAttribute('data-time', '23:59');
    });
  });
});
