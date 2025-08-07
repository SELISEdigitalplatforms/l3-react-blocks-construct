import { v4 as uuidv4 } from 'uuid';
import { InvoiceItem, InvoiceItemDetails, InvoiceStatus } from '../types/invoices.types';

export const generateInvoiceId = (): string => {
  return `INV-${uuidv4().substring(0, 9).replace(/-/g, '')}`;
};

interface InvoiceTotals {
  Subtotal: number;
  Taxes: number;
  TaxRate: number;
  TotalAmount: number;
}

export function calculateInvoiceTotals(
  items: InvoiceItemDetails[],
  taxRate: number,
  discount: number
): InvoiceTotals {
  const Subtotal = items.reduce((acc, item) => acc + (item.Amount || 0), 0);
  const Taxes = (Subtotal * taxRate) / 100;
  const TotalAmount = Subtotal + Taxes - discount;

  return {
    Subtotal,
    Taxes,
    TaxRate: taxRate,
    TotalAmount,
  };
}

export function createInvoiceFromForm(
  invoiceId: string,
  formValues: any,
  items: InvoiceItemDetails[],
  action: 'draft' | 'send'
): InvoiceItem {
  const { TotalAmount, Subtotal, Taxes, TaxRate } = calculateInvoiceTotals(items, 7.5, 50);
  const status = action === 'send' ? InvoiceStatus.PENDING : InvoiceStatus.DRAFT;

  return {
    ItemId: invoiceId,
    DateIssued: new Date().toISOString(),
    Amount: TotalAmount,
    DueDate: formValues.dueDate?.toISOString() ?? new Date().toISOString(),
    Status: [status],
    GeneralNote: formValues.generalNote,
    Customer: [
      {
        CustomerName: formValues.customerName ?? '',
        CustomerImgUrl: '',
        BillingAddress: formValues.billingAddress ?? '',
        Email: formValues.email ?? '',
        PhoneNo: formValues.phoneNumber ?? '',
      },
    ],
    ItemDetails: items.map((item) => ({
      ItemId: item.ItemId,
      ItemName: item.ItemName,
      Note: item.Note,
      Category: item.Category ?? '',
      Quantity: item.Quantity,
      UnitPrice: item.UnitPrice ?? 0,
      Amount: item.Amount ?? 0,
    })),
    Subtotal,
    Taxes,
    TaxRate,
    TotalAmount,
  };
}
