import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { InvoicePreview } from '../invoice-preview/invoice-preview';
import { InvoiceItemsTable } from '../invoice-items-table/invoice-items-table';
import { formatPhoneToE164 } from '../../utils/invoice-helpers';
import { createInvoiceFromForm } from '../../utils/invoice-utils';
import { invoiceFormSchema, type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { type OrderItem as BaseOrderItem } from '../../data/invoice-data';

export type OrderItem = BaseOrderItem & {
  id: string;
  price: number;
  total: number;
  showNote: boolean;
  note?: string;
};
import { Button } from 'components/ui/button';
import { ChevronLeft } from 'lucide-react';
import {
  FormActionButtons,
  ConfirmationDialog,
  FormSectionCard,
  FormTextInput,
  FormPhoneInput,
  FormDateInput,
  FormCurrencySelect,
} from '../invoice-form/invoice-form';
import { InvoiceItemDetails } from '../../types/invoices.types';

interface BaseInvoiceFormProps {
  defaultValues?: Partial<InvoiceFormValues>;
  defaultItems?: InvoiceItemDetails[];
  onSubmit: (values: InvoiceFormValues, items: InvoiceItemDetails[], action: 'draft' | 'send') => void;
  title: string;
  showSuccessToast?: (action: 'draft' | 'send') => void;
}

export function BaseInvoiceForm({
  defaultValues = {},
  defaultItems = [
    {
      ItemId: uuidv4(),
      ItemName: '',
      Category: '',
      Quantity: 0,
      UnitPrice: 0,
      Amount: 0,
      Note: '',
      Taxes: 0,
      Discount: 0,
    },
  ],
  onSubmit,
  title,
  showSuccessToast,
}: Readonly<BaseInvoiceFormProps>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [action, setAction] = useState<'draft' | 'send'>('send');
  const [showPreview, setShowPreview] = useState(false);
  const [items, setItems] = useState<InvoiceItemDetails[]>(defaultItems);

  const form = useForm<InvoiceFormValues>({
    resolver: async (data, context, options) => {
      const result = await zodResolver(invoiceFormSchema)(data, context, options);
      if (result.errors) {
        result.errors = Object.fromEntries(
          Object.entries(result.errors).map(([key, error]) => [
            key,
            { ...error, message: t(error.message as string) },
          ])
        );
      }
      return result;
    },
    shouldUseNativeValidation: false,
    mode: 'onSubmit',
    defaultValues: {
      customerName: '',
      email: '',
      phoneNumber: '',
      billingAddress: '',
      currency: '',
      generalNote: '',
      ...defaultValues,
    },
  });

  const handleFormSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    const values = form.getValues();
    values.phoneNumber = formatPhoneToE164(values.phoneNumber);
    onSubmit(values, items, action);
    setShowConfirmModal(false);
    showSuccessToast?.(action);
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItemDetails>) => {
    setItems(
      items.map((item) => {
        if (item.ItemId === id) {
          // Get the current values with defaults
          const currentPrice = item.UnitPrice || 0;
          const currentQuantity = item.Quantity || 0;
          
          // Create a new item with the updates
          const updatedItem = { ...item, ...updates };
          
          // If quantity or price is being updated, recalculate totals
          if ('Quantity' in updates || 'UnitPrice' in updates || 'Amount' in updates) {
            // Use price if available, otherwise use unitPrice, otherwise fallback to current price
            const price = 'UnitPrice' in updates && updates.UnitPrice !== undefined 
              ? updates.UnitPrice 
              : 'Amount' in updates && updates.Amount !== undefined 
                ? updates.Amount 
                : currentPrice;
            
            // Use the updated quantity if available, otherwise use the existing one
            const quantity = 'Quantity' in updates && updates.Quantity !== undefined 
              ? updates.Quantity 
              : currentQuantity;
            
            // Calculate the total
            const total = price * quantity;
            
            // Update all related fields with type-safe values
            updatedItem.UnitPrice = price;
            updatedItem.Amount = total;
            updatedItem.Quantity = quantity;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.ItemId !== itemId));
  };

  const handleToggleNote = (itemId: string) => {
    setItems(
      items.map((item) => (item.ItemId === itemId ? { ...item, showNote: !item.showNote } : item))
    );
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        ItemId: uuidv4(),
        ItemName: '',
        Category: '',
        Quantity: 0,
        UnitPrice: 0,
        Amount: 0,
        Note: '',
        Taxes: 0,
        Discount: 0,
      },
    ]);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col w-full gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="bg-card hover:bg-card/60 rounded-full"
                onClick={() => navigate(-1)}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            <FormActionButtons setShowPreview={setShowPreview} setAction={setAction} />
          </div>

          <FormSectionCard titleKey="GENERAL_INFO">
            <div className="grid grid-cols-3 gap-6">
              <FormTextInput
                control={form.control}
                name="customerName"
                labelKey="CUSTOMER_NAME"
                placeholderKey="ENTER_CUSTOMER_NAME"
              />
              <FormTextInput
                control={form.control}
                name="email"
                labelKey="EMAIL"
                placeholderKey="ENTER_EMAIL_ADDRESS"
                type="email"
              />
              <FormPhoneInput
                control={form.control}
                name="phoneNumber"
                labelKey="PHONE_NUMBER"
                placeholderKey="ENTER_YOUR_MOBILE_NUMBER"
              />
              <FormTextInput
                control={form.control}
                name="billingAddress"
                labelKey="BILLING_ADDRESS"
                placeholderKey="ENTER_BILLING_ADDRESS"
              />
              <FormDateInput control={form.control} name="dueDate" labelKey="DUE_DATE" />
              <FormCurrencySelect control={form.control} name="currency" labelKey="CURRENCY" />
            </div>
          </FormSectionCard>

          <FormSectionCard titleKey="ITEM_DETAILS">
            <div className="flex flex-col gap-2">
              <InvoiceItemsTable
                items={items}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
                onToggleNote={handleToggleNote}
                onAddItem={handleAddItem}
                control={form.control}
                subtotal={items.reduce((acc, item) => acc + item.Amount, 0)}
                taxRate={7.5}
                discount={50}
                totalAmount={
                  items.reduce((acc, item) => acc + item.Amount, 0) +
                  items.reduce((acc, item) => acc + item.Amount, 0) * (7.5 / 100) -
                  50
                }
                currency={form.watch('currency')?.toUpperCase() || 'CHF'}
              />
            </div>
          </FormSectionCard>
        </form>
      </FormProvider>

      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        invoice={
          showPreview ? createInvoiceFromForm('preview', form.getValues(), items, 'draft') : null
        }
      />

      <ConfirmationDialog
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        titleKey={action === 'send' ? 'SEND_INVOICE' : 'SAVE_DRAFT'}
        descriptionKey={
          action === 'send' ? 'SAVE_INVOICE_SEND_CUSTOMER_EMAIL' : 'SAVE_INVOICE_AS_DRAFT'
        }
        onConfirm={handleConfirm}
        confirmButtonKey="CONFIRM"
        cancelButtonKey="CANCEL"
      />
    </div>
  );
}
