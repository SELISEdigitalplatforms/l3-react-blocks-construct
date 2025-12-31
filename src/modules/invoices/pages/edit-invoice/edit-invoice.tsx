import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createInvoiceFromForm } from '../../utils/invoice-utils';
import { type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { formatPhoneToE164, normalizeCategoryValue } from '../../utils/invoice-helpers';
import { BaseInvoiceForm } from '../../components/base-invoice-form/base-invoice-form';
import { CustomerDetails, InvoiceItemDetails, InvoiceStatus } from '../../types/invoices.types';
import { useUpdateInvoiceItem } from '../../hooks/use-invoices';
import { useInvoiceDetails } from '../../hooks/use-invoice-details';

export const EditInvoicePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: updateInvoiceItem } = useUpdateInvoiceItem();
  const { invoice, invoiceId, isLoading, toast } = useInvoiceDetails();

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
        <p className="text-medium-emphasis">{t('INVOICE_NOT_FOUND')}</p>
      </div>
    );
  }

  const defaultValues = {
    customerName: invoice.Customer[0].CustomerName ?? '',
    email: invoice.Customer[0].Email ?? '',
    phoneNumber: formatPhoneToE164(invoice.Customer[0].PhoneNo ?? ''),
    billingAddress: invoice.Customer[0].BillingAddress ?? '',
    currency: invoice.Currency ?? '',
    dueDate: invoice.DueDate ? new Date(invoice.DueDate) : undefined,
    generalNote: invoice.GeneralNote ?? '',
    taxes: invoice.Taxes ?? 0,
    discount: invoice.Discount ?? 0,
  };

  const defaultItems =
    invoice.ItemDetails?.map(
      (item) =>
        ({
          ItemId: item.ItemId || uuidv4(),
          ItemName: item.ItemName,
          Category: normalizeCategoryValue(item.Category) ?? '',
          Quantity: item.Quantity,
          UnitPrice: item.UnitPrice,
          Amount: item.Amount,
          Note: item.Note,
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

    const customer: CustomerDetails = {
      CustomerName: values.customerName,
      BillingAddress: values.billingAddress ?? '',
      Email: values.email ?? '',
      PhoneNo: values.phoneNumber ?? '',
    };

    updateInvoiceItem({
      filter: `{"_id": "${invoiceId}"}`,
      input: {
        DateIssued: new Date().toISOString(),
        DueDate: values.dueDate?.toISOString() ?? new Date().toISOString(),
        Amount: updatedInvoice.Amount,
        Customer: [customer],
        Currency: values.currency,
        Status: (action === 'send'
          ? InvoiceStatus.PENDING
          : InvoiceStatus.DRAFT) as unknown as InvoiceStatus[],
        GeneralNote: values.generalNote ?? '',
        Taxes: values.taxes,
        Discount: values.discount,
        ItemDetails: items.map((item) => ({
          ItemId: item.ItemId ?? uuidv4(),
          ItemName: item.ItemName,
          Note: item.Note ?? '',
          Category: item.Category ?? '0',
          Quantity: Number(item.Quantity) || 0,
          UnitPrice: Number(item.UnitPrice) || 0,
          Amount: Number(item.Amount) || 0,
        })),
      },
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
          title: t(action === 'send' ? 'INVOICE_UPDATED' : 'DRAFT_SAVED'),
          description: t(
            action === 'send' ? 'INVOICE_UPDATED_SUCCESSFULLY' : 'INVOICE_DRAFT_SAVED_SUCCESSFULLY'
          ),
          variant: 'success',
        });
      }}
    />
  );
};
