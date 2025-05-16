import { useCallback, useRef } from 'react';
import { Column, Header, Table } from '@tanstack/react-table';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { TableRow, TableHead } from 'components/ui/table';
import { Input } from 'components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Checkbox } from 'components/ui/checkbox';
import StockFilterDropdown from '../stock-filter-dropdown/stock-filter-dropdown';
import LastUpdatedFilterDropdown from '../last-updated-filter-dropdown/last-updated-filter-dropdown';

const selectFilterColumns = new Set(['category', 'itemLoc', 'status']);
/**
 * A component that provides a toolbar for filtering columns in a table. This toolbar renders various types of filters
 * depending on the column's data, including text-based filters, select filters, and custom dropdown filters. It also
 * allows for resetting all active filters.
 *
 * @template TData - The type of data the table is displaying.
 *
 * @param {AdvanceTableFilterToolbarProps<TData>} props - The properties for the filter toolbar.
 * @param {Table<TData>} props.table - The table instance, which contains the table state and methods for interacting
 * with the table, including column filters.
 *
 * @returns {JSX.Element} The rendered filter toolbar, which includes:
 * - Filters for individual columns based on their data type.
 * - A checkbox for selecting all rows.
 * - A reset button to clear all active column filters.
 *
 * @example
 * // Example usage:
 * <AdvanceTableFilterToolbar table={tableInstance} />
 */

interface AdvanceTableFilterToolbarProps<TData> {
  table: Table<TData>;
}

export function AdvanceTableFilterToolbar<TData>({
  table,
}: Readonly<AdvanceTableFilterToolbarProps<TData>>) {
  const { t } = useTranslation();
  const clearLastUpdatedFilterDropdownRef = useRef<{ clearFilter: VoidFunction }>(null);
  const clearStockFilterDropdownRef = useRef<{ clearFilter: VoidFunction }>(null);

  const getCommonPinningClasses = (column: Column<TData, unknown>) => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    return clsx(
      isPinned ? 'sticky z-[1] bg-card' : 'relative z-0',
      isLastLeftPinnedColumn && 'shadow-inset-right',
      isFirstRightPinnedColumn && 'shadow-inset-left'
    );
  };

  const resetColumnFilters = () => {
    table.resetColumnFilters();
    clearLastUpdatedFilterDropdownRef.current?.clearFilter();
    clearStockFilterDropdownRef.current?.clearFilter();
  };

  const renderColumnFilter = useCallback(
    (header: Header<TData, unknown>) => {
      const { column } = header;

      if (!column.getCanFilter()) return null;

      if (selectFilterColumns.has(column.id)) {
        return (
          <Select
            onValueChange={(value) => column.setFilterValue(value)}
            value={(column.getFilterValue() as string) || ''}
          >
            <SelectTrigger className="rounded-[6px]">
              <SelectValue placeholder={t('SELECT')} />
            </SelectTrigger>
            <SelectContent>
              {Array.from(column.getFacetedUniqueValues().keys()).length === 0 ? (
                <div className="p-2 text-sm text-center text-low-emphasis">
                  {t('NO_DATA_FOUND')}
                </div>
              ) : (
                Array.from(column.getFacetedUniqueValues().keys()).map((option) => (
                  <SelectItem key={option} value={option}>
                    {column.id === 'status' ? t(option.toUpperCase()) : option}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        );
      }

      if (column.id === 'stock') {
        return (
          <StockFilterDropdown
            ref={clearStockFilterDropdownRef}
            setFilterValue={(value) => column.setFilterValue(value)}
          />
        );
      }

      if (column.id === 'lastupdated') {
        return (
          <LastUpdatedFilterDropdown
            ref={clearLastUpdatedFilterDropdownRef}
            setFilterValue={(value) => column.setFilterValue(value)}
          />
        );
      }

      return (
        <Input
          placeholder={t('SEARCH')}
          value={(column.getFilterValue() as string) || ''}
          onChange={(e) => {
            const value = e.target.value;
            column.setFilterValue(value || undefined);
          }}
          className="rounded-[6px] h-10"
        />
      );
    },
    [t]
  );

  return (
    <TableRow className="border-b hover:bg-transparent">
      {table.getHeaderGroups()[0]?.headers.map((header, index) => {
        const { column } = header;
        return (
          <TableHead
            className={`py-3 px-4 ${column.id === 'select' && 'pl-4 pr-0'} ${getCommonPinningClasses(column)}`}
            style={{
              left: column.getIsPinned() === 'left' ? `${column.getStart('left')}px` : undefined,
              right: column.getIsPinned() === 'right' ? `${column.getAfter('right')}px` : undefined,
              width: column.getSize(),
            }}
            key={header.id}
          >
            {index === 0 ? (
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                  }
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
                  className="border-medium-emphasis data-[state=checked]:border-none border-2"
                />
                <RotateCcw
                  className="w-5 h-5 text-low-emphasis cursor-pointer hover:text-medium-emphasis"
                  onClick={resetColumnFilters}
                />
              </div>
            ) : (
              renderColumnFilter(header)
            )}
          </TableHead>
        );
      })}
    </TableRow>
  );
}
