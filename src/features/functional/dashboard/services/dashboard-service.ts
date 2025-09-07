import { ChartConfig } from 'components/ui/chart';

export const daysOfWeek = [
  { value: 'monday', label: 'MONDAY' },
  { value: 'tuesday', label: 'TUESDAY' },
  { value: 'wednesday', label: 'WEDNESDAY' },
  { value: 'thursday', label: 'THURSDAY' },
  { value: 'friday', label: 'FRIDAY' },
  { value: 'saturday', label: 'SATURDAY' },
  { value: 'sunday', label: 'SUNDAY' },
];

export const monthsOfYear = [
  { value: 'january', label: 'JANUARY' },
  { value: 'february', label: 'FEBRUARY' },
  { value: 'march', label: 'MARCH' },
  { value: 'april', label: 'APRIL' },
  { value: 'may', label: 'MAY' },
  { value: 'june', label: 'JUNE' },
  { value: 'july', label: 'JULY' },
  { value: 'august', label: 'AUGUST' },
  { value: 'september', label: 'SEPTEMBER' },
  { value: 'october', label: 'OCTOBER' },
  { value: 'november', label: 'NOVEMBER' },
  { value: 'december', label: 'DECEMBER' },
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
    label: 'NUMBER_OF_ACTION',
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
    label: 'USERS',
  },
  windows: {
    label: 'WINDOWS',
    color: 'hsl(var(--purple-800))',
  },
  mac: {
    label: 'MAC',
    color: 'hsl(var(--purple-500))',
  },
  ios: {
    label: 'IOS',
    color: 'hsl(var(--purple-200))',
  },
  android: {
    label: 'ANDROID',
    color: 'hsl(var(--purple-50))',
  },
} satisfies ChartConfig;

export const statsData = [
  {
    title: 'API_CALLS',
    value: '12,345',
    max: '25,000',
    percentage: 58.9,
    strokeColor: 'hsl(var(--warning))',
  },
  {
    title: 'BANDWIDTH',
    value: '200 MB',
    max: 'UNLIMITED',
    percentage: 100,
    strokeColor: 'hsl(var(--pink-500))',
  },
  {
    title: 'CONCURRENT_USERS',
    value: '324',
    max: '1,000',
    percentage: 30.9,
    strokeColor: 'hsl(var(--green-500))',
  },
];
