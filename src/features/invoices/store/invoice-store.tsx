import * as React from 'react';
import { InvoiceItem } from '../types/invoices.types';

interface InvoiceContextType {
  invoices: InvoiceItem[];
  addInvoice: (invoice: InvoiceItem) => void;
  updateInvoice: (id: string, updatedInvoice: InvoiceItem) => void;
  getInvoice: (id: string) => InvoiceItem | undefined;
}

const InvoiceContext = React.createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [invoices, setInvoices] = React.useState<InvoiceItem[]>([]);

  const addInvoice = (invoice: InvoiceItem) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const updateInvoice = (id: string, updatedInvoice: InvoiceItem) => {
    setInvoices((prev) =>
      prev.map((invoice) => (invoice.ItemId === id ? updatedInvoice : invoice))
    );
  };

  const getInvoice = (id: string) => {
    return invoices.find((invoice) => invoice.ItemId === id);
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
