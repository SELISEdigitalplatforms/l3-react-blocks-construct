import { CHART_CONFIG } from '../services/finance-services';

export const formatYAxisValue = (value: number): string => `${value / 1000}k`;

export const formatTooltipValue = (value: number): string => `CHF ${value.toLocaleString()}`;

export const createYAxisLabel = (text: string) => ({
  value: text,
  angle: -90,
  position: 'insideLeft' as const,
  style: {
    textAnchor: 'middle' as const,
    fill: CHART_CONFIG.colors.axis,
    fontSize: 12,
  },
});
