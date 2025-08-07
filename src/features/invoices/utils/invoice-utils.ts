import { v4 as uuidv4 } from 'uuid';
import { OrderItem, Invoice, InvoiceStatus } from '../data/invoice-data';

export const generateInvoiceId = (): string => {
  return `INV-${uuidv4().substring(0, 5).replace(/-/g, '').toUpperCase()}`;
};

export function calculateInvoiceTotals(items: OrderItem[], taxRate: number, discount: number) {
  const subtotal = items.reduce((acc, item) => acc + (item.amount || 0), 0);
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
  items: OrderItem[],
  action: 'draft' | 'send'
): Invoice {
  const { totalAmount, subtotal, taxes } = calculateInvoiceTotals(items, 7.5, 50);
  const status = action === 'send' ? InvoiceStatus.Pending : InvoiceStatus.Draft;

  return {
    id: invoiceId,
    customerName: formValues.customerName || '',
    customerImg: '',
    dateIssued: new Date().toISOString(),
    amount: totalAmount,
    dueDate: formValues.dueDate?.toISOString() || new Date().toISOString(),
    status,
    currency: formValues.currency || 'CHF',
    billingInfo: {
      address: formValues.billingAddress || '',
      email: formValues.email || '',
      phone: formValues.phoneNumber || '',
    },
    orderDetails: {
      items: items.map(item => ({
        name: item.name,
        description: item.description,
        category: item.category || 'General',
        quantity: item.quantity,
        unitPrice: item.unitPrice || 0,
        amount: item.amount || 0,
      })),
      subtotal,
      taxes,
      taxRate: 7.5,
      totalAmount,
      note: formValues.generalNote,
    },
  };
}
