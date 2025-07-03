import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../../store/invoice-store';
import { createInvoiceFromForm, generateInvoiceId } from '../../utils/invoice-utils';
import { type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { useTranslation } from 'react-i18next';
import { BaseInvoiceForm } from '../base-invoice-form/base-invoice-form';

export function CreateInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addInvoice } = useInvoice();
  const invoiceId = generateInvoiceId();

  const handleSubmit = (values: InvoiceFormValues, items: any[], action: 'draft' | 'send') => {
    const invoice = createInvoiceFromForm(invoiceId, values, items, action);
    addInvoice(invoice);
    navigate(`/invoices/${invoiceId}`);
  };

  return <BaseInvoiceForm title={t('CREATE_NEW_INVOICE')} onSubmit={handleSubmit} />;
}

export default CreateInvoice;
