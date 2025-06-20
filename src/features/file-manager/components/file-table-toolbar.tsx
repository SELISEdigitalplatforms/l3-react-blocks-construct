/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from '@tanstack/react-table';
import { X, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { DataTableViewOptions } from 'components/blocks/data-table/data-table-view-options';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import { DateRange } from 'react-day-picker';
import { FilterControls } from './filter-controls';

interface FileManagerToolbarProps<TData> {
  table: Table<TData>;
  onSearch?: (filters: { name: string }) => void;
  columns: any[];
}

export function FileManagerToolbar<TData>({
  table,
  onSearch,
}: Readonly<FileManagerToolbarProps<TData>>) {
  const [filters, setFilters] = useState({
    name: '',
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [dateRangeLastModified, setDateRangeLastModified] = useState<DateRange | undefined>(
    undefined
  );
  const { t } = useTranslation();

  const getFilterColumn = (columnId: string) => {
    return table.getAllFlatColumns().find((col) => col.id === columnId);
  };

  const debouncedSearch = useCallback(
    debounce((newFilters) => {
      onSearch?.(newFilters);
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(filters);
    return () => {
      debouncedSearch.cancel();
    };
  }, [filters, debouncedSearch]);

  const handleFilterChange = (value: string) => {
    const newFilters = { name: value };
    setFilters(newFilters);
    getFilterColumn('name')?.setFilterValue(value);
  };

  const handleResetFilters = () => {
    setFilters({ name: '' });
    setDateRangeLastModified(undefined);
    table.resetColumnFilters();
    onSearch?.({ name: '' });
  };

  const isFiltered = filters.name || table.getState().columnFilters.length > 0;

  const activeFiltersCount = table.getState().columnFilters.length + (filters.name ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div className="flex flex-col w-full gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-[300px] min-w-[200px]">
            <Input
              placeholder={`${t('SEARCH_BY')} ${t('NAME').toLowerCase()}...`}
              value={filters.name}
              onChange={(event) => handleFilterChange(event.target.value)}
              className="h-8 w-full rounded-lg bg-background"
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="sm:hidden">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 whitespace-nowrap">
                  <Filter className="h-2 w-2" />
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="w-full" aria-describedby="filter-description">
                <SheetHeader>
                  <SheetTitle>{t('FILTERS')}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <FilterControls
                    table={table}
                    isMobile={true}
                    dateRangeLastModified={dateRangeLastModified}
                    onDateRangeLastModifiedChange={setDateRangeLastModified}
                  />
                </div>
                {isFiltered && (
                  <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 w-full">
                    {t('RESET')}
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-row gap-1 flex-wrap">
          {/* Desktop Filters */}
          <div className="hidden sm:block">
            <FilterControls
              table={table}
              dateRangeLastModified={dateRangeLastModified}
              onDateRangeLastModifiedChange={setDateRangeLastModified}
            />
          </div>

          {isFiltered && (
            <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 lg:px-3">
              {t('RESET')}
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end w-full sm:w-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

export default FileManagerToolbar;
