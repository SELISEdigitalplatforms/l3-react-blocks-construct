import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InvoicesDetail } from 'features/invoices';
import { invoiceData, Invoice } from 'features/invoices/data/invoice-data';

export function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const { t } = useTranslation();

  const invoice = invoiceData.find((inv: Invoice) => inv.id === invoiceId);

  if (!invoice) {
    return <div className="p-8">{t('INVOICE_DETAIL_NOT_FOUND')}</div>;
  }

  return <InvoicesDetail invoice={invoice} />;
}
