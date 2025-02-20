import { Download } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import Papa from 'papaparse';
import { AdvanceTableViewOptions } from '../advance-table-view-options/advance-table-view-options';
import { Button } from 'components/ui/button';

interface AdvancedTableColumnsToolbarProps<TData> {
  table: Table<TData>;
  title?: string;
}

export function AdvancedTableColumnsToolbar<TData>({
  table,
  title,
}: AdvancedTableColumnsToolbarProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedLength = selectedRows.length;

  const exportCSV = () => {
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => row.original);
    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center text-base text-high-emphasis">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      </div>
      <div className="flex items-center">
        {selectedLength ? (
          <div className="flex items-center gap-4">
            <p className="text-medium-emphasis text-sm font-normal">
              {selectedLength} item{selectedLength > 1 ? '(s)' : ''} selected
            </p>
            <Button size="sm" className="text-sm font-bold" onClick={exportCSV}>
              <Download />
              Export CSV
            </Button>
          </div>
        ) : (
          <AdvanceTableViewOptions table={table} />
        )}
      </div>
    </div>
  );
}
