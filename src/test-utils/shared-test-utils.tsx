import React from 'react';
import { screen } from '@testing-library/react';
import { vi, expect } from 'vitest';

// ------------------ Global Common Mocks ------------------
// These mocks are shared across ALL component tests to avoid code duplication.
// They execute immediately when this file is imported.

// react-i18next mock - used by most components
const mockI18n = {
  language: 'en',
  changeLanguage: vi.fn().mockResolvedValue(undefined),
};

const mockT = (key: string) => key;

const mockUseTranslation = () => ({
  t: mockT,
  i18n: mockI18n,
});

vi.mock('react-i18next', async () => {
  const actual: any = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: mockUseTranslation,
    I18nextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  };
});

// react-router-dom mock - used by components with routing
const mockNavigate = vi.fn();
const mockUseNavigate = () => mockNavigate;
const mockUseLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'test',
});

const mockUseParams = vi.fn().mockReturnValue({});
const mockUseSearchParams = () => [new URLSearchParams(), vi.fn()];

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-router">{children}</div>
);

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: mockUseNavigate,
    useLocation: mockUseLocation,
    useParams: mockUseParams,
    useSearchParams: mockUseSearchParams,
    BrowserRouter: MockRouter,
    MemoryRouter: MockRouter,
    HashRouter: MockRouter,
    Outlet: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="outlet">{children}</div>
    ),
    Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Route: ({ element, children }: { element?: React.ReactNode; children?: React.ReactNode }) => (
      <>{element ?? children}</>
    ),
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) => (
      <a href={to} {...props} data-testid="link">
        {children}
      </a>
    ),
    NavLink: ({
      children,
      to,
      className,
      style,
      ...props
    }: {
      children: React.ReactNode;
      to: string;
      className?: string;
      style?: React.CSSProperties;
      [key: string]: any;
    }) => (
      <a href={to} className={className} style={style} {...props} data-testid="nav-link">
        {children}
      </a>
    ),
    Navigate: ({ to }: { to: string }) => <div data-tegstid="navigate" data-to={to} />,
  };
});

// Export mocks for use in tests
export {
  mockNavigate,
  mockUseNavigate,
  mockUseLocation,
  mockUseParams,
  mockUseSearchParams,
  mockT,
  mockI18n,
};

// UI Card components mock - used by many components
vi.mock('@/components/ui-kit/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  ),
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

// UI Select components mock - used by many components
vi.mock('@/components/ui-kit/select', () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children, className }: any) => (
    <button data-testid="select-trigger" className={className}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectGroup: ({ children }: any) => <div data-testid="select-group">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

// Note: Button component mock is NOT included here as different components
// need different button test IDs. Each test file should mock buttons locally.

// ------------------ Shared Helper Functions ------------------
// These helpers encapsulate common expectations used across component tests.

export const expectElementWithClasses = (testId: string, classes: readonly string[]) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass(...classes);
  return element;
};

export const expectElementsExist = (testIds: readonly string[]) => {
  testIds.forEach((testId) => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
};

export const expectTextContent = (testId: string, content: string) => {
  const element = screen.getByTestId(testId);
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(content);
  return element;
};

export const expectElementsWithAttributes = (
  testId: string,
  expectedCount: number,
  attributeChecks: Array<{ attribute: string; value: string }>
) => {
  const elements = screen.getAllByTestId(testId);
  expect(elements).toHaveLength(expectedCount);
  attributeChecks.forEach((check, index) => {
    expect(elements[index]).toHaveAttribute(check.attribute, check.value);
  });
};

export const expectLabelsInDocument = (labels: readonly string[]) => {
  labels.forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument();
  });
};

