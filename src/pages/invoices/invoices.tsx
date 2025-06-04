import { useState } from 'react';
import { InvoicesOverview, InvoicesHeaderToolbar, InvoicesTableToolbar } from 'features/invoices';
import { Table, ColumnDef } from '@tanstack/react-table';

export function Invoices() {
  const [tableInstance, setTableInstance] = useState<Table<any> | null>(null);
  const [tableColumns, setTableColumns] = useState<ColumnDef<any>[]>([]);

  const handleTableReady = (table: Table<any>, columns: ColumnDef<any>[]) => {
    setTableInstance(table);
    setTableColumns(columns);
  };

  return (
    <div className="flex w-full gap-5 flex-col">
      <InvoicesHeaderToolbar />
      {tableInstance && (
        <InvoicesTableToolbar table={tableInstance} columns={tableColumns} />
      )}
      <InvoicesOverview onTableReady={handleTableReady} />
    </div>
  );
}
