import { useTranslation } from 'react-i18next';
import { Eye, Download } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui-kit/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { Button } from '@/components/ui-kit/button';
import { Invoice, STATUS_COLORS, TABLE_HEADERS } from '../../types/finance.type';
import { invoices } from '../../services/finance-services';

export const FinanceInvoices = () => {
  const { t } = useTranslation();

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
};
