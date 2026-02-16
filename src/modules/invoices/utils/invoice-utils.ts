import { InvoiceItem, InvoiceItemDetails, InvoiceStatus } from '../types/invoices.types';

interface InvoiceTotals {
  Subtotal: number;
  Taxes: number;
  TotalAmount: number;
}

export function calculateInvoiceTotals(
  items: InvoiceItemDetails[],
  taxes: number,
  discount: number
): InvoiceTotals {
  const Subtotal = items.reduce((acc, item) => acc + (item.Amount || 0), 0);
  const Taxes = (Subtotal * taxes) / 100;
  const TotalAmount = Subtotal + Taxes - discount;

  return {
    Subtotal,
    Taxes,
    TotalAmount,
  };
}

export function createInvoiceFromForm(
  invoiceId: string,
  formValues: any,
  items: InvoiceItemDetails[],
  action: 'draft' | 'send'
): InvoiceItem {
  const taxes = Number(formValues.taxes) || 0;
  const discount = Number(formValues.discount) || 0;
  const { TotalAmount, Subtotal, Taxes } = calculateInvoiceTotals(items, taxes, discount);
  const status = action === 'send' ? InvoiceStatus.PENDING : InvoiceStatus.DRAFT;

  return {
    ItemId: invoiceId,
    DateIssued: new Date().toISOString(),
    Amount: TotalAmount,
    DueDate: formValues.dueDate?.toISOString() ?? new Date().toISOString(),
    Status: status,
    GeneralNote: formValues.generalNote,
    Customer: [
      {
        CustomerName: formValues.customerName ?? '',
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
    TotalAmount,
  };
}
