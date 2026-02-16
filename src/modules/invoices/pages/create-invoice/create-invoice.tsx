import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { BaseInvoiceForm } from '../../components/base-invoice-form/base-invoice-form';
import { useAddInvoiceItem } from '../../hooks/use-invoices';
import { useToast } from '@/hooks/use-toast';
import {
  CustomerDetails,
  InvoiceItemDetails,
  AddInvoiceItemParams,
  InvoiceStatus,
} from '../../types/invoices.types';

export const CreateInvoicePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: addInvoiceItem } = useAddInvoiceItem();

  const handleSubmit = async (
    values: InvoiceFormValues,
    items: InvoiceItemDetails[],
    action: 'draft' | 'send'
  ) => {
    try {
      const customer: CustomerDetails = {
        CustomerName: values.customerName,
        BillingAddress: values.billingAddress ?? '',
        Email: values.email ?? '',
        PhoneNo: values.phoneNumber ?? '',
      };

      const itemDetails: InvoiceItemDetails[] = items.map((item) => {
        const quantity = Number(item.Quantity) || 0;
        const unitPrice = Number(item.UnitPrice) || 0;
        const amount = Number(item.Amount) || 0;

        return {
          ItemId: item.ItemId ?? uuidv4(),
          ItemName: item.ItemName ?? '',
          Note: item.Note ?? '',
          Category: item.Category ?? '0',
          Quantity: item.Quantity ?? quantity,
          UnitPrice: item.UnitPrice ?? unitPrice,
          Amount: item.Amount ?? amount,
        };
      });

      const totalAmount = Number(
        items.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0).toFixed(2)
      );

      const apiPayload: AddInvoiceItemParams = {
        input: {
          DateIssued: new Date().toISOString(),
          DueDate: values.dueDate?.toISOString() ?? new Date().toISOString(),
          Amount: totalAmount,
          Customer: [customer],
          Currency: values.currency ?? '',
          Status: action === 'send' ? InvoiceStatus.PENDING : InvoiceStatus.DRAFT,
          ItemDetails: itemDetails,
          GeneralNote: values.generalNote ?? '',
          Taxes: values.taxes,
          Discount: values.discount,
        },
      };

      addInvoiceItem(apiPayload, {
        onSuccess: (data) => {
          toast({
            variant: 'success',
            title: t(action === 'send' ? 'INVOICE_SENT' : 'DRAFT_SAVED'),
            description: t(
              action === 'send' ? 'INVOICE_SENT_SUCCESSFULLY' : 'INVOICE_DRAFT_SAVED_SUCCESSFULLY'
            ),
          });

          // Use the ItemId from the response instead of locally generated ID
          const createdInvoiceId = data?.insertInvoiceItem?.itemId;
          if (createdInvoiceId) {
            navigate(`/invoices/${createdInvoiceId}`);
          } else {
            // Fallback to invoices list if no ID is returned
            navigate('/invoices');
          }
        },
        onError: (error) => {
          console.error('Error creating invoice:', error);
          toast({
            variant: 'destructive',
            title: t('FAILED_CREATE_INVOICE'),
            description: t('UNABLE_CREATE_INVOICE'),
          });
        },
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        variant: 'destructive',
        title: t('UNEXPECTED_ERROR'),
        description: t('AN_UNEXPECTED_ERROR_OCCURRED'),
      });
    }
  };

  return <BaseInvoiceForm title={t('CREATE_NEW_INVOICE')} onSubmit={handleSubmit} />;
};
