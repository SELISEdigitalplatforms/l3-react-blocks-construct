import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import { Download, Plus } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { AdvanceTableViewOptions } from '../advance-table-view-options/advance-table-view-options';
import { Button } from 'components/ui/button';

/**
 * A toolbar component for managing table columns, displaying selected row information,
 * and providing export and item addition functionalities. The toolbar supports exporting
 * selected rows to a CSV file and navigating to an "Add Item" page.
 *
 * @template TData - The type of data the table is displaying.
 *
 * @param {AdvancedTableColumnsToolbarProps<TData>} props - The properties for the columns toolbar.
 * @param {Table<TData>} props.table - The table instance, which provides access to table state and methods.
 * @param {string} props.title - The title to be displayed in the toolbar.
 * @param {string[]} [props.disabledColumns] - A list of column IDs that are disabled for visibility toggling.
 * @param {Record<string, boolean>} [props.columnVisibility] - An object that represents the visibility state
 * of each column by column ID.
 *
 * @returns {JSX.Element} The rendered toolbar containing the following features:
 * - Display of the title of the table.
 * - Information about selected rows.
 * - A button to export selected rows as a CSV file.
 * - A button to add a new item, navigating to the inventory add page.
 * - Options to toggle the visibility of table columns.
 *
 * @example
 * // Example usage:
 * <AdvancedTableColumnsToolbar
 *   table={tableInstance}
 *   title="Inventory Management"
 *   disabledColumns={['price', 'stock']}
 *   columnVisibility={{ name: true, stock: false }}
 * />
 */

interface AdvancedTableColumnsToolbarProps<TData> {
  table: Table<TData>;
  title?: string;
  disabledColumns?: string[];
  columnVisibility?: { [key: string]: boolean };
}

export function AdvancedTableColumnsToolbar<TData>({
  table,
  title = 'INVENTORY',
  disabledColumns,
  columnVisibility,
}: Readonly<AdvancedTableColumnsToolbarProps<TData>>) {
  const { t } = useTranslation();
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedLength = selectedRows.length;

  /**
   * Exports the selected rows as a CSV file.
   * If no rows are selected, the function returns early.
   */

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
        <h3 className="text-2xl font-bold tracking-tight">{t(title)}</h3>
      </div>
      <div className="flex items-center gap-4">
        {selectedLength ? (
          <div className="flex items-center gap-4">
            <p className="text-medium-emphasis text-sm font-normal">
              {selectedLength} {t('ITEM')}
              {selectedLength > 1 ? '(s)' : ''} {t('SELECTED')}
            </p>
            <Button size="sm" className="text-sm font-bold" onClick={exportCSV}>
              <Download />
              {t('EXPORT_CSV')}
            </Button>
          </div>
        ) : (
          <AdvanceTableViewOptions
            disabledColumns={disabledColumns}
            columnVisibility={columnVisibility}
            table={table}
          />
        )}
        <Link to="/inventory/add">
          <Button size="sm" className="text-sm font-bold">
            <Plus />
            {t('ADD_ITEM')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
