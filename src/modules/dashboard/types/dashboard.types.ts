import { LucideIcon } from 'lucide-react';

/**
 * Interface for metric configuration data
 */
export interface MetricConfig {
  id: string;
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

/**
 * Interface for month/day selection options
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Interface for chart data points
 */
export interface ChartDataPoint {
  week: string;
  noOfActions: number;
}

/**
 * Interface for pie chart data
 */
export interface PieChartDataPoint {
  devices: string;
  users: number;
  fill: string;
}

/**
 * Interface for statistics data
 */
export interface StatisticData {
  title: string;
  value: string;
  max: string;
  percentage: number;
  strokeColor: string;
}

/**
 * Interface for dashboard component props to reduce coupling
 */
export interface DashboardOverviewProps {
  metricsData?: MetricConfig[];
  monthOptions?: SelectOption[];
}

export interface DashboardUserPlatformProps {
  pieChartData?: PieChartDataPoint[];
  monthOptions?: SelectOption[];
}

export interface DashboardUserActivityGraphProps {
  chartData?: ChartDataPoint[];
  dayOptions?: SelectOption[];
}
