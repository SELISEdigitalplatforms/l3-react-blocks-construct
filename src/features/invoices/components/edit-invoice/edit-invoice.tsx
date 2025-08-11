import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from 'hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { createInvoiceFromForm } from '../../utils/invoice-utils';
import { type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { formatPhoneToE164, normalizeCategoryValue } from '../../utils/invoice-helpers';
import { BaseInvoiceForm } from '../base-invoice-form/base-invoice-form';
import { CustomerDetails, InvoiceItemDetails, InvoiceStatus } from '../../types/invoices.types';
import { useGetInvoiceItems, useUpdateInvoiceItem } from '../../hooks/use-invoices';
import { Loader2 } from 'lucide-react';

export function EditInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { toast } = useToast();
  const { mutate: updateInvoiceItem } = useUpdateInvoiceItem();

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
        <p className="text-medium-emphasis">{t('INVOICE_NOT_FOUND')}</p>
      </div>
    );
  }

  const defaultValues = {
    customerName: invoice.Customer[0].CustomerName ?? '',
    email: invoice.Customer[0].Email ?? '',
    phoneNumber: formatPhoneToE164(invoice.Customer[0].PhoneNo ?? ''),
    billingAddress: invoice.Customer[0].BillingAddress ?? '',
    currency: invoice.Currency?.toLowerCase() ?? '',
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

    const customer: CustomerDetails = {
      CustomerName: values.customerName,
      CustomerImgUrl: invoice.Customer[0]?.CustomerImgUrl || '',
      BillingAddress: values.billingAddress || '',
      Email: values.email || '',
      PhoneNo: values.phoneNumber || '',
    };

    updateInvoiceItem({
      filter: `{"_id": "${invoiceId}"}`,
      input: {
        ItemId: invoiceId,
        DateIssued: new Date().toISOString(),
        DueDate: values.dueDate?.toISOString() || new Date().toISOString(),
        Amount: updatedInvoice.Amount,
        Customer: [customer],
        Status: (action === 'send'
          ? InvoiceStatus.PENDING
          : InvoiceStatus.DRAFT) as unknown as InvoiceStatus[],
        GeneralNote: values.generalNote || '',
        ItemDetails: items.map((item) => ({
          ItemId: item.ItemId || crypto.randomUUID(),
          ItemName: item.ItemName,
          Note: item.Note || '',
          Category: item.Category || '0',
          Quantity: Number(item.Quantity) || 0,
          UnitPrice: Number(item.UnitPrice) || 0,
          Amount: Number(item.Amount) || 0,
          Taxes: Number(item.Taxes) || 0,
          Discount: Number(item.Discount) || 0,
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
