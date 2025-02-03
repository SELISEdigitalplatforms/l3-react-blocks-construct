import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { DataTableViewOptions } from '../../../../components/blocks/data-table/data-table-view-options';

interface IamTableToolbarProps<TData> {
  table: Table<TData>;
}

export function IamTableToolbar<TData>({ table }: IamTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center w-full gap-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className="h-9 w-full sm:w-[300px] rounded-md bg-background"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
