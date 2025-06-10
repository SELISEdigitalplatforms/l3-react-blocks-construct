import * as React from 'react';
import { Invoice, invoiceData } from '../data/invoice-data';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = React.createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = React.useState<Invoice[]>(invoiceData);

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const updateInvoice = (invoice: Invoice) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? invoice : inv)));
  };

  const getInvoice = (id: string) => {
    return invoices.find((inv) => inv.id === id);
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, getInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = React.useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}