export const expectTextElements = (texts: readonly string[]) => {
  texts.forEach((text) => {
    const elements = screen.getAllByText(text);
    expect(elements.length).toBeGreaterThan(0);
    elements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
};

export const expectElementsWithCount = (testId: string, expectedCount: number) => {
  const elements = screen.getAllByTestId(testId);
  expect(elements).toHaveLength(expectedCount);
  return elements;
};

// ------------------ Mock Factory Functions ------------------
// Reusable mock creators to reduce duplication

export const createMockIcon = (testId: string, title?: string) => {
  const MockIcon = ({ className }: { className?: string }) => (
    <svg data-testid={testId} className={className}>
      {title && <title>{title}</title>}
    </svg>
  );
  MockIcon.displayName = `MockIcon_${testId}`;
  return MockIcon;
};

export const createMockTranslation = () => (key: string) => key;

// ------------------ Common Test Data Patterns ------------------
// Reusable test data structures

export const COMMON_CARD_CLASSES = ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm'];
export const COMMON_TITLE_CLASSES = ['text-xl', 'text-high-emphasis'];
export const COMMON_SELECT_TRIGGER_CLASSES = ['w-[105px]', 'h-[28px]', 'px-2', 'py-1'];

// Error page common classes
export const ERROR_PAGE_CLASSES = {
  container: ['flex', 'justify-center', 'items-center', 'w-full'],
  content: ['flex', 'flex-col', 'gap-12'],
  textContainer: ['flex', 'flex-col', 'items-center'],
  title: ['text-high-emphasis', 'font-bold', 'text-[32px]', 'leading-[48px]'],
  description: ['mt-3', 'mb-6', 'text-medium-emphasis', 'font-semibold', 'text-2xl'],
  button: ['font-bold', 'text-sm'],
} as const;

// Finance component common classes
export const FINANCE_COMPONENT_CLASSES = {
  card: ['w-full', 'border-none', 'rounded-[8px]', 'shadow-sm'],
  title: ['text-2xl', 'font-semibold', 'text-high-emphasis'],
  selectTrigger: ['w-[105px]', 'h-[28px]', 'px-2', 'py-1'],
} as const;

// Common chart components for finance charts
export const FINANCE_CHART_COMPONENTS = [
  'responsive-container',
  'area-chart',
  'cartesian-grid',
  'x-axis',
  'y-axis',
  'tooltip',
  'area',
] as const;

// Bar chart components for finance bar charts
export const FINANCE_BAR_CHART_COMPONENTS = [
  'chart-container',
  'bar-chart',
  'cartesian-grid',
  'x-axis',
  'y-axis',
  'chart-tooltip',
] as const;

// Common time period data
export const FINANCE_TIME_PERIODS = {
  values: ['this-year', 'last-year', 'last-6-months'],
  labels: ['THIS_YEAR', 'LAST_YEAR', 'LAST_SIX_MONTHS'],
} as const;

// ------------------ Console Error Suppression ------------------
// Helper for testing components without console noise

export const suppressConsoleErrors = () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    // Mock implementation to suppress console errors during testing
  });
  return consoleSpy;
};

// ------------------ Error Page Specific Helpers ------------------
// Shared utilities for error page components

export const expectElementWithClassesDirect = (
  element: HTMLElement,
  classes: readonly string[]
) => {
  classes.forEach((className) => {
    expect(element).toHaveClass(className);
  });
};

export const expectErrorPageStructure = (titleText: string) => {
  // Test basic structure
  expect(screen.getByText(titleText)).toBeInTheDocument();

  // Test container structure
  const container = screen.getByText(titleText).closest('div')?.parentElement?.parentElement;
  expect(container).toBeInTheDocument();
  if (container) {
    expectElementWithClassesDirect(container, ERROR_PAGE_CLASSES.container);
  }

  // Test content wrapper
  const contentWrapper = screen.getByText(titleText).closest('div')?.parentElement;
  expect(contentWrapper).toBeInTheDocument();
  if (contentWrapper) {
    expectElementWithClassesDirect(contentWrapper, ERROR_PAGE_CLASSES.content);
  }

  return { container, contentWrapper };
};

export const expectErrorPageImage = (altText: string, expectedSrc: string) => {
  const image = screen.getByAltText(altText);
  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute('src', expectedSrc);
  expect(image).toHaveAttribute('alt', altText);
  expect(image.tagName).toBe('IMG');
  return image;
};

export const expectErrorPageTextContent = (titleText: string, descriptionText: string) => {
  // Test title
  const title = screen.getByRole('heading', { level: 1 });
  expect(title).toBeInTheDocument();
  expect(title).toHaveTextContent(titleText);
  expectElementWithClassesDirect(title, ERROR_PAGE_CLASSES.title);

  // Test description
  const description = screen.getByText(descriptionText);
  expect(description).toBeInTheDocument();
  expect(description.tagName).toBe('P');
  expectElementWithClassesDirect(description, ERROR_PAGE_CLASSES.description);

  // Test text container
  const textContainer = screen.getByText(titleText).parentElement;
  expect(textContainer).toBeInTheDocument();
  if (textContainer) {
    expectElementWithClassesDirect(textContainer, ERROR_PAGE_CLASSES.textContainer);
  }

  return { title, description, textContainer };
};

