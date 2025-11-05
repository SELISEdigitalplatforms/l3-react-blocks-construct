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

// V2-specific props for testing
const mockPropsEven = {
  ...mockActivityItem,
  isEven: true,
  isFirst: false,
  isLast: false,
};

const mockPropsOdd = {
  ...mockActivityItem,
  isEven: false,
  isFirst: false,
  isLast: false,
};

describe('ActivityLogItem V2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct V2 structure', () => {
      const { container } = render(<ActivityLogItem {...mockPropsEven} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('relative', 'flex', 'items-start', 'mb-4');
    });

    it('should render the center timeline indicator with V2 styling', () => {
      const { container } = render(<ActivityLogItem {...mockPropsEven} />);

      const timelineIndicator = container.querySelector(
        '.absolute.left-1\\/2.transform.-translate-x-1\\/2.mt-1\\.5.z-10'
      );
      expect(timelineIndicator).toBeInTheDocument();

      const indicatorDot = timelineIndicator?.querySelector('.w-4.h-4.bg-secondary.rounded-full');
      expect(indicatorDot).toBeInTheDocument();
    });

    it('should render two-column layout structure', () => {
      const { container } = render(<ActivityLogItem {...mockPropsEven} />);

      const leftColumn = container.querySelector('.w-1\\/2.pr-4.flex.justify-end');
      const rightColumn = container.querySelector('.w-1\\/2.pl-4');

      expect(leftColumn).toBeInTheDocument();
      expect(rightColumn).toBeInTheDocument();
    });
  });

  describe('Alternating Layout - Even Items (Right Side)', () => {
    it('should render even items on the right side', () => {
      render(<ActivityLogItem {...mockPropsEven} />);

      // Content should be in the right column
      const rightColumn = document.querySelector('.w-1\\/2.pl-4');
      const content = rightColumn?.querySelector('.max-w-\\[90\\%\\]');
      expect(content).toBeInTheDocument();

      // Left column should be empty for even items
      const leftColumn = document.querySelector('.w-1\\/2.pr-4.flex.justify-end');
      const leftContent = leftColumn?.querySelector('.text-right.max-w-\\[90\\%\\]');
      expect(leftContent).not.toBeInTheDocument();
    });

    it('should display time and category for even items', () => {
      render(<ActivityLogItem {...mockPropsEven} />);

      const expectedTime = new Date('2024-01-15T10:30:00Z').toLocaleString();
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
      expect(screen.getByText('system')).toBeInTheDocument();
      expect(screen.getByText('User logged in successfully')).toBeInTheDocument();
    });
  });

  describe('Alternating Layout - Odd Items (Left Side)', () => {
    it('should render odd items on the left side', () => {
      render(<ActivityLogItem {...mockPropsOdd} />);

      // Content should be in the left column
      const leftColumn = document.querySelector('.w-1\\/2.pr-4.flex.justify-end');
      const content = leftColumn?.querySelector('.text-right.max-w-\\[90\\%\\]');
      expect(content).toBeInTheDocument();

      // Right column should be empty for odd items
      const rightColumn = document.querySelector('.w-1\\/2.pl-4');
      const rightContent = rightColumn?.querySelector('.max-w-\\[90\\%\\]');
      expect(rightContent).not.toBeInTheDocument();
    });

    it('should display time and category for odd items', () => {
      render(<ActivityLogItem {...mockPropsOdd} />);

      const expectedTime = new Date('2024-01-15T10:30:00Z').toLocaleString();
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
      expect(screen.getByText('system')).toBeInTheDocument();
      expect(screen.getByText('User logged in successfully')).toBeInTheDocument();
    });
  });

  describe('V2-Specific Props Testing', () => {
    it('should handle isFirst prop correctly', () => {
      const propsFirst = { ...mockPropsEven, isFirst: true };
      const { container } = render(<ActivityLogItem {...propsFirst} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('mt-0');
    });

    it('should handle isLast prop correctly', () => {
      const propsLast = { ...mockPropsEven, isLast: true };
      const { container } = render(<ActivityLogItem {...propsLast} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('mb-0');
    });

    it('should handle both isFirst and isLast props', () => {
      const propsFirstLast = { ...mockPropsEven, isFirst: true, isLast: true };
      const { container } = render(<ActivityLogItem {...propsFirstLast} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('mt-0', 'mb-0');
    });
  });

  describe('Responsive Design Features', () => {
    it('should have responsive layout classes for even items', () => {
      const { container } = render(<ActivityLogItem {...mockPropsEven} />);

      const headerContainer = container.querySelector(
        '.flex.flex-col.lg\\:flex-row.items-start.lg\\:items-center'
      );
      expect(headerContainer).toBeInTheDocument();
    });

    it('should have responsive layout classes for odd items', () => {
      const { container } = render(<ActivityLogItem {...mockPropsOdd} />);

      const headerContainer = container.querySelector(
        '.flex.flex-col.lg\\:flex-row.items-end.lg\\:items-center'
      );
      expect(headerContainer).toBeInTheDocument();
    });

    it('should have responsive separator dot', () => {
      const { container } = render(<ActivityLogItem {...mockPropsEven} />);

      const separatorDot = container.querySelector(
        '.hidden.lg\\:inline.mx-2.h-2.w-2.rounded-full.bg-neutral-200'
      );
      expect(separatorDot).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should display description with correct V2 styling', () => {
      render(<ActivityLogItem {...mockPropsEven} />);

      const descriptionElement = screen.getByText('User logged in successfully');
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveClass('text-base', 'text-high-emphasis');
    });

    it('should display time with V2 styling', () => {
      render(<ActivityLogItem {...mockPropsEven} />);

      const expectedTime = new Date('2024-01-15T10:30:00Z').toLocaleString();
      const timeElement = screen.getByText(expectedTime);
      expect(timeElement).toHaveClass('text-medium-emphasis');
    });

    it('should display category with V2 styling', () => {
      render(<ActivityLogItem {...mockPropsEven} />);

      const categoryElement = screen.getByText('system');
      expect(categoryElement).toHaveClass('text-high-emphasis', 'font-semibold');
    });

    it('should handle long descriptions', () => {
      const propsWithLongDesc = {
        ...mockPropsEven,
        ...mockActivityItemWithLongDescription,
      };
      render(<ActivityLogItem {...propsWithLongDesc} />);

      const descriptionElement = screen.getByText(mockActivityItemWithLongDescription.description);
      expect(descriptionElement).toBeInTheDocument();
    });

    it('should handle special characters in descriptions', () => {
      const propsWithSpecialChars = {
        ...mockPropsEven,
        ...mockActivityItemWithSpecialChars,
      };
      render(<ActivityLogItem {...propsWithSpecialChars} />);

      const descriptionElement = screen.getByText('Special chars: @#$%^&*()_+-=[]{}|;:,.<>?');
      expect(descriptionElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional props gracefully', () => {
      const minimalProps = {
        ...mockActivityItem,
        isEven: true,
      };

      expect(() => {
        render(<ActivityLogItem {...minimalProps} />);
      }).not.toThrow();
    });

    it('should handle invalid date gracefully', () => {
      const propsWithInvalidDate = {
        ...mockPropsEven,
        time: 'invalid-date',
      };

      expect(() => {
        render(<ActivityLogItem {...propsWithInvalidDate} />);
      }).not.toThrow();
    });

    it('should handle empty strings gracefully', () => {
      const propsWithEmptyStrings = {
        ...mockPropsEven,
        category: '',
        description: '',
      };

      render(<ActivityLogItem {...propsWithEmptyStrings} />);

      // Time should still be displayed
      const expectedTime = new Date('2024-01-15T10:30:00Z').toLocaleString();
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });
  });
});
