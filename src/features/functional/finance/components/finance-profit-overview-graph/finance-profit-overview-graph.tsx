import {
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';

/**
 * ProfitOverview component displays an area chart visualizing profit trends.
 * It allows users to filter the chart data by year or specific time periods.
 *
 * @component
 * @example
 * return (
 *   <ProfitOverview />
 * )
 *
 * @returns {JSX.Element} - The rendered JSX component showing profit trends over time with a selectable time period.
 */

const CHART_CONFIG = {
  margins: { top: 10, right: 10, left: 10, bottom: 10 },
  minHeight: 400,
  strokeWidth: 2,
  fillOpacity: 1,
  yAxisDomain: [0, 100000],
  yAxisTicks: [0, 20000, 40000, 60000, 80000, 100000],
  gradient: {
    id: 'colorProfit',
    startColor: 'hsl(165, 73%, 80%)',
    endColor: 'hsl(165, 73%, 80%)',
    startOpacity: 0.8,
    endOpacity: 0.1,
  },
  colors: {
    stroke: 'hsl(165, 73%, 60%)',
    grid: 'hsl(var(--neutral-100))',
    axis: 'hsl(var(--medium-emphasis))',
  },
};

const STYLE_CLASSES = {
  card: 'w-full md:w-[45%] border-none rounded-[8px] shadow-sm',
  title: 'text-2xl font-semibold text-high-emphasis',
  description: 'text-medium-emphasis mt-1',
  select: 'w-[105px] h-[28px] px-2 py-1',
  tooltip: 'bg-white p-2 border border-neutral-200 rounded shadow-sm',
  tooltipText: 'text-medium-emphasis text-sm font-normal',
} as const;

const chartData = [
  { month: 'Jan', profit: 42000 },
  { month: 'Feb', profit: 48000 },
  { month: 'Mar', profit: 55000 },
  { month: 'Apr', profit: 60000 },
  { month: 'May', profit: 52000 },
  { month: 'Jun', profit: 65000 },
  { month: 'Jul', profit: 80000 },
  { month: 'Aug', profit: 72000 },
  { month: 'Sep', profit: 78000 },
  { month: 'Oct', profit: 75000 },
  { month: 'Nov', profit: 85000 },
  { month: 'Dec', profit: 65000 },
];

// Time period options
const timePeriods = [
  { value: 'this-year', label: 'THIS_YEAR' },
  { value: 'last-year', label: 'LAST_YEAR' },
  { value: 'last-6-months', label: 'LAST_SIX_MONTHS' },
  { value: 'last-3-months', label: 'LAST_THREE_MONTHS' },
];

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
}

// Utility functions
const formatYAxisValue = (value: number): string => `${value / 1000}k`;

const formatTooltipValue = (value: number): string => `CHF ${value.toLocaleString()}`;

const createYAxisLabel = (text: string) => ({
  value: text,
  angle: -90,
  position: 'insideLeft' as const,
  style: {
    textAnchor: 'middle' as const,
    fill: CHART_CONFIG.colors.axis,
    fontSize: 12,
  },
});

// Custom tooltip that matches the design
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className={STYLE_CLASSES.tooltip}>
      <p className={STYLE_CLASSES.tooltipText}>{formatTooltipValue(payload[0].value)}</p>
    </div>
  );
};

// Time period selector component
interface TimePeriodSelectorProps {
  t: (key: string) => string;
}

const TimePeriodSelector = ({ t }: TimePeriodSelectorProps) => (
  <Select defaultValue="this-year">
    <SelectTrigger className={STYLE_CLASSES.select}>
      <SelectValue placeholder={t('THIS_YEAR')} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {timePeriods.map((period) => (
          <SelectItem key={period.value} value={period.value}>
            {t(period.label)}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

// Chart header component
interface ChartHeaderProps {
  t: (key: string) => string;
}

const ChartHeader = ({ t }: ChartHeaderProps) => (
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className={STYLE_CLASSES.title}>{t('PROFIT_OVERVIEW')}</CardTitle>
        <CardDescription className={STYLE_CLASSES.description}>
          {t('MONITOR_YOUR_PROFIT_TRENDS')}
        </CardDescription>
      </div>
      <TimePeriodSelector t={t} />
    </div>
  </CardHeader>
);

export default function FinanceProfitOverviewGraph() {
  const { t } = useTranslation();

  return (
    <Card className={STYLE_CLASSES.card}>
      <ChartHeader t={t} />
      <CardContent>
        <ResponsiveContainer className={`min-h-[${CHART_CONFIG.minHeight}px] w-full`}>
          <AreaChart data={chartData} margin={CHART_CONFIG.margins}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(165, 73%, 80%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(165, 73%, 80%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke={CHART_CONFIG.colors.grid}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke={CHART_CONFIG.colors.axis}
            />
            <YAxis
              tickFormatter={formatYAxisValue}
              tickLine={false}
              axisLine={false}
              stroke={CHART_CONFIG.colors.axis}
              label={createYAxisLabel(`${t('AMOUNT')} (CHF)`)}
              domain={CHART_CONFIG.yAxisDomain}
              ticks={CHART_CONFIG.yAxisTicks}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(165, 73%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
