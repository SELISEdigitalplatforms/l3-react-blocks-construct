import { useToast } from 'hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInvoice } from '../../store/invoice-store';
import { createInvoiceFromForm } from '../../utils/invoice-utils';
import { type InvoiceFormValues, type InvoiceItem } from '../../schemas/invoice-form-schema';
import { formatPhoneToE164, normalizeCategoryValue } from '../../utils/invoice-helpers';
import { BaseInvoiceForm } from '../base-invoice-form/base-invoice-form';

export function EditInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { invoices, updateInvoice } = useInvoice();
  const invoice = invoices.find((inv) => inv.id === invoiceId);
  const { toast } = useToast();

  if (!invoice) {
    return null;
  }

  const defaultValues = {
    customerName: invoice.customerName ?? '',
    email: invoice.billingInfo?.email ?? '',
    phoneNumber: formatPhoneToE164(invoice.billingInfo?.phone ?? ''),
    billingAddress: invoice.billingInfo?.address ?? '',
    currency: invoice.currency?.toLowerCase() ?? '',
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
    generalNote: invoice.orderDetails?.note ?? '',
  };

  const defaultItems =
    invoice.orderDetails?.items?.map((item) => ({
      id: crypto.randomUUID(),
      name: item.name,
      category: normalizeCategoryValue(item.category),
      quantity: item.quantity,
      price: item.unitPrice,
      total: item.amount,
      showNote: Boolean(item.description),
      note: item.description,
    })) || [];

  const handleSubmit = (
    values: InvoiceFormValues,
    items: InvoiceItem[],
    action: 'draft' | 'send'
  ) => {
    if (!invoiceId) return;

    const updatedInvoice = createInvoiceFromForm(invoiceId, values, items, action);
    updateInvoice(invoiceId, updatedInvoice);
    toast({
      title: t(action === 'send' ? 'INVOICE_UPDATED' : 'INVOICE_SAVE_DRAFT'),
      description: t(
        action === 'send' ? 'INVOICE_UPDATED_SUCCESSFULLY' : 'INVOICE_SAVED_DRAFT_SUCCESSFULLY'
      ),
      variant: 'success',
    });

    navigate(`/invoices/${invoiceId}`);
  };

  return (
    <BaseInvoiceForm
      title={t('EDIT_INVOICE')}
      defaultValues={defaultValues}
      defaultItems={defaultItems}
      onSubmit={handleSubmit}
      showSuccessToast={(action) => {
        toast({
          title: t(action === 'send' ? 'INVOICE_UPDATED' : 'INVOICE_SAVE_DRAFT'),
          description: t(
            action === 'send' ? 'INVOICE_UPDATED_SUCCESSFULLY' : 'INVOICE_SAVED_DRAFT_SUCCESSFULLY'
          ),
          variant: 'success',
        });
      }}
    />
  );
}

export default EditInvoice;
