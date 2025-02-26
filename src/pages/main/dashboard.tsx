import { useMemo } from 'react';
import { Download, RefreshCcw, TrendingUp, UserCog, UserPlus, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { Button } from 'components/ui/button';
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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from 'components/ui/chart';
import { CircularProgress } from 'features/dashboard';

const chartData = [
  { week: 'Sunday', noOfActions: 10 },
  { week: 'Monday', noOfActions: 70 },
  { week: 'Tuesday', noOfActions: 30 },
  { week: 'Wednesday', noOfActions: 60 },
  { week: 'Thursday', noOfActions: 90 },
  { week: 'Friday', noOfActions: 60 },
  { week: 'Saturday', noOfActions: 30 },
];

const chartConfig = {
  noOfActions: {
    label: 'Number of actions',
    color: 'hsl(var(--secondary-500))',
  },
} satisfies ChartConfig;

const pieChartData = [
  { devices: 'windows', users: 200, fill: 'var(--color-windows)' },
  { devices: 'mac', users: 110, fill: 'var(--color-mac)' },
  { devices: 'ios', users: 60, fill: 'var(--color-ios)' },
  { devices: 'android', users: 20, fill: 'var(--color-android)' },
];
const pieChartConfig = {
  users: {
    label: 'Users',
  },
  windows: {
    label: 'Windows',
    color: 'hsl(var(--purple-800))',
  },
  mac: {
    label: 'Mac',
    color: 'hsl(var(--purple-500))',
  },
  ios: {
    label: 'IOS',
    color: 'hsl(var(--purple-200))',
  },
  android: {
    label: 'Android',
    color: 'hsl(var(--purple-50))',
  },
} satisfies ChartConfig;

export function Dashboard() {
  const totalUsers = useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.users, 0);
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div className="mb-[18px] flex items-center justify-between md:mb-[32px]">
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
          Dashboard (Design Only)
        </h3>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-high-emphasis hover:text-high-emphasis  font-bold"
          >
            <RefreshCcw className="w-2.5 h-2.5" />
            <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
              Sync
            </span>
          </Button>
          <Button className="font-bold">
            <Download className="w-2.5 h-2.5" />
            <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
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
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="march">March</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="may">May</SelectItem>
                    <SelectItem value="june">June</SelectItem>
                    <SelectItem value="july">July</SelectItem>
                    <SelectItem value="august">August</SelectItem>
                    <SelectItem value="september">September</SelectItem>
                    <SelectItem value="october">October</SelectItem>
                    <SelectItem value="november">November</SelectItem>
                    <SelectItem value="december">December</SelectItem>
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
        <div className="flex flex-col md:flex-row gap-4">
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
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="february">February</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                      <SelectItem value="june">June</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="august">August</SelectItem>
                      <SelectItem value="september">September</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                      <SelectItem value="november">November</SelectItem>
                      <SelectItem value="december">December</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription />
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
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
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Total
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalUsers.toLocaleString()}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="w-full md:w-[60%] border-none rounded-[8px] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-high-emphasis">User activity trends</CardTitle>
                <Select>
                  <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
                    <SelectValue placeholder="This week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Track engagement patterns and activity levels over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="week" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis dataKey="noOfActions" tickLine={true} minTickGap={20} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="noOfActions" fill="var(--color-noOfActions)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <Card className="w-full border-none rounded-[8px] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-high-emphasis">System usage overview</CardTitle>
              <Select>
                <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
                  <SelectValue placeholder="Today" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <CardDescription />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-6 sm:gap-4">
                <CircularProgress percentage={58.9} strokeColor="hsl(var(--warning))" />
                <div>
                  <h3 className="text-sm font-normal text-high-emphasis">API calls</h3>
                  <span>
                    <span className="text-[24px] font-semibold text-high-emphasis">12,345</span>
                    <span className="text-sm text-medium-emphasis"> /25000</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-4">
                <CircularProgress percentage={100} strokeColor="hsl(var(--pink-500))" />
                <div>
                  <h3 className="text-sm font-normal text-high-emphasis">Bandwidth</h3>
                  <span>
                    <span className="text-[24px] font-semibold text-high-emphasis">200 MB</span>
                    <span className="text-sm text-medium-emphasis"> /Unlimited</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-4">
                <CircularProgress percentage={30.9} strokeColor="hsl(var(--green-500))" />
                <div>
                  <h3 className="text-sm font-normal text-high-emphasis">Concurrent Users</h3>
                  <span>
                    <span className="text-[24px] font-semibold text-high-emphasis">324</span>
                    <span className="text-sm text-medium-emphasis"> /1000</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
