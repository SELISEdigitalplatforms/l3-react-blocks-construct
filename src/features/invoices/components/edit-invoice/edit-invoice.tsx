import { useTranslation } from 'react-i18next';
import { useToast } from 'hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoice } from '../../store/invoice-store';
import { createInvoiceFromForm } from '../../utils/invoice-utils';
import { type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { formatPhoneToE164, normalizeCategoryValue } from '../../utils/invoice-helpers';
import { BaseInvoiceForm } from '../base-invoice-form/base-invoice-form';
import { InvoiceItemDetails } from '../../types/invoices.types';

export function EditInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { invoices, updateInvoice } = useInvoice();
  const invoice = invoices.find((inv) => inv.ItemId === invoiceId);
  const { toast } = useToast();

  if (!invoice) {
    return null;
  }

  const defaultValues = {
    customerName: invoice.Customer[0].CustomerName ?? '',
    email: invoice.Customer[0].Email ?? '',
    phoneNumber: formatPhoneToE164(invoice.Customer[0].PhoneNo ?? ''),
    billingAddress: invoice.Customer[0].BillingAddress ?? '',
    currency: invoice.currency?.toLowerCase() ?? '',
    dueDate: invoice.DueDate ? new Date(invoice.DueDate) : undefined,
    generalNote: invoice.GeneralNote ?? '',
  };

  const defaultItems =
    invoice.ItemDetails?.map(
      (item) =>
        ({
          ItemId: item.ItemId,
          ItemName: item.ItemName,
          Category: normalizeCategoryValue(item.Category) ?? '',
          Quantity: item.Quantity,
          UnitPrice: item.UnitPrice,
          Amount: item.Amount,
          Note: item.Note,
          Taxes: item.Taxes,
          Discount: item.Discount,
          showNote: Boolean(item.Note),
          note: item.Note,
        }) as InvoiceItemDetails
    ) || [];

  const handleSubmit = (
    values: InvoiceFormValues,
    items: InvoiceItemDetails[],
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
