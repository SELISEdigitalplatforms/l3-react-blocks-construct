import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from './timeline';
import '../../test-utils/shared-test-utils';

// Mock data - accessible in tests
const mockActivitiesData = [
  {
    id: '1',
    title: 'Test Timeline Activity 1',
    description: 'Test timeline description 1',
    timestamp: '2024-01-01T10:00:00Z',
    category: 'system',
  },
  {
    id: '2',
    title: 'Test Timeline Activity 2',
    description: 'Test timeline description 2',
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

// Mock the activity log v1 feature (toolbar and hook)
vi.mock('@/modules/activity-log-v1', () => {
  return {
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
    useActivityLogFilters: () => mockUseActivityLogFilters(),
  };
});

// Mock the activity log v2 feature (timeline and data)
vi.mock('@/modules/activity-log-v2', () => {
  // Mock data - defined inside the factory to avoid hoisting issues
  const mockActivitiesData = [
    {
      id: '1',
      title: 'Test Timeline Activity 1',
      description: 'Test timeline description 1',
      timestamp: '2024-01-01T10:00:00Z',
      category: 'system',
    },
    {
      id: '2',
      title: 'Test Timeline Activity 2',
      description: 'Test timeline description 2',
      timestamp: '2024-01-01T11:00:00Z',
      category: 'user',
    },
  ];

  return {
    activitiesData: mockActivitiesData,
    ActivityLogTimeline: ({ activities }: any) => (
      <div data-testid="activity-log-timeline">
        {activities.map((activity: any) => (
          <div key={activity.id} data-testid={`activity-${activity.id}`}>
            {activity.title}
          </div>
        ))}
      </div>
    ),
  };
});

describe('Timeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct structure', () => {
      const { container } = render(<Timeline />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'w-full', 'flex-col');
    });

    it('should render ActivityLogToolbar component', () => {
      render(<Timeline />);

      expect(screen.getByTestId('activity-log-toolbar')).toBeInTheDocument();
    });

    it('should render ActivityLogTimeline component', () => {
      render(<Timeline />);

      expect(screen.getByTestId('activity-log-timeline')).toBeInTheDocument();
    });

    it('should display the correct title in toolbar', () => {
      render(<Timeline />);

      expect(screen.getByTestId('toolbar-title')).toHaveTextContent('TIMELINE');
    });
  });

  describe('Hook Integration', () => {
    it('should call useActivityLogFilters hook with v2 activitiesData', () => {
      render(<Timeline />);

      expect(mockUseActivityLogFilters).toHaveBeenCalled();
    });

    it('should pass filtered activities to timeline component', () => {
      render(<Timeline />);

      expect(screen.getByTestId('activity-1')).toHaveTextContent('Test Timeline Activity 1');
      expect(screen.getByTestId('activity-2')).toHaveTextContent('Test Timeline Activity 2');
    });

    it('should display selected category from hook', () => {
      render(<Timeline />);

      expect(screen.getByTestId('selected-category')).toHaveTextContent('all');
    });
  });

  describe('Props Passing', () => {
    it('should pass correct props to ActivityLogToolbar', () => {
      render(<Timeline />);

      const toolbar = screen.getByTestId('activity-log-toolbar');
      expect(toolbar).toBeInTheDocument();

      // Verify title prop is "TIMELINE"
      expect(screen.getByTestId('toolbar-title')).toHaveTextContent('TIMELINE');

      // Verify selectedCategory prop
      expect(screen.getByTestId('selected-category')).toHaveTextContent('all');
    });

    it('should pass filtered activities to ActivityLogTimeline', () => {
      render(<Timeline />);

      const timeline = screen.getByTestId('activity-log-timeline');
      expect(timeline).toBeInTheDocument();

      // Verify activities are passed correctly
      expect(screen.getByTestId('activity-1')).toBeInTheDocument();
      expect(screen.getByTestId('activity-2')).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('should pass setSearchQuery as onSearchChange to toolbar', () => {
      render(<Timeline />);

      const searchButton = screen.getByText('Search');
      searchButton.click();

      expect(mockSetSearchQuery).toHaveBeenCalledWith('test search');
    });

    it('should pass setDateRange as onDateRangeChange to toolbar', () => {
      render(<Timeline />);

      const dateRangeButton = screen.getByText('Date Range');
      dateRangeButton.click();

      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: expect.any(Date),
        to: expect.any(Date),
      });
    });

    it('should pass setSelectedCategory as onCategoryChange to toolbar', () => {
      render(<Timeline />);

      const categoryButton = screen.getByText('Category');
      categoryButton.click();

      expect(mockSetSelectedCategory).toHaveBeenCalledWith('system');
    });
  });

  describe('Component Integration', () => {
    it('should render both toolbar and timeline components together', () => {
      render(<Timeline />);

      expect(screen.getByTestId('activity-log-toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('activity-log-timeline')).toBeInTheDocument();
    });

    it('should maintain proper component hierarchy', () => {
      const { container } = render(<Timeline />);

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

      render(<Timeline />);

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

      render(<Timeline />);

      expect(screen.getByTestId('selected-category')).toHaveTextContent('system');
    });
  });

  describe('Cross-Version Integration', () => {
    it('should integrate v1 toolbar with v2 timeline successfully', () => {
      const { container } = render(<Timeline />);

      // Verify v1 toolbar is rendered
      const toolbar = screen.getByTestId('activity-log-toolbar');
      expect(toolbar).toBeInTheDocument();

      // Verify v2 timeline is rendered
      const timeline = screen.getByTestId('activity-log-timeline');
      expect(timeline).toBeInTheDocument();

      // Verify they work together in the same container
      const mainDiv = container.firstChild;
      expect(mainDiv).toContainElement(toolbar);
      expect(mainDiv).toContainElement(timeline);
    });

    it('should use v1 hook with v2 data source', () => {
      render(<Timeline />);

      // Verify hook is called (v1 functionality)
      expect(mockUseActivityLogFilters).toHaveBeenCalled();

      // Verify v2 data is displayed in timeline
      expect(screen.getByTestId('activity-1')).toHaveTextContent('Test Timeline Activity 1');
      expect(screen.getByTestId('activity-2')).toHaveTextContent('Test Timeline Activity 2');
    });

    it('should maintain consistent filtering behavior across versions', () => {
      // Test with filtered data
      mockUseActivityLogFilters.mockReturnValueOnce({
        setSearchQuery: mockSetSearchQuery,
        setDateRange: mockSetDateRange,
        selectedCategory: 'system',
        setSelectedCategory: mockSetSelectedCategory,
        filteredActivities: [mockActivitiesData[0]], // Only first activity
      });

      render(<Timeline />);

      // Verify filtering works
      expect(screen.getByTestId('activity-1')).toBeInTheDocument();
      expect(screen.queryByTestId('activity-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('selected-category')).toHaveTextContent('system');
    });
  });
});
