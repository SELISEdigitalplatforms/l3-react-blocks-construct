export const INVOICE_AMOUNT = 'CHF 12,500.00';
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'Bank Transfer',
  PAYPAL: 'PayPal',
  CREDIT_CARD: 'Credit Card',
} as const;

export const INVOICE_STATUS = {
  OVERDUE: 'Overdue',
  UNPAID: 'Unpaid',
  PAID: 'Paid',
};

export const TABLE_HEADERS = [
  'INVOICES_ID',
  'CUSTOMER',
  'ISSUE_DATE',
  'DUE_DATE',
  'AMOUNT',
  'STATUS',
  'PAYMENT_METHOD',
  'ACTION',
];

export const STATUS_COLORS = {
  [INVOICE_STATUS.OVERDUE]: 'text-error font-semibold',
  [INVOICE_STATUS.UNPAID]: 'text-warning font-semibold',
  [INVOICE_STATUS.PAID]: 'text-success font-semibold',
};

export type Invoice = {
  id: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: keyof typeof STATUS_COLORS;
  paymentMethod: string;
};

export type DataPoint = {
  month: string;
  revenue: number;
  expenses: number;
};

export type MetricData = {
  titleKey: string;
  amount: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg?: string;
  trend?: {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    color: string;
    textKey: string;
  };
};
