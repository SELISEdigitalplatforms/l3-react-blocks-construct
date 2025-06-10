import { useState } from 'react';
import { useToast } from 'hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { InvoicePreview } from '../invoice-preview/invoice-preview';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useInvoice } from '../../store/invoice-store';
import { createInvoiceFromForm, calculateInvoiceTotals } from '../../utils/invoice-utils';
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

export function EditInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { invoices, updateInvoice } = useInvoice();
  const invoice = invoices.find((inv) => inv.id === invoiceId);
  const { toast } = useToast();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [action, setAction] = useState<'draft' | 'send'>('send');
  const [showPreview, setShowPreview] = useState(false);

  // Format phone number to E.164 if it's not already
  const formatPhoneToE164 = (phone: string) => {
    if (!phone) return '';
    if (phone.startsWith('+')) return phone;
    return `+41${phone}`;
  };

  const normalizeCategoryValue = (category: string) => {
    if (!category) return '';
    return category.toLowerCase();
  };

  // Initialize form with existing invoice data
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
      customerName: invoice?.customerName ?? '',
      email: invoice?.billingInfo?.email ?? '',
      phoneNumber: formatPhoneToE164(invoice?.billingInfo?.phone ?? ''),
      billingAddress: invoice?.billingInfo?.address ?? '',
      currency: invoice?.currency?.toLowerCase() ?? '',
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : undefined,
      generalNote: invoice?.orderDetails?.note ?? '',
    },
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.orderDetails?.items?.map((item) => ({
      id: Math.random().toString(),
      name: item.name,
      category: normalizeCategoryValue(item.category),
      quantity: item.quantity,
      price: item.unitPrice,
      total: item.amount,
      showNote: false,
      description: item.description,
    })) || [
      {
        id: Math.random().toString(),
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        total: 0,
        showNote: false,
      },
    ]
  );

  const onSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    const values = form.getValues();
    // Ensure phone number is in E.164 format before submitting
    values.phoneNumber = formatPhoneToE164(values.phoneNumber);
    if (!invoiceId) return;
    const updatedInvoice = createInvoiceFromForm(invoiceId, values, items, action);
    updateInvoice(invoiceId, updatedInvoice);
    setShowConfirmModal(false);

    // Show toast notification based on action
    if (action === 'send') {
      toast({
        title: t('INVOICE_UPDATED'),
        description: t('INVOICE_UPDATED_SUCCESSFULLY'),
        variant: 'success',
      });
    } else {
      toast({
        title: t('INVOICE_SAVE_DRAFT'),
        description: t('INVOICE_SAVED_DRAFT_SUCCESSFULLY'),
        variant: 'success',
      });
    }

    navigate(`/invoices/${invoiceId}`);
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
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

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(),
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        total: 0,
        showNote: false,
      },
    ]);
  };

  if (!invoice) {
    return null;
  }

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
              <h1 className="text-xl font-semibold">{t('EDIT_INVOICE')}</h1>
            </div>
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
          </div>

          <Card className="w-full border-none rounded-[8px] shadow-sm">
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">{t('GENERAL_INFO')}</h2>
              <Separator />
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-high-emphasis text-sm">
                        {t('CUSTOMER_NAME')}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={`${t('ENTER_CUSTOMER_NAME')}...`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-high-emphasis text-sm">{t('EMAIL')}</FormLabel>
                      <FormControl>
                        <Input placeholder={`${t('ENTER_EMAIL_ADDRESS')}...`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-high-emphasis text-sm">
                        {t('PHONE_NUMBER')}
                      </FormLabel>
                      <FormControl>
                        <UIPhoneInput
                          placeholder={t('ENTER_YOUR_MOBILE_NUMBER')}
                          defaultCountry="CH"
                          countryCallingCodeEditable={false}
                          international
                          value={field.value}
                          onChange={(value: string) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-high-emphasis text-sm">
                        {t('BILLING_ADDRESS')}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={`${t('ENTER_BILLING_ADDRESS')}...`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-high-emphasis text-sm">{t('DUE_DATE')}</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-high-emphasis text-sm">{t('CURRENCY')}</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full border-none rounded-[8px] shadow-sm">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{t('ITEM_DETAILS')}</h2>
                <Separator />
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
            </CardContent>
          </Card>
        </form>
      </Form>
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        invoice={
          showPreview && invoiceId
            ? createInvoiceFromForm(invoiceId, form.getValues(), items, 'draft')
            : null
        }
      />

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === 'send' ? t('SEND_INVOICE') : t('SAVE_DRAFT')}</DialogTitle>
            <DialogDescription>
              {action === 'send'
                ? t('SAVE_INVOICE_SEND_CUSTOMER_EMAIL')
                : t('SAVE_INVOICE_AS_DRAFT')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              {t('CANCEL')}
            </Button>
            <Button onClick={handleConfirm}>{t('CONFIRM')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditInvoice;
