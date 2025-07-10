import * as React from 'react';
import { Invoice, invoiceData } from '../data/invoice-data';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updatedInvoice: Invoice) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = React.createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [invoices, setInvoices] = React.useState<Invoice[]>(invoiceData);

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const updateInvoice = (id: string, updatedInvoice: Invoice) => {
    setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? updatedInvoice : invoice)));
  };

  const getInvoice = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  const value = React.useMemo(
    () => ({
      invoices,
      addInvoice,
      updateInvoice,
      getInvoice,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoices]
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}

export function useInvoice() {
  const context = React.useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}
