import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../../store/invoice-store';
import { generateInvoiceId } from '../../utils/invoice-utils';
import { type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { useTranslation } from 'react-i18next';
import { BaseInvoiceForm } from '../base-invoice-form/base-invoice-form';
import { useAddInvoiceItem } from '../../hooks/use-invoices';
import { useToast } from 'hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomerDetails,
  InvoiceItemDetails,
  AddInvoiceItemParams,
  InvoiceStatus as APIInvoiceStatus,
  InvoiceItem,
  InvoiceStatus,
} from '../../types/invoices.types';

export function CreateInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addInvoice } = useInvoice();
  const { toast } = useToast();
  const { mutate: addInvoiceItem } = useAddInvoiceItem();
  const invoiceId = generateInvoiceId();

  const handleSubmit = async (
    values: InvoiceFormValues,
    items: InvoiceItemDetails[],
    action: 'draft' | 'send'
  ) => {
    try {
      // Create customer details for the API
      const customer: CustomerDetails = {
        CustomerName: values.customerName,
        CustomerImgUrl: '',
        BillingAddress: values.billingAddress || '',
        Email: values.email || '',
        PhoneNo: values.phoneNumber || '',
      };

      // Create item details for the API with proper numeric types
      const itemDetails: InvoiceItemDetails[] = items.map((item) => {
        // Ensure all numeric values are numbers
        const quantity = Number(item.Quantity) || 0;
        const unitPrice = Number(item.UnitPrice) || 0;
        const amount = Number(item.Amount) || 0;

        return {
          ItemId: item.ItemId || uuidv4(),
          ItemName: item.ItemName || '',
          Note: item.Note || '',
          Category: item.Category || '0',
          Quantity: item.Quantity || quantity,
          UnitPrice: item.UnitPrice || unitPrice,
          Amount: item.Amount || amount,
          Taxes: item.Taxes || 0,
          Discount: item.Discount || 0,
        };
      });

      // Calculate the total amount as a number
      const totalAmount = Number(
        items.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0).toFixed(2)
      );

      // Create the API payload with proper typing
      const apiPayload: AddInvoiceItemParams = {
        input: {
          ItemId: invoiceId,
          DateIssued: new Date().toISOString(),
          DueDate: values.dueDate?.toISOString() || new Date().toISOString(),
          Amount: totalAmount, // Keep as number
          Customer: [customer],
          Status: action === 'send' ? APIInvoiceStatus.PENDING : APIInvoiceStatus.DRAFT, // Now a single string value
          ItemDetails: itemDetails,
          GeneralNote: values.generalNote || '',
        },
      };

      // The local invoice object will be created by the store based on the API response
      addInvoiceItem(apiPayload, {
        onSuccess: () => {
          // Create a local invoice object for the UI
          const localInvoice: InvoiceItem = {
            ItemId: invoiceId,
            Customer: [
              {
                CustomerName: values.customerName,
                CustomerImgUrl: '',
                BillingAddress: values.billingAddress || '',
                Email: values.email || '',
                PhoneNo: values.phoneNumber || '',
              },
            ],
            DateIssued: new Date().toISOString(),
            Amount: totalAmount,
            DueDate: values.dueDate?.toISOString() || new Date().toISOString(),
            Status: [action === 'send' ? InvoiceStatus.PENDING : InvoiceStatus.DRAFT],
            currency: values.currency || 'CHF',
            GeneralNote: values.generalNote || '',
            ItemDetails: itemDetails,
            Subtotal: totalAmount,
            Taxes: 0,
            TaxRate: 0,
            TotalAmount: totalAmount,
          };

          // Add to local state for immediate UI update
          addInvoice(localInvoice);

          // Show success message
          toast({
            title: t('SUCCESS'),
            description:
              action === 'send' ? t('INVOICE_SUCCESSFULLY_SENT') : t('INVOICE_SAVED_AS_DRAFT'),
            variant: 'default',
          });

          // Navigate to the invoice detail page
          navigate(`/invoices/${invoiceId}`);
        },
        onError: (error) => {
          console.error('Error creating invoice:', error);
          toast({
            title: t('ERROR'),
            description: t('FAILED_TO_CREATE_INVOICE'),
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: t('ERROR'),
        description: t('AN_UNEXPECTED_ERROR_OCCURRED'),
        variant: 'destructive',
      });
    }
  };

  return <BaseInvoiceForm title={t('CREATE_NEW_INVOICE')} onSubmit={handleSubmit} />;
}

export default CreateInvoice;