export const expectErrorPageButton = (buttonText: string, iconTestId?: string) => {
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent(buttonText);
  expectElementWithClassesDirect(button, ERROR_PAGE_CLASSES.button);

  if (iconTestId) {
    const icon = screen.getByTestId(iconTestId);
    expect(icon).toBeInTheDocument();
    expect(button).toContainElement(icon);
  }

  return button;
};

export const expectErrorPageAccessibility = (
  titleText: string,
  altText: string,
  buttonText: string,
  iconTitle?: string
) => {
  // Test heading hierarchy
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toBeInTheDocument();

  // Test image accessibility
  const image = screen.getByAltText(altText);
  expect(image).toHaveAccessibleName(altText);

  // Test button accessibility
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();

  if (iconTitle) {
    const expectedAccessibleName = `${buttonText}${iconTitle}`;
    expect(button).toHaveAccessibleName(expectedAccessibleName);
  } else {
    expect(button).toHaveAccessibleName(buttonText);
  }

  return { heading, image, button };
};

export const expectErrorPageLayoutStructure = (
  titleText: string,
  descriptionText: string,
  buttonText: string,
  altText: string
) => {
  // Test elements in correct order
  const container = screen.getByText(titleText).closest('div')?.parentElement;
  const children = Array.from(container?.children || []);

  expect(children).toHaveLength(2);

  // First child should be the image
  const image = children[0] as HTMLImageElement;
  expect(image.tagName).toBe('IMG');
  expect(image).toHaveAttribute('alt', altText);

  // Second child should be the text container
  const textContainer = children[1];
  expect(textContainer).toContainElement(screen.getByRole('heading', { level: 1 }));
  expect(textContainer).toContainElement(screen.getByRole('button'));

  // Test text elements order within text container
  const textChildren = Array.from(screen.getByText(titleText).parentElement?.children || []);
  expect(textChildren).toHaveLength(3);

  // First: title (h1)
  expect(textChildren[0].tagName).toBe('H1');
  expect(textChildren[0]).toHaveTextContent(titleText);

  // Second: description (p)
  expect(textChildren[1].tagName).toBe('P');
  expect(textChildren[1]).toHaveTextContent(descriptionText);

  // Third: button
  expect(textChildren[2].tagName).toBe('BUTTON');
  expect(textChildren[2]).toHaveTextContent(buttonText);

  return { container, textContainer, textChildren };
};

// ------------------ Finance Component Specific Helpers ------------------
// Shared utilities for finance component tests

export const expectFinanceCardStructure = (titleText: string, descriptionText: string) => {
  // Test basic card structure
  expectElementWithClasses('card', FINANCE_COMPONENT_CLASSES.card);
  expectElementsExist(['card-header', 'card-content']);

  // Test title
  const title = expectElementWithClasses('card-title', FINANCE_COMPONENT_CLASSES.title);
  expect(title).toHaveTextContent(titleText);

  // Test description
  expectTextContent('card-description', descriptionText);

  return { title };
};

export const expectFinanceChartComponents = (chartComponents: readonly string[]) => {
  expectElementsExist(chartComponents);
};

export const expectFinanceChartDataKeys = (areaDataKey: string, xAxisDataKey: string) => {
  expect(screen.getByTestId('area')).toHaveAttribute('data-key', areaDataKey);
  expect(screen.getByTestId('x-axis')).toHaveAttribute('data-key', xAxisDataKey);
};

export const expectFinanceBarChartDataKeys = (
  xAxisDataKey: string,
  barData: readonly { key: string; name: string }[]
) => {
  expect(screen.getByTestId('x-axis')).toHaveAttribute('data-key', xAxisDataKey);

  // Check bar elements
  expectElementsWithAttributes(
    'bar',
    barData.length,
    barData.map((bar) => ({ attribute: 'data-key', value: bar.key }))
  );
};

export const expectFinanceTimePeriodSelector = (timePeriodValues: readonly string[]) => {
  expectElementWithClasses('select-trigger', FINANCE_COMPONENT_CLASSES.selectTrigger);

  // Check select items with values - create attribute checks for all values at once
  const attributeChecks = timePeriodValues.map((value) => ({ attribute: 'data-value', value }));
  expectElementsWithAttributes('select-item', timePeriodValues.length, attributeChecks);
};

