import { useState, useEffect } from 'react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui-kit/dropdown-menu';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Label } from '@/components/ui-kit/label';

/**
 * A component for managing column visibility options in a table. This component provides a dropdown menu
 * that allows users to toggle the visibility of individual columns, as well as toggle all columns at once.
 * It ensures that certain columns cannot be hidden (such as `itemName`, `stock`, `status`, and `price`),
 * and allows for selective visibility management based on the provided props.
 *
 * @template TData - The type of data the table is displaying.
 *
 * @param {AdvanceTableViewOptionsProps<TData>} props - The properties for managing column visibility.
 * @param {Table<TData>} props.table - The table instance that holds the state and structure of the table.
 * @param {string[]} [props.disabledColumns=[]] - An optional list of column IDs that cannot be toggled for visibility.
 * @param {Object} [props.columnVisibility={}] - An optional object where the keys are column IDs and the values are booleans
 * indicating whether the respective column should be visible or not. This will override the default visibility.
 *
 * - A "Select all" checkbox for toggling visibility of all columns at once.
 * - A list of individual checkboxes for each column (except `select`) to toggle visibility.
 * - Disabled columns are displayed with a different visual style to indicate that they cannot be toggled.
 *
 * @example
 * // Example usage:
 * <AdvanceTableViewOptions
 *   table={tableInstance}
 *   disabledColumns={['itemName', 'price']}
 *   columnVisibility={{ stock: false, status: true }}
 * />
 */

interface AdvanceTableViewOptionsProps<TData> {
  table: Table<TData>;
  disabledColumns?: string[];
  columnVisibility?: { [key: string]: boolean };
}

export function AdvanceTableViewOptions<TData>({
  table,
  disabledColumns = [],
  columnVisibility = {},
}: Readonly<AdvanceTableViewOptionsProps<TData>>) {
  const { t } = useTranslation();
  const [allChecked, setAllChecked] = useState(
    table.getAllColumns().every((column) => column.getIsVisible() || !column.getCanHide())
  );

  useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (columnVisibility[column.id] !== undefined) {
        column.toggleVisibility(columnVisibility[column.id]);
      }
    });
  }, [columnVisibility, table]);

  const handleToggleAll = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    table.getAllColumns().forEach((column) => {
      if (column.getCanHide() && !['itemName', 'stock', 'status', 'price'].includes(column.id)) {
        column.toggleVisibility(newCheckedState);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 text-sm font-bold">
          <Settings2 />
          {t('COLUMNS')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] p-2">
        <DropdownMenuLabel className="flex items-center gap-2 p-2">
          <Checkbox
            className="data-[state=checked]:border-none"
            checked={allChecked}
            onCheckedChange={handleToggleAll}
          />
          <Label className="text-base font-normal text-high-emphasis">{t('SELECT_ALL')}</Label>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.id !== 'select')
          .map((column) => {
            const isDisabled = disabledColumns.includes(column.id) || !column.getCanHide();
            const isChecked = columnVisibility[column.id] ?? column.getIsVisible();

            return (
              <div key={column.id} className="flex items-center gap-2 p-2">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                  disabled={isDisabled}
                  className="data-[state=checked]:border-none data-[disabled]:bg-low-emphasis"
                />
                <Label
                  className={`text-base font-normal text-high-emphasis ${isDisabled && 'text-low-emphasis'}`}
                >
                  {t((column.columnDef.meta as string).toUpperCase())}
                </Label>
              </div>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
