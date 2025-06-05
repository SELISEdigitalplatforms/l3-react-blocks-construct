import { InvoicesOverview, InvoicesHeaderToolbar } from 'features/invoices';
import { ColumnFiltersState, Table as TableInstance } from '@tanstack/react-table';
import type { Invoice } from 'features/invoices/data/invoice-data';

export function Invoices() {
  const handleColumnFiltersChange = (filters: ColumnFiltersState) => {
    // No-op since we're not using filtering
    void filters;
  };

  const handleTableInstanceReady = (table: TableInstance<Invoice>) => {
    // No-op since we're not using filtering
    void table;
  };

  return (
    <div className="flex w-full gap-5 flex-col">
      <InvoicesHeaderToolbar />
      <InvoicesOverview 
        onColumnFiltersChange={handleColumnFiltersChange}
        onTableInstanceReady={handleTableInstanceReady}
      />
    </div>
  );
}