export const expectFinanceComponentExport = (component: any) => {
  expect(component).toBeDefined();
  expect(typeof component).toBe('function');
};

// Finance overview specific helpers
export const expectPatternElements = (patterns: readonly RegExp[]) => {
  patterns.forEach((pattern) => {
    expect(screen.getByText(pattern)).toBeInTheDocument();
  });
};

export const expectFinanceOverviewMetrics = (
  metricTitles: readonly string[],
  amountPatterns: readonly RegExp[]
) => {
  expectTextElements(metricTitles);
  expectPatternElements(amountPatterns);
};

export const expectFinanceOverviewIcons = (
  iconIds: readonly string[],
  trendingIconsCount: number
) => {
  expectElementsExist(iconIds);
  expectElementsWithCount('trending-up-icon', trendingIconsCount);
};

export const expectFinanceOverviewCardStructure = (titleText: string) => {
  // Test basic card structure
  expectElementWithClasses('card', COMMON_CARD_CLASSES);
  expectElementsExist(['card-header', 'card-content']);

  // Test title
  const title = expectElementWithClasses('card-title', COMMON_TITLE_CLASSES);
  expect(title).toHaveTextContent(titleText);

  return { title };
};

export const expectFinanceOverviewMonthSelector = (
  monthsCount: number,
  firstMonth: string,
  lastMonth: string
) => {
  expectElementWithClasses('select-trigger', ['w-[120px]', 'h-[28px]', 'px-2', 'py-1']);

  const selectItems = expectElementsWithCount('select-item', monthsCount);

  // Check boundary month values
  expect(selectItems[0]).toHaveAttribute('data-value', firstMonth);
  expect(selectItems[monthsCount - 1]).toHaveAttribute('data-value', lastMonth);

  return selectItems;
};

// Finance overview mock factories
export const createFinanceOverviewServicesMock = () => {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const createInlineMetric = (
    titleKey: string,
    amount: string,
    iconTestId: string,
    iconColor: string,
    iconBg?: string,
    trend?: any
  ) => ({
    titleKey,
    amount,
    icon: createMockIcon(iconTestId, titleKey),
    iconColor,
    ...(iconBg && { iconBg }),
    ...(trend && {
      trend: { ...trend, icon: createMockIcon('trending-up-icon', 'Trending Up') },
    }),
  });

  return {
    monthsOfYear: months.map((month: string) => ({ value: month, label: month.toUpperCase() })),
    metricsData: [
      createInlineMetric('NET_PROFIT', '44,450.00', 'chart-icon', 'text-primary', undefined, {
        value: '+8%',
        color: 'text-success',
        textKey: 'FROM_LAST_MONTH',
      }),
      createInlineMetric(
        'TOTAL_REVENUE',
        '142,300.00',
        'wallet-icon',
        'text-secondary',
        'bg-surface rounded-[4px]',
        {
          value: '+10.2%',
          color: 'text-success',
          textKey: 'FROM_LAST_MONTH',
        }
      ),
      createInlineMetric(
        'TOTAL_EXPENSES',
        '97,850.00',
        'credit-card-icon',
        'text-rose-500',
        'bg-surface rounded-[4px]',
        {
          value: '+2.5%',
          color: 'text-error',
          textKey: 'FROM_LAST_MONTH',
        }
      ),
      createInlineMetric(
        'OUTSTANDING_INVOICES',
        '11,200.00',
        'file-text-icon',
        'text-purple-500',
        'bg-surface rounded-[4px]'
      ),
    ],
  };
};

// Recharts mock factory
export const createRechartsAreaChartMock = () => ({
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Area: ({ dataKey }: any) => <div data-testid="area" data-key={dataKey} />,
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
});

// Recharts bar chart mock factory
export const createRechartsBarChartMock = () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Bar: ({ dataKey, name }: any) => <div data-testid="bar" data-key={dataKey} data-name={name} />,
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
});

// UI Chart components mock factory
export const createUIChartMock = () => ({
  ChartContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: ({ content }: any) => <div data-testid="chart-tooltip">{content}</div>,
});

// Finance services mock factory
export const createFinanceServicesMock = (chartData: any[], timePeriods: any[]) => ({
  CHART_CONFIG: {
    minHeight: 400,
    margins: { top: 10, right: 10, left: 10, bottom: 10 },
    colors: { grid: 'hsl(var(--neutral-100))', axis: 'hsl(var(--medium-emphasis))' },
    yAxisDomain: [0, 100000],
    yAxisTicks: [0, 20000, 40000, 60000, 80000, 100000],
  },
  chartData,
  timePeriods,
});

