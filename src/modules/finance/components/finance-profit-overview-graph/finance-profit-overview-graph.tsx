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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import { CHART_CONFIG, chartData, timePeriods } from '../../services/finance-services';
import {
  createYAxisLabel,
  formatTooltipValue,
  formatYAxisValue,
} from '../../utils/finance-profit-graph';

/**
 * ProfitOverview component displays an area chart visualizing profit trends.
 * It allows users to filter the chart data by year or specific time periods.
 */

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
}

// Custom tooltip that matches the design
const CustomTooltip = ({ active, payload }: Readonly<TooltipProps>) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-2 border border-neutral-200 rounded shadow-sm">
      <p className="text-medium-emphasis text-sm font-normal">
        {formatTooltipValue(payload[0].value)}
      </p>
    </div>
  );
};

// Time period selector component
interface TimePeriodSelectorProps {
  t: (key: string) => string;
}

const TimePeriodSelector = ({ t }: Readonly<TimePeriodSelectorProps>) => (
  <Select defaultValue="this-year">
    <SelectTrigger className="w-[105px] h-[28px] px-2 py-1">
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

const ChartHeader = ({ t }: Readonly<ChartHeaderProps>) => (
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-2xl font-semibold text-high-emphasis">
          {t('PROFIT_OVERVIEW')}
        </CardTitle>
        <CardDescription className="text-medium-emphasis mt-1">
          {t('MONITOR_YOUR_PROFIT_TRENDS')}
        </CardDescription>
      </div>
      <TimePeriodSelector t={t} />
    </div>
  </CardHeader>
);

export const FinanceProfitOverviewGraph = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full md:w-[45%] border-none rounded-[8px] shadow-sm">
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
};
