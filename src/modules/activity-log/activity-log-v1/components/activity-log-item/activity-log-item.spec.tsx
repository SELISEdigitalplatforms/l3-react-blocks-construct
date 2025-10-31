import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLogItem } from './activity-log-item';
import { ActivityItem } from '../../types/activity-log.types';
import '../../../../../test-utils/shared-test-utils';

// Test data
const mockActivityItem: ActivityItem = {
  time: '2024-01-15T10:30:00Z',
  category: 'system',
  description: 'User logged in successfully',
};

const mockActivityItemWithLongDescription: ActivityItem = {
  time: '2024-01-15T14:20:00Z',
  category: 'notification',
  description:
    'This is a very long description that might wrap to multiple lines and should be handled gracefully by the component without breaking the layout or functionality',
};

const mockActivityItemWithSpecialChars: ActivityItem = {
  time: '2024-01-15T16:45:00Z',
  category: 'task',
  description: 'Special chars: @#$%^&*()_+-=[]{}|;:,.<>?',
};

describe('ActivityLogItem V1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct structure', () => {
      const { container } = render(<ActivityLogItem {...mockActivityItem} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'mb-4', 'relative');
    });

    it('should render the timeline indicator with correct styling', () => {
      const { container } = render(<ActivityLogItem {...mockActivityItem} />);

      const timelineIndicator = container.querySelector(
        '.absolute.left-1\\.5.-ml-8.top-1\\.5.z-10'
      );
      expect(timelineIndicator).toBeInTheDocument();

      const indicatorDot = timelineIndicator?.querySelector('.h-4.w-4.bg-blue-400.rounded-full');
      expect(indicatorDot).toBeInTheDocument();
    });

    it('should render the content container with correct styling', () => {
      const { container } = render(<ActivityLogItem {...mockActivityItem} />);

      const contentContainer = container.querySelector('.flex-1');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('flex-1');
    });
  });

  describe('Time Display', () => {
    it('should display formatted time correctly', () => {
      render(<ActivityLogItem {...mockActivityItem} />);

      // The time should be formatted using toLocaleString()
      const expectedTime = new Date('2024-01-15T10:30:00Z').toLocaleString();
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it('should render time with correct styling', () => {
      render(<ActivityLogItem {...mockActivityItem} />);

      const expectedTime = new Date('2024-01-15T10:30:00Z').toLocaleString();
      const timeElement = screen.getByText(expectedTime);
      expect(timeElement).toHaveClass('text-xs', 'font-normal', 'text-medium-emphasis', 'mr-2');
    });
  });

  describe('Category Display', () => {
    it('should display category with correct styling', () => {
      render(<ActivityLogItem {...mockActivityItem} />);

      const categoryElement = screen.getByText('system');
      expect(categoryElement).toBeInTheDocument();
      expect(categoryElement).toHaveClass(
        'px-2',
        'py-0.5',
        'text-high-emphasis',
        'font-semibold',
        'text-sm',
        'bg-surface',
        'rounded'
      );
    });

    it('should render category separator dot', () => {
      const { container } = render(<ActivityLogItem {...mockActivityItem} />);

      const separatorDot = container.querySelector('.h-2.w-2.bg-gray-300.mr-2.rounded-full');
      expect(separatorDot).toBeInTheDocument();
    });
  });

  describe('Description Display', () => {
    it('should display description with correct styling', () => {
      render(<ActivityLogItem {...mockActivityItem} />);

      const descriptionElement = screen.getByText('User logged in successfully');
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveClass(
        'text-base',
        'text-high-emphasis',
        'text-gray-800',
        'mt-1'
      );
    });

    it('should handle long descriptions', () => {
      render(<ActivityLogItem {...mockActivityItemWithLongDescription} />);

      const descriptionElement = screen.getByText(mockActivityItemWithLongDescription.description);
      expect(descriptionElement).toBeInTheDocument();
    });

    it('should handle special characters in descriptions', () => {
      render(<ActivityLogItem {...mockActivityItemWithSpecialChars} />);

      const descriptionElement = screen.getByText('Special chars: @#$%^&*()_+-=[]{}|;:,.<>?');
      expect(descriptionElement).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper DOM hierarchy', () => {
      const { container } = render(<ActivityLogItem {...mockActivityItem} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'mb-4', 'relative');

      // Check timeline indicator
      const timelineIndicator = container.querySelector(
        '.absolute.left-1\\.5.-ml-8.top-1\\.5.z-10'
      );
      expect(timelineIndicator).toBeInTheDocument();

      // Check content container
      const contentContainer = container.querySelector('.flex-1');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should render header elements in correct order', () => {
      const { container } = render(<ActivityLogItem {...mockActivityItem} />);

      const headerContainer = container.querySelector('.flex.items-center');
      expect(headerContainer).toBeInTheDocument();

      const children = Array.from(headerContainer?.children || []);
      expect(children).toHaveLength(3);

      // First: time element
      expect(children[0]).toHaveClass('text-xs', 'font-normal', 'text-medium-emphasis', 'mr-2');

      // Second: separator dot
      expect(children[1]).toHaveClass('h-2', 'w-2', 'bg-gray-300', 'mr-2', 'rounded-full');

      // Third: category badge
      expect(children[2]).toHaveClass(
        'px-2',
        'py-0.5',
        'text-high-emphasis',
        'font-semibold',
        'text-sm',
        'bg-surface',
        'rounded'
      );
    });
  });

  describe('Props Validation', () => {
    it('should handle all ActivityItem props correctly', () => {
      const testItem: ActivityItem = {
        time: '2024-06-15T09:00:00Z',
        category: 'meeting',
        description: 'Team standup meeting',
      };

      render(<ActivityLogItem {...testItem} />);

      const expectedTime = new Date(testItem.time).toLocaleString();
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
      expect(screen.getByText(testItem.category)).toBeInTheDocument();
      expect(screen.getByText(testItem.description)).toBeInTheDocument();
    });

    it('should handle different time formats', () => {
      const items = [
        { ...mockActivityItem, time: '2024-01-15T09:05:00Z' },
        { ...mockActivityItem, time: '2024-01-15T13:30:00Z' },
        { ...mockActivityItem, time: '2024-01-15T23:59:00Z' },
      ];

      items.forEach((item) => {
        const { unmount } = render(<ActivityLogItem {...item} />);
        const expectedTime = new Date(item.time).toLocaleString();
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle different categories', () => {
      const categories = ['system', 'task', 'notification', 'meeting', 'error'];

      categories.forEach((category) => {
        const item = { ...mockActivityItem, category };
        const { unmount } = render(<ActivityLogItem {...item} />);
        expect(screen.getByText(category)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings gracefully', () => {
      const itemWithEmptyStrings: ActivityItem = {
        time: '2024-01-15T10:30:00Z',
        category: '',
        description: '',
      };

      render(<ActivityLogItem {...itemWithEmptyStrings} />);

      // Time should still be displayed
      const expectedTime = new Date(itemWithEmptyStrings.time).toLocaleString();
      expect(screen.getByText(expectedTime)).toBeInTheDocument();

      // Empty category and description should render as empty elements
      const { container } = render(<ActivityLogItem {...itemWithEmptyStrings} />);
      expect(container).toBeInTheDocument();
    });

    it('should handle invalid date gracefully', () => {
      const itemWithInvalidDate: ActivityItem = {
        time: 'invalid-date',
        category: 'system',
        description: 'Test description',
      };

      // This should not crash the component
      expect(() => {
        render(<ActivityLogItem {...itemWithInvalidDate} />);
      }).not.toThrow();
    });
  });
});
