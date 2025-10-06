import { Loader2 } from 'lucide-react';
import { InvoicesDetail } from '@/features/invoices';
import { useInvoiceDetails } from '@/features/invoices/hooks/use-invoice-details';

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
