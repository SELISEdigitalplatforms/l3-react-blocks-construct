import { Column, Table } from '@tanstack/react-table';
import { RotateCcw } from 'lucide-react';
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
import { StockFilterDropdown } from '../stock-filter-dropdown/stock-filter-dropdown';
import { LastUpdatedFilterDropdown } from '../last-updated-filter-dropdown/last-updated-filter-dropdown';

interface AdvanceTableFilterToolbarProps<TData> {
  table: Table<TData>;
}

export function AdvanceTableFilterToolbar<TData>({ table }: AdvanceTableFilterToolbarProps<TData>) {
  const selectFilterColumns = new Set(['category', 'itemLoc', 'status']);

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
                  onClick={() => table.resetColumnFilters()}
                />
              </div>
            ) : header.column.getCanFilter() ? (
              selectFilterColumns.has(header.column.id) ? (
                <Select
                  onValueChange={(value) => header.column.setFilterValue(value)}
                  value={(header.column.getFilterValue() as string) || ''}
                >
                  <SelectTrigger className="rounded-[6px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(header.column.getFacetedUniqueValues().keys()).length === 0 ? (
                      <div className="p-2 text-sm text-center text-low-emphasis">No data found</div>
                    ) : (
                      Array.from(header.column.getFacetedUniqueValues().keys()).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              ) : header.column.id === 'stock' ? (
                <StockFilterDropdown
                  setFilterValue={(value) => {
                    header.column.setFilterValue(value);
                  }}
                />
              ) : header.column.id === 'lastupdated' ? (
                <LastUpdatedFilterDropdown
                  setFilterValue={(value) => header.column.setFilterValue(value)}
                />
              ) : (
                <Input
                  placeholder="Search"
                  value={(header.column.getFilterValue() as string) || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    header.column.setFilterValue(value || undefined);
                  }}
                  className="rounded-[6px] h-10"
                />
              )
            ) : null}
          </TableHead>
        );
      })}
    </TableRow>
  );
}
