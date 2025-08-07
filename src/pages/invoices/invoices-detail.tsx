import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { InvoicesDetail } from 'features/invoices';
import { useGetInvoiceItems } from 'features/invoices/hooks/use-invoices';
import { useToast } from 'hooks/use-toast';

export function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    data: invoicesData,
    isLoading,
    error,
  } = useGetInvoiceItems({
    pageNo: 1,
    pageSize: 100,
  });

  const invoice = useMemo(() => {
    if (!invoicesData?.items || !invoiceId) return undefined;
    return invoicesData.items.find((item) => item.ItemId === invoiceId);
  }, [invoicesData, invoiceId]);

  useEffect(() => {
    if (error) {
      toast({
        title: t('ERROR'),
        description: t('FAILED_TO_LOAD_INVOICE'),
        variant: 'destructive',
      });
    }
  }, [error, t, toast]);

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
