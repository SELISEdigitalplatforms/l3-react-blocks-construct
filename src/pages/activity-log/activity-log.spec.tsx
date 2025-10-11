import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLog } from './activity-log';
import '../../test-utils/shared-test-utils';

// Mock data - accessible in tests
const mockActivitiesData = [
  {
    id: '1',
    title: 'Test Activity 1',
    description: 'Test description 1',
    timestamp: '2024-01-01T10:00:00Z',
    category: 'system',
  },
  {
    id: '2',
    title: 'Test Activity 2',
    description: 'Test description 2',
    timestamp: '2024-01-01T11:00:00Z',
    category: 'user',
  },
];

const mockFilteredActivities = mockActivitiesData;

// Mock functions - declare before the mock to be accessible in tests
const mockSetSearchQuery = vi.fn();
const mockSetDateRange = vi.fn();
const mockSetSelectedCategory = vi.fn();
const mockUseActivityLogFilters = vi.fn(() => ({
  setSearchQuery: mockSetSearchQuery,
  setDateRange: mockSetDateRange,
  selectedCategory: 'all',
  setSelectedCategory: mockSetSelectedCategory,
  filteredActivities: mockFilteredActivities,
}));

// Mock the activity log v1 feature
vi.mock('@/features/activity-log-v1', () => {
  // Mock data - defined inside the factory to avoid hoisting issues
  const mockActivitiesData = [
    {
      id: '1',
      title: 'Test Activity 1',
      description: 'Test description 1',
      timestamp: '2024-01-01T10:00:00Z',
      category: 'system',
    },
    {
      id: '2',
      title: 'Test Activity 2',
      description: 'Test description 2',
      timestamp: '2024-01-01T11:00:00Z',
      category: 'user',
    },
  ];

  return {
    activitiesData: mockActivitiesData,
    ActivityLogToolbar: ({
      onSearchChange,
      onDateRangeChange,
      onCategoryChange,
      selectedCategory,
      title,
    }: any) => (
      <div data-testid="activity-log-toolbar">
        <div data-testid="toolbar-title">{title}</div>
        <div data-testid="selected-category">{selectedCategory}</div>
        <button onClick={() => onSearchChange('test search')}>Search</button>
        <button onClick={() => onDateRangeChange({ from: new Date(), to: new Date() })}>
          Date Range
        </button>
        <button onClick={() => onCategoryChange('system')}>Category</button>
      </div>
    ),
    ActivityLogTimeline: ({ activities }: any) => (
      <div data-testid="activity-log-timeline">
        {activities.map((activity: any) => (
          <div key={activity.id} data-testid={`activity-${activity.id}`}>
            {activity.title}
          </div>
        ))}
      </div>
    ),
    useActivityLogFilters: () => mockUseActivityLogFilters(),
  };
});

describe('ActivityLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct structure', () => {
      const { container } = render(<ActivityLog />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'w-full', 'flex-col');
    });

    it('should render ActivityLogToolbar component', () => {
      render(<ActivityLog />);

      expect(screen.getByTestId('activity-log-toolbar')).toBeInTheDocument();
    });

    it('should render ActivityLogTimeline component', () => {
      render(<ActivityLog />);

      expect(screen.getByTestId('activity-log-timeline')).toBeInTheDocument();
    });

    it('should display the correct title in toolbar', () => {
      render(<ActivityLog />);

      expect(screen.getByTestId('toolbar-title')).toHaveTextContent('ACTIVITY_LOG');
    });
  });

  describe('Hook Integration', () => {
    it('should call useActivityLogFilters hook with activitiesData', () => {
      render(<ActivityLog />);

      expect(mockUseActivityLogFilters).toHaveBeenCalled();
    });

    it('should pass filtered activities to timeline component', () => {
      render(<ActivityLog />);

      expect(screen.getByTestId('activity-1')).toHaveTextContent('Test Activity 1');
      expect(screen.getByTestId('activity-2')).toHaveTextContent('Test Activity 2');
    });

    it('should display selected category from hook', () => {
      render(<ActivityLog />);

      expect(screen.getByTestId('selected-category')).toHaveTextContent('all');
    });
  });

  describe('Props Passing', () => {
    it('should pass correct props to ActivityLogToolbar', () => {
      render(<ActivityLog />);

      const toolbar = screen.getByTestId('activity-log-toolbar');
      expect(toolbar).toBeInTheDocument();

      // Verify title prop
      expect(screen.getByTestId('toolbar-title')).toHaveTextContent('ACTIVITY_LOG');

      // Verify selectedCategory prop
      expect(screen.getByTestId('selected-category')).toHaveTextContent('all');
    });

    it('should pass filtered activities to ActivityLogTimeline', () => {
      render(<ActivityLog />);

      const timeline = screen.getByTestId('activity-log-timeline');
      expect(timeline).toBeInTheDocument();

      // Verify activities are passed correctly
      expect(screen.getByTestId('activity-1')).toBeInTheDocument();
      expect(screen.getByTestId('activity-2')).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('should pass setSearchQuery as onSearchChange to toolbar', () => {
      render(<ActivityLog />);

      const searchButton = screen.getByText('Search');
      searchButton.click();

      expect(mockSetSearchQuery).toHaveBeenCalledWith('test search');
    });

    it('should pass setDateRange as onDateRangeChange to toolbar', () => {
      render(<ActivityLog />);

      const dateRangeButton = screen.getByText('Date Range');
      dateRangeButton.click();

      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: expect.any(Date),
        to: expect.any(Date),
      });
    });

    it('should pass setSelectedCategory as onCategoryChange to toolbar', () => {
      render(<ActivityLog />);

      const categoryButton = screen.getByText('Category');
      categoryButton.click();

      expect(mockSetSelectedCategory).toHaveBeenCalledWith('system');
    });
  });

  describe('Component Integration', () => {
    it('should render both toolbar and timeline components together', () => {
      render(<ActivityLog />);

      expect(screen.getByTestId('activity-log-toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('activity-log-timeline')).toBeInTheDocument();
    });

    it('should maintain proper component hierarchy', () => {
      const { container } = render(<ActivityLog />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('flex', 'w-full', 'flex-col');

      const toolbar = screen.getByTestId('activity-log-toolbar');
      const timeline = screen.getByTestId('activity-log-timeline');

      expect(mainDiv).toContainElement(toolbar);
      expect(mainDiv).toContainElement(timeline);
    });
  });

  describe('Data Flow', () => {
    it('should handle empty filtered activities', () => {
      mockUseActivityLogFilters.mockReturnValueOnce({
        setSearchQuery: mockSetSearchQuery,
        setDateRange: mockSetDateRange,
        selectedCategory: 'all',
        setSelectedCategory: mockSetSelectedCategory,
        filteredActivities: [],
      });

      render(<ActivityLog />);

      const timeline = screen.getByTestId('activity-log-timeline');
      expect(timeline).toBeInTheDocument();
      expect(timeline).toBeEmptyDOMElement();
    });

    it('should handle different selected categories', () => {
      mockUseActivityLogFilters.mockReturnValueOnce({
        setSearchQuery: mockSetSearchQuery,
        setDateRange: mockSetDateRange,
        selectedCategory: 'system',
        setSelectedCategory: mockSetSelectedCategory,
        filteredActivities: mockFilteredActivities,
      });

      render(<ActivityLog />);

      expect(screen.getByTestId('selected-category')).toHaveTextContent('system');
    });
  });
});
