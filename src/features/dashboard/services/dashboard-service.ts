import { ChartConfig } from 'components/ui/chart';

export const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export const monthsOfYear = [
  { value: 'january', label: 'January' },
  { value: 'february', label: 'February' },
  { value: 'march', label: 'March' },
  { value: 'april', label: 'April' },
  { value: 'may', label: 'May' },
  { value: 'june', label: 'June' },
  { value: 'july', label: 'July' },
  { value: 'august', label: 'August' },
  { value: 'september', label: 'September' },
  { value: 'october', label: 'October' },
  { value: 'november', label: 'November' },
  { value: 'december', label: 'December' },
];

export const chartData = [
  { week: 'Sunday', noOfActions: 10 },
  { week: 'Monday', noOfActions: 70 },
  { week: 'Tuesday', noOfActions: 30 },
  { week: 'Wednesday', noOfActions: 60 },
  { week: 'Thursday', noOfActions: 90 },
  { week: 'Friday', noOfActions: 60 },
  { week: 'Saturday', noOfActions: 30 },
];

export const chartConfig = {
  noOfActions: {
    label: 'Number of actions: ',
    color: 'hsl(var(--secondary-500))',
  },
} satisfies ChartConfig;

export const pieChartData = [
  { devices: 'windows', users: 200, fill: 'var(--color-windows)' },
  { devices: 'mac', users: 110, fill: 'var(--color-mac)' },
  { devices: 'ios', users: 60, fill: 'var(--color-ios)' },
  { devices: 'android', users: 20, fill: 'var(--color-android)' },
];
export const pieChartConfig = {
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

export const statsData = [
  {
    title: 'API calls',
    value: '12,345',
    max: '25,000',
    percentage: 58.9,
    strokeColor: 'hsl(var(--warning))',
  },
  {
    title: 'Bandwidth',
    value: '200 MB',
    max: 'Unlimited',
    percentage: 100,
    strokeColor: 'hsl(var(--pink-500))',
  },
  {
    title: 'Concurrent Users',
    value: '324',
    max: '1,000',
    percentage: 30.9,
    strokeColor: 'hsl(var(--green-500))',
  },
];
