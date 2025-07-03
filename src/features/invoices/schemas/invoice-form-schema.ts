import * as z from 'zod';

export const invoiceFormSchema = z.object({
  customerName: z.string().min(1, { message: 'CUSTOMER_NAME_REQUIRED' }),
  email: z.string().email({ message: 'INVALID_EMAIL_ADDRESS' }),
  phoneNumber: z.string().min(1, { message: 'PHONE_NUMBER_REQUIRED' }),
  billingAddress: z.string().min(1, { message: 'BILLING_ADDRESS_REQUIRED' }),
  dueDate: z.date().optional(),
  currency: z.string().min(1, { message: 'CURRENCY_REQUIRED' }),
  generalNote: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export interface InvoiceItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  total: number;
  showNote: boolean;
  note?: string;
}
