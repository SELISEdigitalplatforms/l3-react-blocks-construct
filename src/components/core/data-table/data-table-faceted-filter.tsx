import * as React from 'react';
import { Column } from '@tanstack/react-table';
import { Check, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui-kit/badge';
import { Button } from '@/components/ui-kit/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui-kit/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-kit/popover';
import { Separator } from '@/components/ui-kit/separator';

/**
 * DataTableFacetedFilter Component
 *
 * A filter component that allows users to filter data based on predefined options.
 * The component displays a button with an icon, a label, and the number of selected filters.
 * It allows users to open a popover to select from a list of available options.
 * It integrates with `@tanstack/react-table` for setting the filter values based on the selected options.
 *
 * Features:
 * - Displays a button with the title and selected options.
 * - Allows users to filter data based on options passed as props.
 * - Displays a popover with a list of options for users to select.
 * - Shows a badge displaying the number of selected filters.
 * - Allows clearing the applied filters.
 *
 * @template TData - The type of data used in the table.
 * @template TValue - The type of value for the column being filtered.
 *
 * @param {Column<TData, TValue>} [column] - The column to be filtered, passed from `@tanstack/react-table`.
 * @param {string} [title] - The title to be displayed for the filter button.
 * @param {{ label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]} options - A list of options to be used in the filter. Each option contains a label, a value, and an optional icon.
 */

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  className?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export const DataTableFacetedFilter = <TData, TValue>({
  column,
  title,
  className,
  options,
}: Readonly<DataTableFacetedFilterProps<TData, TValue>>) => {
  const { t } = useTranslation();
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('h-8 border-dashed', className)}>
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="outline" className="rounded-md px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="outline" className="rounded-md px-1 font-normal">
                    {selectedValues.size} {t('SELECTED')}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="outline"
                        key={option.value}
                        className="rounded-md px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t('NO_RESULTS_FOUND')}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(filterValues.length ? filterValues : undefined);
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-white' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    {t('CLEAR_FILTERS')}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
