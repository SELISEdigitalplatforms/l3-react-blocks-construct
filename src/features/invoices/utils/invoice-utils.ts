import { v4 as uuidv4 } from 'uuid';

import { InvoiceItem } from '../schemas/invoice-form-schema';
import { Invoice, InvoiceStatus } from '../data/invoice-data';

export const generateInvoiceId = (): string => {
  return `INV-${uuidv4().substring(0, 5).replace(/-/g, '').toUpperCase()}`;
};

export function calculateInvoiceTotals(items: InvoiceItem[], taxRate: number, discount: number) {
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const taxes = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxes - discount;

  return {
    subtotal,
    taxes,
    totalAmount,
  };
}

export function createInvoiceFromForm(
  invoiceId: string,
  formValues: any,
  items: InvoiceItem[],
  action: 'draft' | 'send'
): Invoice {
  const { subtotal, taxes, totalAmount } = calculateInvoiceTotals(items, 7.5, 50);

  return {
    id: invoiceId,
    customerName: formValues.customerName,
    customerImg: '', // You can add profile image support later
    dateIssued: new Date().toISOString(),
    amount: totalAmount,
    dueDate: formValues.dueDate?.toISOString() ?? '',
    status: action === 'send' ? InvoiceStatus.Pending : InvoiceStatus.Draft,
    currency: formValues.currency?.toUpperCase() ?? 'CHF',
    billingInfo: {
      address: formValues.billingAddress,
      email: formValues.email,
      phone: formValues.phoneNumber,
    },
    orderDetails: {
      items: items.map((item) => ({
        name: item.name,
        description: item.note,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.price,
        amount: item.total,
      })),
      subtotal,
      taxes,
      taxRate: 7.5,
      discount: 50,
      totalAmount,
      note: formValues.generalNote,
    },
  };
}
