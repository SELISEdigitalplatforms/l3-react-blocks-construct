import React from 'react';

/**
 * Shared test utilities for Dashboard chart components
 *
 * These utilities provide common mock implementations for chart-related components
 * used across dashboard tests to eliminate code duplication.
 *
 * NOTE: Due to Vitest hoisting constraints, these mocks must be copied inline
 * into vi.mock() calls. They serve as documentation and reference.
 */

/**
 * Common ChartContainer mock for dashboard tests
 */
export const mockChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="chart-container">{children}</div>
);

/**
 * ChartTooltip mock for pie chart (dashboard-user-platform)
 */
export const mockPieChartTooltip = ({ content }: { content: any }) => {
  const mockPayload = [{ payload: { devices: 'windows', users: 200 } }];
  return (
    <div data-testid="chart-tooltip">
      {content({ payload: mockPayload }) && (
        <div data-testid="chart-tooltip-content">
          <p>WINDOWS:</p>
          <p>200 USERS</p>
        </div>
      )}
    </div>
  );
};

/**
 * ChartTooltip mock for bar chart (dashboard-user-activity-graph)
 */
export const mockBarChartTooltip = ({ content }: { content: any }) => {
  const mockPayload = [{ value: 10 }];
  const mockLabel = 'Week 1';
  return content({ payload: mockPayload, label: mockLabel });
};

/**
 * Common ChartLegend mock
 */
export const mockChartLegend = ({ content }: { content: React.ReactNode }) => (
  <div data-testid="chart-legend">
    {content || <div data-testid="chart-legend-content">Legend Content</div>}
  </div>
);

/**
 * Common ChartTooltipContent mock
 */
export const mockChartTooltipContent = () => (
  <div data-testid="chart-tooltip-content">Tooltip Content</div>
);

/**
 * Common ChartLegendContent mock
 */
export const mockChartLegendContent = () => (
  <div data-testid="chart-legend-content">Legend Content</div>
);

/**
 * Common ResponsiveContainer mock for recharts
 */
export const mockResponsiveContainer = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="responsive-container">{children}</div>
);

/**
 * Common PieChart mock for recharts
 */
export const mockPieChart = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="pie-chart">{children}</div>
);

/**
 * Common BarChart mock for recharts
 */
export const mockBarChart = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="bar-chart">{children}</div>
);

/**
 * Common Pie component mock for recharts
 */
export const mockPie = ({
  data,
  dataKey,
  nameKey,
  innerRadius,
  strokeWidth,
  children,
}: {
  data: any;
  dataKey: string;
  nameKey: string;
  innerRadius: number;
  strokeWidth: number;
  children: React.ReactNode;
}) => (
  <div
    data-testid="pie"
    data-data-key={dataKey}
    data-name-key={nameKey}
    data-inner-radius={innerRadius}
    data-stroke-width={strokeWidth}
    data-chart={JSON.stringify(data)}
  >
    {children}
  </div>
);

/**
 * Common Label mock for recharts
 */
export const mockLabel = () => <div data-testid="label" />;

/**
 * Common Tooltip mock for recharts
 */
export const mockTooltip = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="recharts-tooltip">{children}</div>
);

/**
 * Common Legend mock for recharts
 */
export const mockLegend = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="recharts-legend">{children}</div>
);

/**
 * Common XAxis mock for recharts
 */
export const mockXAxis = () => <div data-testid="x-axis" />;

/**
 * Common YAxis mock for recharts
 */
export const mockYAxis = () => <div data-testid="y-axis" />;

/**
 * Common Bar mock for recharts
 */
export const mockBar = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="bar">{children}</div>
);

/**
 * Common CartesianGrid mock for recharts
 */
export const mockCartesianGrid = () => <div data-testid="cartesian-grid" />;

/**
 * Card component family mocks
 * Used by: dashboard-card, dashboard-overview, dashboard-user-platform
 */
export const mockCard = ({ children, className, ...props }: any) => (
  <div className={className} data-testid="card" {...props}>
    {children}
  </div>
);

export const mockCardHeader = ({ children, className, ...props }: any) => (
  <div className={className} data-testid="card-header" {...props}>
    {children}
  </div>
);

export const mockCardContent = ({ children, className, ...props }: any) => (
  <div className={className} data-testid="card-content" {...props}>
    {children}
  </div>
);

export const mockCardTitle = ({ children, className, ...props }: any) => (
  <div className={className} data-testid="card-title" {...props}>
    {children}
  </div>
);

export const mockCardDescription = ({ children, className, ...props }: any) => (
  <div className={className} data-testid="card-description" {...props}>
    {children}
  </div>
);

/**
 * Select component family mocks
 * Used by: dashboard-card, dashboard-overview, dashboard-user-platform
 */
export const mockSelect = ({ children, ...props }: any) => (
  <div data-testid="select" {...props}>
    {children}
  </div>
);

export const mockSelectTrigger = ({ children, className, ...props }: any) => (
  <button className={className} data-testid="select-trigger" {...props}>
    {children}
  </button>
);

export const mockSelectValue = ({ placeholder, ...props }: any) => (
  <span data-testid="select-value" {...props}>
    {placeholder}
  </span>
);

export const mockSelectContent = ({ children, ...props }: any) => (
  <div data-testid="select-content" {...props}>
    {children}
  </div>
);

export const mockSelectGroup = ({ children, ...props }: any) => (
  <div data-testid="select-group" {...props}>
    {children}
  </div>
);

export const mockSelectItem = ({ children, value, ...props }: any) => (
  <div data-testid={`select-item-${value}`} data-value={value} {...props}>
    {children}
  </div>
);
