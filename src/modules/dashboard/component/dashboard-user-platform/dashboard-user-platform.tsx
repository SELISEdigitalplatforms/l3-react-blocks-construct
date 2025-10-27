import { useMemo } from 'react';
import { Pie, Label, PieChart } from 'recharts';
import { useTranslation } from 'react-i18next';
import { ViewBox } from 'recharts/types/util/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '@/components/ui-kit/chart';
import { monthsOfYear, pieChartConfig, pieChartData } from '../../services/dashboard-service';
import { ChartTooltipWrapper } from '../chart-tooltip-wrapper/chart-tooltip-wrapper';

/**
 * DashboardUserPlatform component displays a pie chart of users by platform and provides a selection
 * to filter by month.
 *
 * @component
 * @example
 * return (
 *   <DashboardUserPlatform />
 * )
 *
 */

export const DashboardUserPlatform = () => {
  const { t } = useTranslation();

  const totalUsers = useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.users, 0);
  }, []);

  const renderLabelContent = (viewBox: ViewBox | undefined) => {
    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
      return (
        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
            {t('TOTAL')}
          </tspan>
          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
            {totalUsers.toLocaleString()}
          </tspan>
        </text>
      );
    }
    return null;
  };

  const translatedConfig = useMemo(() => {
    return {
      ...pieChartConfig,
      users: { ...pieChartConfig.users, label: t(pieChartConfig.users.label) },
      windows: { ...pieChartConfig.windows, label: t(pieChartConfig.windows.label) },
      mac: { ...pieChartConfig.mac, label: t(pieChartConfig.mac.label) },
      ios: { ...pieChartConfig.ios, label: t(pieChartConfig.ios.label) },
      android: { ...pieChartConfig.android, label: t(pieChartConfig.android.label) },
    };
  }, [t]);

  return (
    <Card className="w-full md:w-[40%] border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t('USER_BY_PLATFORM')}</CardTitle>
          <Select>
            <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
              <SelectValue placeholder={t('THIS_MONTH')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {monthsOfYear.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {t(month.label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <ChartContainer config={translatedConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={ChartTooltipWrapper} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie
              data={pieChartData}
              dataKey="users"
              nameKey="devices"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label content={({ viewBox }) => renderLabelContent(viewBox)} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
