import { useTranslation } from 'react-i18next';
import { Eye, Download } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from 'components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';

export default function FinanceInvoices() {
  const { t } = useTranslation();
  const invoices = [
    {
      id: 'INV-1005',
      customer: 'Acme Corp',
      issueDate: '15/02/2025',
      dueDate: '15/03/2025',
      amount: 'CHF 12,500.00',
      status: 'Overdue',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'INV-1004',
      customer: 'Beta Industries',
      issueDate: '20/01/2025',
      dueDate: '20/02/2025',
      amount: 'CHF 12,500.00',
      status: 'Unpaid',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'INV-1003',
      customer: 'Global Solutions',
      issueDate: '01/03/2025',
      dueDate: '20/01/2025',
      amount: 'CHF 12,500.00',
      status: 'Paid',
      paymentMethod: 'PayPal',
    },
    {
      id: 'INV-1002',
      customer: 'Tech Innovators',
      issueDate: '05/02/2025',
      dueDate: '05/02/2025',
      amount: 'CHF 12,500.00',
      status: 'Paid',
      paymentMethod: 'Credit Card',
    },
    {
      id: 'INV-1001',
      customer: 'DesignWorks',
      issueDate: '10/02/2025',
      dueDate: '10/02/2025',
      amount: 'CHF 12,500.00',
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'text-error font-semibold';
      case 'Unpaid':
        return 'text-warning font-semibold';
      case 'Paid':
        return 'text-success font-semibold';
      default:
        return '';
    }
  };

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
          <TableHeader>
            <TableRow>
              <TableHead className="text-high-emphasis font-semibold">{t('INVOICES_ID')}</TableHead>
              <TableHead className="text-high-emphasis font-semibold">{t('CUSTOMER')}</TableHead>
              <TableHead className="text-high-emphasis font-semibold">{t('ISSUE_DATE')}</TableHead>
              <TableHead className="text-high-emphasis font-semibold">{t('DUE_DATE')}</TableHead>
              <TableHead className="text-high-emphasis font-semibold">{t('AMOUNT')}</TableHead>
              <TableHead className="text-high-emphasis font-semibold">{t('STATUS')}</TableHead>
              <TableHead className="text-high-emphasis font-semibold">
                {t('PAYMENT_METHOD')}
              </TableHead>
              <TableHead className="text-high-emphasis font-semibold">{t('ACTION')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
