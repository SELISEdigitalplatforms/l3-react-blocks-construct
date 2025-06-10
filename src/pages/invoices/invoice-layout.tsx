import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { InvoiceProvider } from '../../features/invoices/store/invoice-store';

export function InvoiceLayout() {
  return (
    <InvoiceProvider>
      <Outlet />
    </InvoiceProvider>
  );
}
