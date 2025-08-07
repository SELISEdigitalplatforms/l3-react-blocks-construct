import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    return <div className="p-8">{t('LOADING')}...</div>;
  }

  if (!invoice) {
    return <div className="p-8">{t('INVOICE_DETAIL_NOT_FOUND')}</div>;
  }

  return <InvoicesDetail invoice={invoice} />;
}
