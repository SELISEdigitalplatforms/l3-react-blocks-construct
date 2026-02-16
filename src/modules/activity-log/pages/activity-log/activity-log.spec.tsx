import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityLog } from './activity-log';
import '../../../../lib/utils/test-utils/shared-test-utils';

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

// Mock services: only provide activitiesData (and optional availableModulesData)
vi.mock('../../activity-log-v1/services/activity-log-v1-services', () => {
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
    availableModulesData: [
      { id: 'task_manager', label: 'TASK_MANAGER' },
      { id: 'calendar', label: 'CALENDAR' },
      { id: 'mail', label: 'MAIL' },
      { id: 'notifications', label: 'NOTIFICATIONS' },
    ],
  };
});

// Mock toolbar module (default export)
vi.mock('../../components/activity-log-toobar/activity-log-toolbar', () => ({
  default: ({
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
}));

// Mock timeline component (named export)
vi.mock('../../activity-log-v1/components/activity-log-timeline/activity-log-timeline', () => ({
  ActivityLogTimeline: ({ activities }: any) => (
    <div data-testid="activity-log-timeline">
      {activities.map((activity: any) => (
        <div key={activity.id} data-testid={`activity-${activity.id}`}>
          {activity.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock hook module
vi.mock('../../hooks/use-activity-log-filters', () => ({
  useActivityLogFilters: () => mockUseActivityLogFilters(),
}));

// Helper functions to reduce code duplication
const renderActivityLog = () => render(<ActivityLog />);

const expectComponentToBeInDocument = (testId: string) => {
  expect(screen.getByTestId(testId)).toBeInTheDocument();
};

const expectMainContainerStructure = (container: HTMLElement) => {
  const mainContainer = container.firstChild as HTMLElement;
  expect(mainContainer).toHaveClass('flex', 'w-full', 'flex-col');
};

const expectToolbarContent = (title = 'ACTIVITY_LOG', category = 'all') => {
  expect(screen.getByTestId('toolbar-title')).toHaveTextContent(title);
  expect(screen.getByTestId('selected-category')).toHaveTextContent(category);
};

const expectTimelineActivities = (activities = mockActivitiesData) => {
  activities.forEach((activity) => {
    expect(screen.getByTestId(`activity-${activity.id}`)).toHaveTextContent(activity.title);
  });
};

const expectBothComponentsRendered = () => {
  expectComponentToBeInDocument('activity-log-toolbar');
  expectComponentToBeInDocument('activity-log-timeline');
};

const expectEventHandlerCall = (buttonText: string, mockFn: any, expectedArgs?: any) => {
  const button = screen.getByText(buttonText);
  button.click();

  if (expectedArgs) {
    expect(mockFn).toHaveBeenCalledWith(expectedArgs);
  } else {
    expect(mockFn).toHaveBeenCalled();
  }
};

const mockFilteredActivitiesReturn = (overrides = {}) => {
  return {
    setSearchQuery: mockSetSearchQuery,
    setDateRange: mockSetDateRange,
    selectedCategory: 'all',
    setSelectedCategory: mockSetSelectedCategory,
    filteredActivities: mockFilteredActivities,
    ...overrides,
  };
};

describe('ActivityLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container with correct structure', () => {
      const { container } = renderActivityLog();
      expectMainContainerStructure(container);
    });

    it('should render ActivityLogToolbar component', () => {
      renderActivityLog();
      expectComponentToBeInDocument('activity-log-toolbar');
    });

    it('should render ActivityLogTimeline component', () => {
      renderActivityLog();
      expectComponentToBeInDocument('activity-log-timeline');
    });

    it('should display the correct title in toolbar', () => {
      renderActivityLog();
      expectToolbarContent();
    });
  });

  describe('Hook Integration', () => {
    it('should call useActivityLogFilters hook with activitiesData', () => {
      renderActivityLog();
      expect(mockUseActivityLogFilters).toHaveBeenCalled();
    });

    it('should pass filtered activities to timeline component', () => {
      renderActivityLog();
      expectTimelineActivities();
    });

    it('should display selected category from hook', () => {
      renderActivityLog();
      expectToolbarContent('ACTIVITY_LOG', 'all');
    });
  });

  describe('Props Passing', () => {
    it('should pass correct props to ActivityLogToolbar', () => {
      renderActivityLog();
      expectComponentToBeInDocument('activity-log-toolbar');
      expectToolbarContent();
    });

    it('should pass filtered activities to ActivityLogTimeline', () => {
      renderActivityLog();
      expectComponentToBeInDocument('activity-log-timeline');
      expectTimelineActivities();
    });
  });

  describe('Event Handlers', () => {
    it('should pass setSearchQuery as onSearchChange to toolbar', () => {
      renderActivityLog();
      expectEventHandlerCall('Search', mockSetSearchQuery, 'test search');
    });

    it('should pass setDateRange as onDateRangeChange to toolbar', () => {
      renderActivityLog();
      expectEventHandlerCall('Date Range', mockSetDateRange, {
        from: expect.any(Date),
        to: expect.any(Date),
      });
    });

    it('should pass setSelectedCategory as onCategoryChange to toolbar', () => {
      renderActivityLog();
      expectEventHandlerCall('Category', mockSetSelectedCategory, 'system');
    });
  });

  describe('Component Integration', () => {
    it('should render both toolbar and timeline components together', () => {
      renderActivityLog();
      expectBothComponentsRendered();
    });

    it('should maintain proper component hierarchy', () => {
      const { container } = renderActivityLog();
      expectMainContainerStructure(container);

      const mainDiv = container.firstChild;
      const toolbar = screen.getByTestId('activity-log-toolbar');
      const timeline = screen.getByTestId('activity-log-timeline');

      expect(mainDiv).toContainElement(toolbar);
      expect(mainDiv).toContainElement(timeline);
    });
  });

  describe('Data Flow', () => {
    it('should handle empty filtered activities', () => {
      mockUseActivityLogFilters.mockReturnValueOnce(
        mockFilteredActivitiesReturn({ filteredActivities: [] })
      );

      renderActivityLog();

      const timeline = screen.getByTestId('activity-log-timeline');
      expect(timeline).toBeInTheDocument();
      expect(timeline).toBeEmptyDOMElement();
    });

    it('should handle different selected categories', () => {
      mockUseActivityLogFilters.mockReturnValueOnce(
        mockFilteredActivitiesReturn({ selectedCategory: 'system' })
      );

      renderActivityLog();
      expectToolbarContent('ACTIVITY_LOG', 'system');
    });
  });
});
