import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActivityLogToolbar } from './activity-log-toolbar';
import '../../../../test-utils/shared-test-utils';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock dependencies
vi.mock('@/components/ui-kit/button', () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui-kit/input', () => ({
  Input: ({ onChange, value, placeholder, className, ...props }: any) => (
    <input
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={className}
      data-testid="search-input"
      {...props}
    />
  ),
}));

vi.mock('@/components/ui-kit/popover', () => ({
  Popover: ({ children, open, onOpenChange }: any) => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange?.(false);
      }
    };

    return (
      <div
        data-testid="popover"
        data-open={open}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {children}
      </div>
    );
  },
  PopoverTrigger: ({ children, asChild }: any) => {
    if (asChild) {
      return children;
    }
    return (
      <button type="button" data-testid="popover-trigger" aria-label="Open popover">
        {children}
      </button>
    );
  },
  PopoverContent: ({ children, className }: any) => (
    <dialog data-testid="popover-content" className={className} aria-modal="false" open>
      {children}
    </dialog>
  ),
}));

vi.mock('@/components/ui-kit/calendar', () => ({
  Calendar: ({ mode, onSelect, numberOfMonths, className }: any) => {
    const handleDateSelect = () => {
      onSelect?.({ from: new Date('2024-01-01'), to: new Date('2024-01-31') });
    };

    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDateSelect();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        // Calendar escape behavior - could close or clear selection
      }
    };

    return (
      <div
        data-testid="calendar"
        data-mode={mode}
        data-months={numberOfMonths}
        className={className}
        role="application"
        aria-label={`Calendar picker in ${mode} mode`}
        aria-describedby="calendar-instructions"
        onClick={handleDateSelect}
      >
        <div id="calendar-instructions" className="sr-only">
          Use arrow keys to navigate dates, Enter or Space to select
        </div>
        <button
          type="button"
          onClick={handleDateSelect}
          onKeyDown={handleKeyDown}
          aria-label="Select date range"
        >
          Calendar Component
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/ui-kit/command', () => ({
  Command: ({ children }: any) => <div data-testid="command">{children}</div>,
  CommandInput: ({ placeholder }: any) => (
    <input data-testid="command-input" placeholder={placeholder} />
  ),
  CommandList: ({ children }: any) => <div data-testid="command-list">{children}</div>,
  CommandEmpty: ({ children }: any) => <div data-testid="command-empty">{children}</div>,
  CommandGroup: ({ children }: any) => <div data-testid="command-group">{children}</div>,
  CommandItem: ({ children, onSelect, className }: any) => {
    return (
      <button
        type="button"
        data-testid="command-item"
        className={className}
        onClick={onSelect}
        aria-label="Select item"
      >
        {children}
      </button>
    );
  },
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  PlusCircle: () => <div data-testid="plus-circle-icon" />,
  Check: () => <div data-testid="check-icon" />,
}));

// Mock lodash debounce
vi.mock('lodash', () => ({
  debounce: (fn: (...args: any[]) => void) => {
    const debouncedFn = (...args: any[]) => fn(...args);
    debouncedFn.cancel = vi.fn();
    return debouncedFn;
  },
}));

// Mock the available modules data
vi.mock('@/modules/activity-log/activity-log-v1/services/activity-log-v1-services', () => ({
  availableModulesData: [
    { id: 'task_manager', label: 'TASK_MANAGER' },
    { id: 'calendar', label: 'CALENDAR' },
    { id: 'mail', label: 'MAIL' },
    { id: 'notifications', label: 'NOTIFICATIONS' },
  ],
}));

// Test props
const defaultProps = {
  onCategoryChange: vi.fn(),
  selectedCategory: [],
};

const propsWithCallbacks = {
  onSearchChange: vi.fn(),
  onDateRangeChange: vi.fn(),
  onCategoryChange: vi.fn(),
  selectedCategory: ['task_manager', 'calendar'],
  title: 'CUSTOM_TITLE',
};

