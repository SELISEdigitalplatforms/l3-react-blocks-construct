import { useMemo } from 'react';
import { Pie, Label, PieChart } from 'recharts';
import { ViewBox } from 'recharts/types/util/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from 'components/ui/chart';
import { monthsOfYear, pieChartConfig, pieChartData } from '../../services/dashboard-service';

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
 * @returns {JSX.Element} - The rendered JSX component with a pie chart and month selector.
 */

export const DashboardUserPlatform = () => {
  const totalUsers = useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.users, 0);
  }, []);

  const renderLabelContent = (viewBox: ViewBox | undefined) => {
    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
      return (
        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
            Total
          </tspan>
          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
            {totalUsers.toLocaleString()}
          </tspan>
        </text>
      );
    }
    return null;
  };

  return (
    <Card className="w-full md:w-[40%] border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">Users by platform</CardTitle>
          <Select>
            <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
              <SelectValue placeholder="This month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {monthsOfYear.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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
