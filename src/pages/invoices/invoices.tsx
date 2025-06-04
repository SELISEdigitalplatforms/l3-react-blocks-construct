import InvoicesOverview from 'features/invoices/components/invoices-overview/invoices-overview';
import { InvoicesHeaderToolbar } from 'features/invoices/components/invoices-header-toolbar/invoices-header-toolbar';

export function Invoices() {
  return (
    <div className="flex w-full gap-5 flex-col">
      <InvoicesHeaderToolbar />
      <InvoicesOverview />
    </div>
  );
}
