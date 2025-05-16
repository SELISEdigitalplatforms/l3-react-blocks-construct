import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from 'components/ui/dropdown-menu';

/**
 * DataTableViewOptions Component
 *
 * A component that provides a dropdown menu to toggle the visibility of columns in a data table.
 * This is useful for allowing users to show or hide specific columns dynamically.
 * It integrates with the `@tanstack/react-table` API to manage column visibility.
 *
 * Features:
 * - Displays a dropdown button with a settings icon.
 * - Allows users to toggle the visibility of columns in the table.
 * - Excludes certain columns (for example `fullName` and `email`) from the visibility toggle.
 *
 * @template TData - The type of data used in the table.
 *
 * @param {Table<TData>} table - The instance of the table from `@tanstack/react-table`.
 *
 * @returns {JSX.Element} A dropdown menu to toggle column visibility in the data table.
 */

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: Readonly<DataTableViewOptionsProps<TData>>) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <Settings2 />
          {t('VIEW')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuLabel>{t('TOGGLE_COLUMNS')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' &&
              column.getCanHide() &&
              !['fullName', 'email'].includes(column.id)
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {t(column.id.toUpperCase())}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
