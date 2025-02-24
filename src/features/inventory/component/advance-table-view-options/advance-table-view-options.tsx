import { useState } from 'react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from 'components/ui/dropdown-menu';
import { Checkbox } from 'components/ui/checkbox';
import { Label } from 'components/ui/label';

interface AdvanceTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function AdvanceTableViewOptions<TData>({ table }: AdvanceTableViewOptionsProps<TData>) {
  const [allChecked, setAllChecked] = useState(
    table.getAllColumns().every((column) => column.getIsVisible() || !column.getCanHide())
  );

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
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] p-2">
        <DropdownMenuLabel className="flex items-center gap-2 p-2">
          <Checkbox
            className="data-[state=checked]:border-none"
            checked={allChecked}
            onCheckedChange={handleToggleAll}
          />
          <Label className="text-base font-normal text-high-emphasis">Select all</Label>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.id !== 'select')
          .map((column) => {
            const isDisabled =
              ['itemName', 'stock', 'status', 'price'].includes(column.id) || !column.getCanHide();

            return (
              <div key={column.id} className="flex items-center gap-2 p-2">
                <Checkbox
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                  disabled={isDisabled}
                  className="data-[state=checked]:border-none data-[disabled]:bg-low-emphasis"
                />
                <Label
                  className={`text-base font-normal text-high-emphasis ${isDisabled && 'text-low-emphasis'}`}
                >
                  {(column.columnDef.meta as string) || column.id}
                </Label>
              </div>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
