import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoicePreview } from '../invoice-preview/invoice-preview';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Control } from 'react-hook-form';
import { useInvoice } from '../../store/invoice-store';
import {
  createInvoiceFromForm,
  generateInvoiceId,
  calculateInvoiceTotals,
} from '../../utils/invoice-utils';
import { InvoiceItemsTable } from '../invoice-items-table/invoice-items-table';
import {
  invoiceFormSchema,
  type InvoiceFormValues,
  type InvoiceItem,
} from '../../schemas/invoice-form-schema';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import UIPhoneInput from 'components/core/phone-input/phone-input';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch, SetStateAction } from 'react';
import { formatPhoneToE164 } from '../../utils/invoice-helpers';

interface FormActionButtonsProps {
  setShowPreview: Dispatch<SetStateAction<boolean>>;
  setAction: Dispatch<SetStateAction<'draft' | 'send'>>;
}

function FormActionButtons({ setShowPreview, setAction }: Readonly<FormActionButtonsProps>) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
        {t('PREVIEW')}
      </Button>
      <Button type="submit" variant="outline" onClick={() => setAction('draft')}>
        {t('SAVE_AS_DRAFT')}
      </Button>
      <Button type="submit" onClick={() => setAction('send')}>
        {t('SAVE_AND_SEND')}
      </Button>
    </div>
  );
}

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleKey: string;
  descriptionKey: string;
  onConfirm: () => void;
  confirmButtonKey: string;
  cancelButtonKey: string;
}

function ConfirmationDialog({
  open,
  onOpenChange,
  titleKey,
  descriptionKey,
  onConfirm,
  confirmButtonKey,
  cancelButtonKey,
}: Readonly<ConfirmationDialogProps>) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogDescription>{t(descriptionKey)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t(cancelButtonKey)}
          </Button>
          <Button onClick={onConfirm}>{t(confirmButtonKey)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FormSectionCardProps {
  titleKey: string;
  children: React.ReactNode;
}

function FormSectionCard({ titleKey, children }: Readonly<FormSectionCardProps>) {
  const { t } = useTranslation();
  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t(titleKey)}</h2>
        <Separator />
        {children}
      </CardContent>
    </Card>
  );
}

interface FormWrapperFieldProps {
  control: Control<InvoiceFormValues>;
  name: keyof InvoiceFormValues;
  labelKey: string;
  children: (field: any) => React.ReactNode;
}

function FormWrapperField({ control, name, labelKey, children }: Readonly<FormWrapperFieldProps>) {
  const { t } = useTranslation();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-high-emphasis text-sm">{t(labelKey)}</FormLabel>
          <FormControl>{children(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FormTextInputProps {
  control: Control<InvoiceFormValues>;
  name: keyof InvoiceFormValues;
  labelKey: string;
  placeholderKey: string;
  type?: string;
}

function FormTextInput({
  control,
  name,
  labelKey,
  placeholderKey,
  type = 'text',
}: Readonly<FormTextInputProps>) {
  const { t } = useTranslation();

  return (
    <FormWrapperField control={control} name={name} labelKey={labelKey}>
      {(field) => <Input placeholder={`${t(placeholderKey)}...`} type={type} {...field} />}
    </FormWrapperField>
  );
}

interface FormPhoneInputProps {
  control: Control<InvoiceFormValues>;
  name: keyof InvoiceFormValues;
  labelKey: string;
  placeholderKey: string;
}

function FormPhoneInput({
  control,
  name,
  labelKey,
  placeholderKey,
}: Readonly<FormPhoneInputProps>) {
  const { t } = useTranslation();

  return (
    <FormWrapperField control={control} name={name} labelKey={labelKey}>
      {(field) => (
        <UIPhoneInput
          placeholder={t(placeholderKey)}
          defaultCountry="CH"
          countryCallingCodeEditable={false}
          international
          value={field.value}
          onChange={(value: string) => field.onChange(value)}
        />
      )}
    </FormWrapperField>
  );
}

export function CreateInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [action, setAction] = useState<'draft' | 'send'>('send');
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceId] = useState(generateInvoiceId());

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
    },
  });

  const onSubmit = () => {
    setShowConfirmModal(true);
  };

  const { addInvoice } = useInvoice();

  const handleConfirm = () => {
    const values = form.getValues();
    // Ensure phone number is in E.164 format before submitting
    values.phoneNumber = formatPhoneToE164(values.phoneNumber);
    const invoice = createInvoiceFromForm(invoiceId, values, items, action);
    addInvoice(invoice);
    setShowConfirmModal(false);
    navigate(`/invoices/${invoiceId}`);
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          // If quantity or price was updated, recalculate total
          if ('quantity' in updates || 'price' in updates) {
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleToggleNote = (itemId: string) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, showNote: !item.showNote } : item))
    );
  };

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: uuidv4(),
      name: '',
      category: '',
      quantity: 0,
      price: 0,
      total: 0,
      showNote: false,
    },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuidv4(),
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        total: 0,
        showNote: false,
      },
    ]);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
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
              <h1 className="text-xl font-semibold">{t('CREATE_NEW_INVOICE')}</h1>
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
              <FormWrapperField control={form.control} name="dueDate" labelKey="DUE_DATE">
                {(field) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full h-[44px] justify-between font-normal"
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>{t('SELECT_DUE_DATE')}</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </FormWrapperField>
              <FormWrapperField control={form.control} name="currency" labelKey="CURRENCY">
                {(field) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('SELECT')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="chf">CHF</SelectItem>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FormWrapperField>
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
                subtotal={items.reduce((acc, item) => acc + item.total, 0)}
                taxRate={7.5}
                discount={50}
                totalAmount={calculateInvoiceTotals(items, 7.5, 50).totalAmount}
                currency={form.watch('currency')?.toUpperCase() || 'CHF'}
              />
            </div>
          </FormSectionCard>
        </form>
      </Form>
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        invoice={
          showPreview ? createInvoiceFromForm(invoiceId, form.getValues(), items, 'draft') : null
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

export default CreateInvoice;
