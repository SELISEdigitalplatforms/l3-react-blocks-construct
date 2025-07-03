import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InvoicesDetail } from 'features/invoices';
import { useInvoice } from 'features/invoices/store/invoice-store';

export function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const { t } = useTranslation();
  const { getInvoice } = useInvoice();

  const invoice = invoiceId ? getInvoice(invoiceId) : undefined;

  if (!invoice) {
    return <div className="p-8">{t('INVOICE_DETAIL_NOT_FOUND')}</div>;
  }

  return <InvoicesDetail invoice={invoice} />;
}
