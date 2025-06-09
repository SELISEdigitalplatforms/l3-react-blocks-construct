import * as React from 'react';
import { Invoice, invoiceData } from '../data/invoice-data';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = React.createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = React.useState<Invoice[]>(invoiceData);

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const getInvoice = (id: string) => {
    return invoices.find((inv) => inv.id === id);
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, getInvoice }}>
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
