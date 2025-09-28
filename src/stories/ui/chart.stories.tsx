import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '../../components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const meta = {
  title: 'Chart',
  component: ChartContainer,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    config: {
      control: 'object',
      description: 'Configuration for chart colors and labels',
    },
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

// Sample data for all charts
const barData = [
  { month: 'January', sales: 4000, revenue: 2400, profit: 1600 },
  { month: 'February', sales: 3000, revenue: 1398, profit: 1200 },
  { month: 'March', sales: 2000, revenue: 9800, profit: 800 },
  { month: 'April', sales: 2780, revenue: 3908, profit: 1780 },
  { month: 'May', sales: 1890, revenue: 4800, profit: 1290 },
  { month: 'June', sales: 2390, revenue: 3800, profit: 1590 },
];

const lineData = [
  { day: 'Mon', visits: 4000, signups: 2400 },
  { day: 'Tue', visits: 3000, signups: 1398 },
  { day: 'Wed', visits: 2000, signups: 9800 },
  { day: 'Thu', visits: 2780, signups: 3908 },
  { day: 'Fri', visits: 1890, signups: 4800 },
  { day: 'Sat', visits: 2390, signups: 3800 },
  { day: 'Sun', visits: 3490, signups: 4300 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

// Configuration for charts
const barConfig = {
  sales: {
    label: 'Sales',
    color: '#2563eb',
  },
  revenue: {
    label: 'Revenue',
    color: '#16a34a',
  },
  profit: {
    label: 'Profit',
    color: '#ea580c',
  },
} satisfies ChartConfig;

const lineConfig = {
  visits: {
    label: 'Website Visits',
    color: '#9333ea',
  },
  signups: {
    label: 'User Signups',
    color: '#dc2626',
  },
} satisfies ChartConfig;

const pieConfig = {
  'Group A': {
    label: 'Group A',
    color: '#3b82f6',
  },
  'Group B': {
    label: 'Group B',
    color: '#ef4444',
  },
  'Group C': {
    label: 'Group C',
    color: '#10b981',
  },
  'Group D': {
    label: 'Group D',
    color: '#f59e0b',
  },
} satisfies ChartConfig;

// Bar Chart Story
export const BarChartExample: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="sales" fill="var(--color-sales)" />
        <Bar dataKey="revenue" fill="var(--color-revenue)" />
        <Bar dataKey="profit" fill="var(--color-profit)" />
      </BarChart>
    </ChartContainer>
  ),
  args: {
    config: barConfig,
    className: 'w-full h-80',
  },
};

// Line Chart Story
export const LineChartExample: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="visits" stroke="var(--color-visits)" strokeWidth={2} />
        <Line type="monotone" dataKey="signups" stroke="var(--color-signups)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  ),
  args: {
    config: lineConfig,
    className: 'w-full h-80',
  },
};

// Pie Chart Story
export const PieChartExample: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name.replace(' ', '')})`} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  ),
  args: {
    config: pieConfig,
    className: 'w-full h-80',
  },
};

// Interactive Example with State
const InteractiveChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ChartContainer config={barConfig} className="w-full h-80">
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="sales"
          fill="var(--color-sales)"
          onClick={handleClick}
          opacity={activeIndex === 0 ? 1 : 0.6}
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          onClick={handleClick}
          opacity={activeIndex === 1 ? 1 : 0.6}
        />
        <Bar
          dataKey="profit"
          fill="var(--color-profit)"
          onClick={handleClick}
          opacity={activeIndex === 2 ? 1 : 0.6}
        />
      </BarChart>
    </ChartContainer>
  );
};

export const InteractiveExample: Story = {
  render: () => <InteractiveChart />,
};

// Responsive Example
export const ResponsiveExample: Story = {
  render: (args) => (
    <div className="w-full max-w-4xl mx-auto">
      <ChartContainer {...args}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="sales" fill="var(--color-sales)" />
          <Bar dataKey="revenue" fill="var(--color-revenue)" />
          <Bar dataKey="profit" fill="var(--color-profit)" />
        </BarChart>
      </ChartContainer>
    </div>
  ),
  args: {
    config: barConfig,
    className: 'w-full h-64 md:h-80',
  },
};