// Revenue expense services mock factory
export const createRevenueExpenseServicesMock = (expenseChartData: any[], timePeriods: any[]) => ({
  chartConfig: {
    revenue: { label: 'REVENUE', color: 'hsl(var(--secondary-600))' },
    expenses: { label: 'EXPENSES', color: 'hsl(var(--burgundy-100))' },
  },
  expenseChartData,
  timePeriods,
});

// Finance utils mock factory
export const createFinanceUtilsMock = () => ({
  createYAxisLabel: (text: string) => ({ value: text }),
  formatTooltipValue: (value: number) => `CHF ${value.toLocaleString()}`,
  formatYAxisValue: (value: number) => `${value / 1000}k`,
});

// ------------------ Error Page Test Suite ------------------
// Comprehensive test suite for error pages to eliminate duplication

export interface ErrorPageTestData {
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
  iconTestId: string;
  iconTitle: string;
}

// Helper function to create specific feature tests (reduces nesting)
const createSpecificFeatureTests = (features: Array<{ name: string; test: () => void }>) => {
  features.forEach(({ name, test }) => {
    it(name, test);
  });
};

// Helper function to create semantic difference tests (reduces nesting)
const createSemanticDifferenceTests = (differences: Array<{ name: string; test: () => void }>) => {
  differences.forEach(({ name, test }) => {
    it(name, test);
  });
};

// Helper function to create core test suites (reduces nesting)
const createCoreTestSuites = (testData: ErrorPageTestData, renderComponent: () => any) => {
  describe('Basic Rendering', () => {
    it('should render without crashing and have correct structure', () => {
      renderComponent();
      expectErrorPageStructure(testData.title);
    });
  });

  describe('Image Section', () => {
    it('should render the error image correctly', () => {
      renderComponent();
      expectErrorPageImage(testData.imageAlt, testData.imageSrc);
    });
  });

  describe('Text Content', () => {
    it('should render title and description with correct styling', () => {
      renderComponent();
      expectErrorPageTextContent(testData.title, testData.description);
    });
  });

  describe('Button Section', () => {
    it('should render button with correct icon', () => {
      renderComponent();
      expectErrorPageButton(testData.buttonText, testData.iconTestId);
    });
  });

  describe('Translation Integration', () => {
    it('should use translation keys for all text content', () => {
      renderComponent();
      expectTextElements([testData.title, testData.description, testData.buttonText]);
    });
  });

  describe('Accessibility', () => {
    it('should meet accessibility requirements', () => {
      renderComponent();
      expectErrorPageAccessibility(
        testData.title,
        testData.imageAlt,
        testData.buttonText,
        testData.iconTitle
      );
    });
  });

  describe('Layout Structure', () => {
    it('should have correct layout structure', () => {
      renderComponent();
      expectErrorPageLayoutStructure(
        testData.title,
        testData.description,
        testData.buttonText,
        testData.imageAlt
      );
    });
  });
};

// Helper function to create additional test suites (reduces nesting)
const createAdditionalTestSuites = (additionalTests?: {
  specificFeatures?: Array<{ name: string; test: () => void }>;
  semanticDifferences?: Array<{ name: string; test: () => void }>;
}) => {
  const specificFeatures = additionalTests?.specificFeatures;
  if (specificFeatures && specificFeatures.length > 0) {
    describe('Component-Specific Features', () => {
      createSpecificFeatureTests(specificFeatures);
    });
  }

  const semanticDifferences = additionalTests?.semanticDifferences;
  if (semanticDifferences && semanticDifferences.length > 0) {
    describe('Semantic Differences', () => {
      createSemanticDifferenceTests(semanticDifferences);
    });
  }
};

export const createErrorPageTestSuite = (
  componentName: string,
  testData: ErrorPageTestData,
  renderComponent: () => any,
  additionalTests?: {
    specificFeatures?: Array<{
      name: string;
      test: () => void;
    }>;
    semanticDifferences?: Array<{
      name: string;
      test: () => void;
    }>;
  }
) => {
  return () => {
    describe(`${componentName} Component`, () => {
      createCoreTestSuites(testData, renderComponent);
      createAdditionalTestSuites(additionalTests);
    });
  };
};
