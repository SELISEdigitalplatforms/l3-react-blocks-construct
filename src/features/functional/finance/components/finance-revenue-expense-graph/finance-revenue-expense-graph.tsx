import React from 'react';
import { BarChart, CartesianGrid, Bar, XAxis, YAxis } from 'recharts';
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
import { ChartContainer, ChartTooltip } from 'components/ui/chart';
import { TooltipContent } from './finance-revenue-expense-graph-tooltip';

interface DataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

const chartData: DataPoint[] = [
  { month: 'Jan', revenue: 25000, expenses: 9000 },
  { month: 'Feb', revenue: 82000, expenses: 23000 },
  { month: 'Mar', revenue: 41000, expenses: 15000 },
  { month: 'Apr', revenue: 74000, expenses: 20000 },
  { month: 'May', revenue: 90000, expenses: 26000 },
  { month: 'Jun', revenue: 76000, expenses: 21000 },
  { month: 'Jul', revenue: 28000, expenses: 10000 },
  { month: 'Aug', revenue: 12000, expenses: 5000 },
  { month: 'Sep', revenue: 82000, expenses: 24000 },
  { month: 'Oct', revenue: 41000, expenses: 15000 },
  { month: 'Nov', revenue: 74000, expenses: 20000 },
  { month: 'Dec', revenue: 90000, expenses: 26000 },
];

const chartConfig = {
  revenue: {
    label: 'REVENUE',
    color: 'hsl(var(--secondary-600))',
  },
  expenses: {
    label: 'EXPENSES',
    color: 'hsl(var(--burgundy-100))',
  },
};

const timePeriods = [
  { value: 'this-year', label: 'THIS_YEAR' },
  { value: 'last-year', label: 'LAST_YEAR' },
  { value: 'last-6-months', label: 'LAST_SIX_MONTHS' },
  { value: 'last-3-months', label: 'LAST_THREE_MONTHS' },
];

type ChartTooltipContentProps = {
  hoveredKey: keyof typeof chartConfig | null;
  [key: string]: any;
};

const ChartTooltipContent = ({ hoveredKey, ...props }: ChartTooltipContentProps) => {
  return <TooltipContent {...props} hoveredKey={hoveredKey} />;
};

const ChartTooltipWrapper = ({ hoveredKey, ...props }: ChartTooltipContentProps) => {
  return <ChartTooltipContent {...props} hoveredKey={hoveredKey} />;
};

export default function FinanceRevenueExpenseGraph() {
  const [hoveredKey, setHoveredKey] = React.useState<keyof typeof chartConfig | null>(null);
  const { t } = useTranslation();

  return (
    <Card className="w-full md:w-[55%] border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-high-emphasis">
              {t('REVENUE_EXPENSE_TREND')}
            </CardTitle>
            <CardDescription className="text-medium-emphasis mt-1">
              {t('COMPARE_TOTAL_REVENUE_EXPENSES_ACROSS')}
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--neutral-100))"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--medium-emphasis))"
            />
            <YAxis
              tickFormatter={(value) => `${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--medium-emphasis))"
              label={{
                value: `${t('AMOUNT')} (CHF)`,
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: 'hsl(var(--medium-emphasis))',
                  fontSize: 12,
                },
              }}
              domain={[0, 100000]}
              ticks={[0, 20000, 40000, 60000, 80000, 100000]}
            />

            <ChartTooltip
              cursor={false}
              content={(props) => <ChartTooltipWrapper {...props} hoveredKey={hoveredKey} />}
            />

            <Bar
              name={chartConfig.revenue.label}
              dataKey="revenue"
              fill={chartConfig.revenue.color}
              radius={[4, 4, 0, 0]}
              barSize={20}
              isAnimationActive={false}
              onMouseOver={() => setHoveredKey('revenue')}
              onMouseOut={() => setHoveredKey(null)}
            />
            <Bar
              name={chartConfig.expenses.label}
              dataKey="expenses"
              fill={chartConfig.expenses.color}
              radius={[4, 4, 0, 0]}
              barSize={20}
              isAnimationActive={false}
              onMouseOver={() => setHoveredKey('expenses')}
              onMouseOut={() => setHoveredKey(null)}
            />
          </BarChart>
        </ChartContainer>

        <div className="flex items-center justify-center gap-6 mt-4">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: config.color }} />
              <span className="text-sm text-medium-emphasis">{t(config.label)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
