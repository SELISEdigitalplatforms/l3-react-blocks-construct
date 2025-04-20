import { TrendingUp, Users, UserCog, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { monthsOfYear } from '../../services/dashboard-service';

/**
 * DashboardOverview component displays a high-level overview of key user statistics.
 * It shows the total number of users, total active users, and new sign-ups, along with trends compared to the previous month.
 * The data can be filtered by month using the dropdown selector.
 *
 * @component
 * @example
 * return (
 *   <DashboardOverview />
 * )
 *
 * @returns {JSX.Element} - The rendered JSX component displaying key user statistics with trend information and a month selector.
 */

export const DashboardOverview = () => {
  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">Overview</CardTitle>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-normal text-high-emphasis">Total users</h3>
              <h1 className="text-[32px] font-semibold text-high-emphasis">10,000</h1>
              <div className="flex gap-1 items-center">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-semibold">+2.5%</span>
                <span className="text-sm text-medium-emphasis">from last month</span>
              </div>
            </div>
            <div className="flex h-14 w-14 bg-surface rounded-[4px] items-center justify-center">
              <Users className="h-7 w-7 text-chart-500" />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-normal text-high-emphasis">Total active users</h3>
              <h1 className="text-[32px] font-semibold text-high-emphasis">7,000</h1>
              <div className="flex gap-1 items-center">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-semibold">+5%</span>
                <span className="text-sm text-medium-emphasis">from last month</span>
              </div>
            </div>
            <div className="flex h-14 w-14 bg-surface rounded-[4px] items-center justify-center">
              <UserCog className="h-7 w-7 text-secondary" />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-normal text-high-emphasis">New sign-ups</h3>
              <h1 className="text-[32px] font-semibold text-high-emphasis">1,200</h1>
              <div className="flex gap-1 items-center">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-semibold">+8%</span>
                <span className="text-sm text-medium-emphasis">from last month</span>
              </div>
            </div>
            <div className="flex h-14 w-14 bg-surface rounded-[4px] items-center justify-center">
              <UserPlus className="h-7 w-7 text-green" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
