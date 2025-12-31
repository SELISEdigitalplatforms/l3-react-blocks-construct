import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { InvoicePreview } from '../invoice-preview/invoice-preview';
import { InvoiceItemsTable } from '../invoice-items-table/invoice-items-table';
import { formatPhoneToE164 } from '../../utils/invoice-helpers';
import { invoiceFormSchema, type InvoiceFormValues } from '../../schemas/invoice-form-schema';
import { Button } from '@/components/ui-kit/button';
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
  onSubmit: (
    values: InvoiceFormValues,
    items: InvoiceItemDetails[],
    action: 'draft' | 'send'
  ) => void;
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
      taxes: 0,
      discount: 0,
      ...defaultValues,
    },
  });

  const handleTaxRateChange = (value: number) => {
    form.setValue('taxes', value, { shouldValidate: true });
  };

  const handleDiscountChange = (value: number) => {
    form.setValue('discount', value, { shouldValidate: true });
  };

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

  const calculatePrice = (updates: Partial<InvoiceItemDetails>, currentPrice: number) => {
    if ('UnitPrice' in updates && updates.UnitPrice !== undefined) {
      return updates.UnitPrice;
    }
    if ('Amount' in updates && updates.Amount !== undefined) {
      return updates.Amount;
    }
    return currentPrice;
  };

  const calculateQuantity = (updates: Partial<InvoiceItemDetails>, currentQuantity: number) => {
    return 'Quantity' in updates && updates.Quantity !== undefined
      ? updates.Quantity
      : currentQuantity;
  };

  const updateItemWithCalculations = (
    item: InvoiceItemDetails,
    updates: Partial<InvoiceItemDetails>
  ): InvoiceItemDetails => {
    const currentPrice = item.UnitPrice ?? 0;
    const currentQuantity = item.Quantity ?? 0;
    const updatedItem = { ...item, ...updates };

    if (!('Quantity' in updates) && !('UnitPrice' in updates) && !('Amount' in updates)) {
      return updatedItem;
    }

    const price = calculatePrice(updates, currentPrice);
    const quantity = calculateQuantity(updates, currentQuantity);
    const total = price * quantity;

    return {
      ...updatedItem,
      UnitPrice: price,
      Amount: total,
      Quantity: quantity,
    };
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItemDetails>) => {
    setItems(
      items.map((item) => (item.ItemId === id ? updateItemWithCalculations(item, updates) : item))
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
      },
    ]);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col w-full gap-4">
          <div className="flex items-start gap-2 md:gap-0 md:items-center md:justify-between flex-col md:flex-row">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                onTaxRateChange={handleTaxRateChange}
                onDiscountChange={handleDiscountChange}
                control={form.control}
                subtotal={items.reduce((acc, item) => acc + item.Amount, 0)}
                taxes={form.watch('taxes') || 0}
                discount={form.watch('discount') || 0}
                totalAmount={(function () {
                  const subtotal = items.reduce((acc, item) => acc + item.Amount, 0);
                  const taxAmount = subtotal * ((form.watch('taxes') || 0) / 100);
                  return subtotal + taxAmount - (form.watch('discount') || 0);
                })()}
                currency={form.watch('currency')?.toUpperCase() || 'CHF'}
              />
            </div>
          </FormSectionCard>
        </form>
      </FormProvider>

      {showPreview && (
        <InvoicePreview
          open={showPreview}
          onOpenChange={setShowPreview}
          invoice={{
            ItemId: 'preview',
            CreatedBy: 'system',
            CreatedDate: new Date().toISOString(),
            IsDeleted: false,
            Language: 'en',
            LastUpdatedBy: 'system',
            LastUpdatedDate: new Date().toISOString(),
            OrganizationIds: [],
            Tags: [],
            DateIssued: new Date().toISOString(),
            DueDate: form.watch('dueDate')?.toISOString() ?? new Date().toISOString(),
            Status: 'Draft',
            Amount: (() => {
              const subtotal = items.reduce((sum, item) => sum + (item.Amount || 0), 0);
              const taxAmount = (subtotal * (Number(form.watch('taxes')) || 0)) / 100;
              return subtotal + taxAmount - (Number(form.watch('discount')) || 0);
            })(),
            Customer: [
              {
                CustomerName: form.watch('customerName') ?? '',
                BillingAddress: form.watch('billingAddress') ?? '',
                Email: form.watch('email') ?? '',
                PhoneNo: form.watch('phoneNumber') ?? '',
              },
            ],
            GeneralNote: form.watch('generalNote') ?? '',
            ItemDetails: items.map((item) => ({
              ...item,
              Category: item.Category ?? '',
              Note: item.Note ?? '',
            })),
            Currency: form.watch('currency') ?? 'CHF',
            Subtotal: items.reduce((sum, item) => sum + (item.Amount || 0), 0),
            Taxes:
              (items.reduce((sum, item) => sum + (item.Amount || 0), 0) *
                (Number(form.watch('taxes')) || 0)) /
              100,
            Discount: Number(form.watch('discount')) || 0,
            TotalAmount: (() => {
              const subtotal = items.reduce((sum, item) => sum + (item.Amount || 0), 0);
              const taxAmount = (subtotal * (Number(form.watch('taxes')) || 0)) / 100;
              return subtotal + taxAmount - (Number(form.watch('discount')) || 0);
            })(),
          }}
        />
      )}

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
