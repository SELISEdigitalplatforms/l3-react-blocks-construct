import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form';
import { Button } from '@/components/ui-kit/button';
import { Card, CardContent } from '@/components/ui-kit/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui-kit/form';
import { Input } from '@/components/ui-kit/input';
import { Separator } from '@/components/ui-kit/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui-kit/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-kit/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import { UIPhoneInput } from '@/components/core';
import { format } from 'date-fns';
import { InvoiceFormValues } from '../../schemas/invoice-form-schema';

interface FormActionButtonsProps {
  setShowPreview: Dispatch<SetStateAction<boolean>>;
  setAction: Dispatch<SetStateAction<'draft' | 'send'>>;
}

export function FormActionButtons({ setShowPreview, setAction }: Readonly<FormActionButtonsProps>) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowPreview(true)}
        className="text-xs md:text-sm"
      >
        {t('PREVIEW')}
      </Button>
      <Button
        type="submit"
        variant="outline"
        onClick={() => setAction('draft')}
        className="text-xs md:text-sm"
      >
        {t('SAVE_AS_DRAFT')}
      </Button>
      <Button type="submit" onClick={() => setAction('send')} className="text-xs md:text-sm">
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

export function ConfirmationDialog({
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

export function FormSectionCard({ titleKey, children }: Readonly<FormSectionCardProps>) {
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

export function FormWrapperField({
  control,
  name,
  labelKey,
  children,
}: Readonly<FormWrapperFieldProps>) {
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

interface FormTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<InvoiceFormValues>;
  name: keyof InvoiceFormValues;
  labelKey: string;
  placeholderKey: string;
  type?: string;
}

export function FormTextInput({
  control,
  name,
  labelKey,
  placeholderKey,
  type = 'text',
  ...rest
}: Readonly<FormTextInputProps>) {
  const { t } = useTranslation();

  return (
    <FormWrapperField control={control} name={name} labelKey={labelKey}>
      {(field) => (
        <Input placeholder={`${t(placeholderKey)}...`} type={type} {...field} {...rest} />
      )}
    </FormWrapperField>
  );
}

interface FormPhoneInputProps {
  control: Control<InvoiceFormValues>;
  name: keyof InvoiceFormValues;
  labelKey: string;
  placeholderKey: string;
}

export function FormPhoneInput({
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

interface FormDateInputProps {
  control: Control<InvoiceFormValues>;
  name: keyof InvoiceFormValues;
  labelKey: string;
}

export function FormDateInput({ control, name, labelKey }: Readonly<FormDateInputProps>) {
  const { t } = useTranslation();

  return (
    <FormWrapperField control={control} name={name} labelKey={labelKey}>
      {(field) => (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant="outline" className="w-full h-[44px] justify-between font-normal">
                {field.value ? format(field.value, 'PPP') : <span>{t('SELECT_DUE_DATE')}</span>}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={field.value} onSelect={field.onChange} autoFocus />
          </PopoverContent>
        </Popover>
      )}
    </FormWrapperField>
  );
}

interface FormCurrencySelectProps {
  control: Control<InvoiceFormValues>;
  name: keyof InvoiceFormValues;
  labelKey: string;
}

export function FormCurrencySelect({ control, name, labelKey }: Readonly<FormCurrencySelectProps>) {
  const { t } = useTranslation();

  return (
    <FormWrapperField control={control} name={name} labelKey={labelKey}>
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
  );
}
