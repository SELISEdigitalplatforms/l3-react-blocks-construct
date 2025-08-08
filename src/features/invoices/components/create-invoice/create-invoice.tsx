import { useNavigate } from 'react-router-dom';
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
  InvoiceStatus,
} from '../../types/invoices.types';
import { useEffect, useState } from 'react';

// Get current user profile from localStorage
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
};

export function CreateInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState(getCurrentUser());
  const { mutate: addInvoiceItem } = useAddInvoiceItem();
  const invoiceId = generateInvoiceId();

  useEffect(() => {
    setUserProfile(getCurrentUser());
  }, []);

  const handleSubmit = async (
    values: InvoiceFormValues,
    items: InvoiceItemDetails[],
    action: 'draft' | 'send'
  ) => {
    try {
      const customer: CustomerDetails = {
        CustomerName: values.customerName,
        CustomerImgUrl: '',
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
          Taxes: item.Taxes ?? 0,
          Discount: item.Discount ?? 0,
        };
      });

      const totalAmount = Number(
        items.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0).toFixed(2)
      );

      const apiPayload: AddInvoiceItemParams = {
        input: {
          ItemId: invoiceId,
          CreatedBy: userProfile?.fullName ?? '',
          CreatedDate: new Date().toISOString(),
          DateIssued: new Date().toISOString(),
          DueDate: values.dueDate?.toISOString() ?? new Date().toISOString(),
          Amount: totalAmount,
          Customer: [customer],
          Status: action === 'send' ? InvoiceStatus.PENDING : InvoiceStatus.DRAFT,
          ItemDetails: itemDetails,
          GeneralNote: values.generalNote ?? '',
          LastUpdatedBy: userProfile?.fullName ?? '',
          LastUpdatedDate: new Date().toISOString(),
        },
      };

      addInvoiceItem(apiPayload, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: action === 'send' ? 'Invoice successfully sent' : 'Invoice saved as draft',
            variant: 'success',
          });

          navigate(`/invoices/${invoiceId}`);
        },
        onError: (error) => {
          console.error('Error creating invoice:', error);
          toast({
            title: 'Error',
            description: 'Failed to create invoice',
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return <BaseInvoiceForm title={t('CREATE_NEW_INVOICE')} onSubmit={handleSubmit} />;
}

export default CreateInvoice;
