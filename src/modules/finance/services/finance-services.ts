import { ChartNoAxesCombined, CreditCard, FileText, TrendingUp, Wallet } from 'lucide-react';
import {
  DataPoint,
  Invoice,
  INVOICE_AMOUNT,
  INVOICE_STATUS,
  MetricData,
  PAYMENT_METHODS,
} from '../types/finance.type';

export const invoices: Invoice[] = [
  {
    id: 'INV-1005',
    customer: 'Acme Corp',
    issueDate: '15/02/2025',
    dueDate: '15/03/2025',
    amount: INVOICE_AMOUNT,
    status: INVOICE_STATUS.OVERDUE,
    paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
  },
  {
    id: 'INV-1004',
    customer: 'Beta Industries',
    issueDate: '20/01/2025',
    dueDate: '20/02/2025',
    amount: INVOICE_AMOUNT,
    status: INVOICE_STATUS.UNPAID,
    paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
  },
  {
    id: 'INV-1003',
    customer: 'Global Solutions',
    issueDate: '01/03/2025',
    dueDate: '20/01/2025',
    amount: INVOICE_AMOUNT,
    status: INVOICE_STATUS.PAID,
    paymentMethod: PAYMENT_METHODS.PAYPAL,
  },
  {
    id: 'INV-1002',
    customer: 'Tech Innovators',
    issueDate: '05/02/2025',
    dueDate: '05/02/2025',
    amount: INVOICE_AMOUNT,
    status: INVOICE_STATUS.PAID,
    paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
  },
  {
    id: 'INV-1001',
    customer: 'DesignWorks',
    issueDate: '10/02/2025',
    dueDate: '10/02/2025',
    amount: INVOICE_AMOUNT,
    status: INVOICE_STATUS.PAID,
    paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
  },
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

export const CHART_CONFIG = {
  margins: { top: 10, right: 10, left: 10, bottom: 10 },
  minHeight: 400,
  strokeWidth: 2,
  fillOpacity: 1,
  yAxisDomain: [0, 100000],
  yAxisTicks: [0, 20000, 40000, 60000, 80000, 100000],
  gradient: {
    id: 'colorProfit',
    startColor: 'hsl(165, 73%, 80%)',
    endColor: 'hsl(165, 73%, 80%)',
    startOpacity: 0.8,
    endOpacity: 0.1,
  },
  colors: {
    stroke: 'hsl(165, 73%, 60%)',
    grid: 'hsl(var(--neutral-100))',
    axis: 'hsl(var(--medium-emphasis))',
  },
};

export const chartData = [
  { month: 'Jan', profit: 42000 },
  { month: 'Feb', profit: 48000 },
  { month: 'Mar', profit: 55000 },
  { month: 'Apr', profit: 60000 },
  { month: 'May', profit: 52000 },
  { month: 'Jun', profit: 65000 },
  { month: 'Jul', profit: 80000 },
  { month: 'Aug', profit: 72000 },
  { month: 'Sep', profit: 78000 },
  { month: 'Oct', profit: 75000 },
  { month: 'Nov', profit: 85000 },
  { month: 'Dec', profit: 65000 },
];

// Time period options
export const timePeriods = [
  { value: 'this-year', label: 'THIS_YEAR' },
  { value: 'last-year', label: 'LAST_YEAR' },
  { value: 'last-6-months', label: 'LAST_SIX_MONTHS' },
  { value: 'last-3-months', label: 'LAST_THREE_MONTHS' },
];

export const expenseChartData: DataPoint[] = [
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

export const chartConfig = {
  revenue: {
    label: 'REVENUE',
    color: 'hsl(var(--secondary-600))',
  },
  expenses: {
    label: 'EXPENSES',
    color: 'hsl(var(--burgundy-100))',
  },
};

export const metricsData: MetricData[] = [
  {
    titleKey: 'NET_PROFIT',
    amount: '44,450.00',
    icon: ChartNoAxesCombined,
    iconColor: 'text-primary',
    trend: {
      icon: TrendingUp,
      value: '+8%',
      color: 'text-success',
      textKey: 'FROM_LAST_MONTH',
    },
  },
  {
    titleKey: 'TOTAL_REVENUE',
    amount: '142,300.00',
    icon: Wallet,
    iconColor: 'text-secondary',
    iconBg: 'bg-surface rounded-[4px]',
    trend: {
      icon: TrendingUp,
      value: '+10.2%',
      color: 'text-success',
      textKey: 'FROM_LAST_MONTH',
    },
  },
  {
    titleKey: 'TOTAL_EXPENSES',
    amount: '97,850.00',
    icon: CreditCard,
    iconColor: 'text-rose-500',
    iconBg: 'bg-surface rounded-[4px]',
    trend: {
      icon: TrendingUp,
      value: '+2.5%',
      color: 'text-error',
      textKey: 'FROM_LAST_MONTH',
    },
  },
  {
    titleKey: 'OUTSTANDING_INVOICES',
    amount: '11,200.00',
    icon: FileText,
    iconColor: 'text-purple-500',
    iconBg: 'bg-surface rounded-[4px]',
  },
];
