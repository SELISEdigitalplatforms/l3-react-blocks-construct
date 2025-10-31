import * as z from 'zod';

export const invoiceFormSchema = z.object({
  customerName: z.string().min(1, { message: 'CUSTOMER_NAME_REQUIRED' }),
  email: z.string().email({ message: 'INVALID_EMAIL_ADDRESS' }),
  phoneNumber: z.string().min(1, { message: 'PHONE_NUMBER_REQUIRED' }),
  billingAddress: z.string().min(1, { message: 'BILLING_ADDRESS_REQUIRED' }),
  dueDate: z.date().optional(),
  currency: z.string().min(1, { message: 'CURRENCY_REQUIRED' }),
  generalNote: z.string().optional(),
  taxes: z.number().min(0, { message: 'TAXES_MUST_BE_POSITIVE' }).default(0),
  discount: z.number().min(0, { message: 'DISCOUNT_MUST_BE_POSITIVE' }).default(0),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
