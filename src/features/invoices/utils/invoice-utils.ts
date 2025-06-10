import { InvoiceItem } from '../schemas/invoice-form-schema';
import { Invoice, InvoiceStatus } from '../data/invoice-data';

export function generateInvoiceId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `INV-${randomNum}`;
}

export function calculateInvoiceTotals(items: InvoiceItem[], taxRate: number, discount: number) {
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const discountedSubtotal = subtotal - discount;
  const taxes = (discountedSubtotal * taxRate) / 100;
  const totalAmount = discountedSubtotal + taxes;

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