describe('ActivityLogToolbar V1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default props', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      // Should render title
      expect(screen.getByText('ACTIVITY_LOG')).toBeInTheDocument();

      // Should render search input
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('SEARCH_BY_DESCRIPTION')).toBeInTheDocument();

      // Should render date and module buttons
      expect(screen.getByText('DATE')).toBeInTheDocument();
      expect(screen.getByText('MODULE')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      expect(screen.getByText('CUSTOM_TITLE')).toBeInTheDocument();
    });

    it('should render icons correctly', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('plus-circle-icon')).toHaveLength(2); // Date and Module buttons
    });
  });

  describe('Search Functionality', () => {
    it('should handle search input changes', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      const searchInput = screen.getByTestId('search-input');

      await user.type(searchInput, 'test search');

      expect(searchInput).toHaveValue('test search');
      // Note: debounced function is mocked to call immediately
      expect(propsWithCallbacks.onSearchChange).toHaveBeenCalledWith('test search');
    });

    it('should render search input with correct placeholder', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      expect(screen.getByPlaceholderText('SEARCH_BY_DESCRIPTION')).toBeInTheDocument();
    });

    it('should call onSearchChange when provided', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'search query');

      expect(propsWithCallbacks.onSearchChange).toHaveBeenCalledWith('search query');
    });

    it('should not crash when onSearchChange is not provided', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...defaultProps} />);

      const searchInput = screen.getByTestId('search-input');

      expect(() => user.type(searchInput, 'test')).not.toThrow();
    });
  });

  describe('Date Range Functionality', () => {
    it('should render date picker button', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      expect(screen.getByText('DATE')).toBeInTheDocument();
    });

    it('should handle date range selection', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      const dateButton = screen.getByText('DATE');
      await user.click(dateButton);

      const calendar = screen.getByTestId('calendar');
      expect(calendar).toBeInTheDocument();

      await user.click(calendar);

      expect(propsWithCallbacks.onDateRangeChange).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      });
    });

    it('should handle clear date filter', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      const clearButton = screen.getByText('CLEAR_FILTER');
      await user.click(clearButton);

      expect(propsWithCallbacks.onDateRangeChange).toHaveBeenCalledWith(undefined);
    });

    it('should not crash when onDateRangeChange is not provided', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...defaultProps} />);

      const dateButton = screen.getByText('DATE');

      expect(() => user.click(dateButton)).not.toThrow();
    });
  });

  describe('Module Selection Functionality', () => {
    it('should render module picker button', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      expect(screen.getByText('MODULE')).toBeInTheDocument();
    });

    it('should render available modules', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      // Check that mocked modules are rendered
      expect(screen.getByText('TASK_MANAGER')).toBeInTheDocument();
      expect(screen.getByText('CALENDAR')).toBeInTheDocument();
      expect(screen.getByText('MAIL')).toBeInTheDocument();
      expect(screen.getByText('NOTIFICATIONS')).toBeInTheDocument();
    });

    it('should handle module selection', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      const taskManagerItem = screen.getByText('TASK_MANAGER');
      await user.click(taskManagerItem);

      // Should call onCategoryChange with updated selection
      expect(propsWithCallbacks.onCategoryChange).toHaveBeenCalled();
    });

    it('should show selected modules with check icons', () => {
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      // Should render check icons for selected modules
      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('should handle clear all modules', async () => {
      const user = userEvent.setup();
      render(<ActivityLogToolbar {...propsWithCallbacks} />);

      const clearAllButton = screen.getByText('CLEAR_ALL');
      await user.click(clearAllButton);

      expect(propsWithCallbacks.onCategoryChange).toHaveBeenCalledWith([]);
    });

    it('should show clear all button only when modules are selected', () => {
      // With selected modules
      const { rerender } = render(<ActivityLogToolbar {...propsWithCallbacks} />);
      expect(screen.getByText('CLEAR_ALL')).toBeInTheDocument();

      // Without selected modules
      rerender(<ActivityLogToolbar {...defaultProps} />);
      expect(screen.queryByText('CLEAR_ALL')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases and Props Validation', () => {
    it('should handle missing optional callbacks gracefully', () => {
      const minimalProps = {
        onCategoryChange: vi.fn(),
        selectedCategory: [],
      };

      expect(() => {
        render(<ActivityLogToolbar {...minimalProps} />);
      }).not.toThrow();
    });

    it('should use default title when title prop is not provided', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      expect(screen.getByText('ACTIVITY_LOG')).toBeInTheDocument();
    });

    it('should handle empty selectedCategory array', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      // Clear all button should not be visible
      expect(screen.queryByText('CLEAR_ALL')).not.toBeInTheDocument();
    });

    it('should render responsive classes correctly', () => {
      const { container } = render(<ActivityLogToolbar {...defaultProps} />);

      // Check main container has responsive classes
      const mainContainer = container.querySelector('.mb-\\[18px\\].flex.flex-col.sm\\:flex-row');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should handle translation keys correctly', () => {
      render(<ActivityLogToolbar {...defaultProps} />);

      // All text should be translation keys (mocked to return as-is)
      expect(screen.getByText('ACTIVITY_LOG')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('SEARCH_BY_DESCRIPTION')).toBeInTheDocument();
      expect(screen.getByText('DATE')).toBeInTheDocument();
      expect(screen.getByText('MODULE')).toBeInTheDocument();
      expect(screen.getByText('CLEAR_FILTER')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('ENTER_MODULE_NAME')).toBeInTheDocument();
      expect(screen.getByText('NO_MODULES_FOUND')).toBeInTheDocument();
    });

    it('should handle module selection and deselection logic', async () => {
      const user = userEvent.setup();
      const onCategoryChange = vi.fn();

      render(
        <ActivityLogToolbar
          onCategoryChange={onCategoryChange}
          selectedCategory={['task_manager']}
        />
      );

      // Click on already selected module (should deselect)
      const taskManagerItem = screen.getByText('TASK_MANAGER');
      await user.click(taskManagerItem);

      expect(onCategoryChange).toHaveBeenCalled();
    });
  });
});
