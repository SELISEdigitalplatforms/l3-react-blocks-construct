import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { InvoiceItem } from '../types/invoices.types';
import { useGetInvoiceItems } from './use-invoices';

export const useInvoiceDetails = () => {
  const { invoiceId } = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    data: invoicesData,
    isLoading,
    isFetching,
    error,
  } = useGetInvoiceItems({
    pageNo: 1,
    pageSize: 100,
  });

  const invoice = useMemo(() => {
    if (!invoicesData?.items || !invoiceId) return undefined;
    return invoicesData.items.find((item: InvoiceItem) => item.ItemId === invoiceId);
  }, [invoicesData, invoiceId]);

  return {
    invoice,
    invoiceId,
    isLoading: isLoading || isFetching,
    error,
    toast,
    t,
  };
};
