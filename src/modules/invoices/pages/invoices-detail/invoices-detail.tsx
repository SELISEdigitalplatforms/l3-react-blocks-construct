import { Loader2 } from 'lucide-react';
import { useInvoiceDetails } from '../../hooks/use-invoice-details';
import InvoicesDetail from '../../components/invoices-detail/invoices-detail';

export function InvoiceDetailsPage() {
  const { t, invoice, isLoading } = useInvoiceDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-medium-emphasis">{t('INVOICE_DETAIL_NOT_FOUND')}</p>
      </div>
    );
  }

  return <InvoicesDetail invoice={invoice} />;
}
