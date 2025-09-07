import { useTranslation } from 'react-i18next';
import { Eye, Download } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from 'components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';

const INVOICE_AMOUNT = 'CHF 12,500.00';
const PAYMENT_METHODS = {
  BANK_TRANSFER: 'Bank Transfer',
  PAYPAL: 'PayPal',
  CREDIT_CARD: 'Credit Card',
} as const;

const INVOICE_STATUS = {
  OVERDUE: 'Overdue',
  UNPAID: 'Unpaid',
  PAID: 'Paid',
} as const;

const TABLE_HEADERS = [
  'INVOICES_ID',
  'CUSTOMER',
  'ISSUE_DATE',
  'DUE_DATE',
  'AMOUNT',
  'STATUS',
  'PAYMENT_METHOD',
  'ACTION',
] as const;

// Status color mapping
const STATUS_COLORS = {
  [INVOICE_STATUS.OVERDUE]: 'text-error font-semibold',
  [INVOICE_STATUS.UNPAID]: 'text-warning font-semibold',
  [INVOICE_STATUS.PAID]: 'text-success font-semibold',
} as const;

interface Invoice {
  id: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: keyof typeof STATUS_COLORS;
  paymentMethod: string;
}

export default function FinanceInvoices() {
  const { t } = useTranslation();

  const invoices: Invoice[] = [
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

  const getStatusColor = (status: keyof typeof STATUS_COLORS): string => {
    return STATUS_COLORS[status] || '';
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        {TABLE_HEADERS.map((header) => (
          <TableHead key={header} className="text-high-emphasis font-semibold">
            {t(header)}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  const renderInvoiceRow = (invoice: Invoice) => (
    <TableRow key={invoice.id}>
      <TableCell className="text-high-emphasis">{invoice.id}</TableCell>
      <TableCell className="text-high-emphasis">{invoice.customer}</TableCell>
      <TableCell className="text-high-emphasis">{invoice.issueDate}</TableCell>
      <TableCell className="text-high-emphasis">{invoice.dueDate}</TableCell>
      <TableCell className="text-high-emphasis">{invoice.amount}</TableCell>
      <TableCell className={getStatusColor(invoice.status)}>{invoice.status}</TableCell>
      <TableCell>{invoice.paymentMethod}</TableCell>
      <TableCell>
        <div className="flex space-x-8">
          <Eye className="text-primary h-5 w-5" />
          <Download className="text-primary h-5 w-5" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t('INVOICES')}</CardTitle>
          <Button variant="ghost" className="text-primary font-bold text-sm border">
            {t('VIEW_ALL')}
          </Button>
        </div>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <Table>
          {renderTableHeader()}
          <TableBody>{invoices.map(renderInvoiceRow)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
