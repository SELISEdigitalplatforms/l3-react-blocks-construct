import { useTranslation } from 'react-i18next';
import { BarChart, CartesianGrid, Bar, XAxis, YAxis } from 'recharts';
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
import { chartConfig, chartData, daysOfWeek } from '../../services/dashboard-service';

/**
 * DashboardUserActivityGraph component displays a bar chart visualizing user activity trends.
 * It allows users to filter the chart data by week or specific days of the week.
 *
 * @component
 * @example
 * return (
 *   <DashboardUserActivityGraph />
 * )
 *
 * @returns {JSX.Element} - The rendered JSX component showing user activity trends over time with a selectable time period.
 */

export const DashboardUserActivityGraph = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full md:w-[60%] border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t('USER_ACTIVITY_TRENDS')}</CardTitle>
          <Select>
            <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
              <SelectValue placeholder={t('THIS_WEEK')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {t(day.label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>{t('TRACK_ENGAGEMENT_PATTERN')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData.map((item) => ({
              ...item,
              week: t(item.week.toUpperCase()),
            }))}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              dataKey="noOfActions"
              tickLine={true}
              minTickGap={20}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              content={({ payload, label }) => {
                if (payload && payload[0]) {
                  return (
                    <div className="flex flex-col gap-1 bg-white p-2 shadow-md rounded-[4px]">
                      <p className="text-sm text-high-emphasis">{label}:</p>
                      <p className="text-sm font-semibold text-medium-emphasis">
                        {payload[0].value?.toLocaleString()} {t('ACTIONS')}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="noOfActions" fill="var(--color-noOfActions)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
