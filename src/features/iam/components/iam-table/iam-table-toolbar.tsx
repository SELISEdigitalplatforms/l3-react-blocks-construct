/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */

import { Table } from '@tanstack/react-table';
import { X, Mail, User, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { DataTableViewOptions } from 'components/blocks/data-table/data-table-view-options';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import { DateRange } from 'react-day-picker';
import FilterControls from './filter-controls';

/**
 * Renders a toolbar for the IAM (Identity and Access Management) table, allowing users to search
 * and filter data based on email, name, and date ranges, as well as reset filters.
 *
 * Features:
 * - Provides an input field for searching by email or name
 * - Allows toggling between search modes (email vs name)
 * - Includes mobile-responsive filters using a sheet and desktop filters
 * - Supports date range filters for creation date and last login date
 * - Displays a count of active filters and allows resetting them
 *
 * @param {IamTableToolbarProps<TData>} props - The props for configuring the toolbar
 * @param {Table<TData>} props.table - The table instance for controlling the data
 * @param {function} [props.onSearch] - Optional callback function triggered when filters are applied
 * @param {Array} props.columns - The columns used for rendering the table
 *
 * @returns {JSX.Element} - The rendered toolbar with search, filter, and reset options
 *
 * @example
 * <IamTableToolbar
 *   table={tableInstance}
 *   onSearch={(filters) => console.log('Filters applied:', filters)}
 *   columns={columns}
 * />
 */

interface IamTableToolbarProps<TData> {
  table: Table<TData>;
  onSearch?: (filters: { email: string; name: string }) => void;
  columns: any[];
}

export function IamTableToolbar<TData>({ table, onSearch }: Readonly<IamTableToolbarProps<TData>>) {
  const [filters, setFilters] = useState({
    email: '',
    name: '',
  });
  const [searchMode, setSearchMode] = useState<'email' | 'name'>('name');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [dateRangeCreate, setDateRangeCreate] = useState<DateRange | undefined>(undefined);
  const [dateRangeLastLogin, setDateRangeLastLogin] = useState<DateRange | undefined>(undefined);
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
    const newFilters = { ...filters, [searchMode]: value };
    setFilters(newFilters);

    if (searchMode === 'email') {
      getFilterColumn('email')?.setFilterValue(value);
    } else {
      getFilterColumn('fullName')?.setFilterValue(value);
    }
  };

  const toggleSearchMode = () => {
    const newMode = searchMode === 'email' ? 'name' : 'email';
    setSearchMode(newMode);

    const currentValue = filters[searchMode];
    const newFilters = {
      ...filters,
      [searchMode]: '',
      [newMode]: currentValue,
    };
    setFilters(newFilters);

    const emailColumn = getFilterColumn('email');
    const fullNameColumn = getFilterColumn('fullName');

    if (newMode === 'email') {
      emailColumn?.setFilterValue(currentValue);
      fullNameColumn?.setFilterValue('');
    } else {
      emailColumn?.setFilterValue('');
      fullNameColumn?.setFilterValue(currentValue);
    }

    onSearch?.(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ email: '', name: '' });
    setDateRangeCreate(undefined);
    setDateRangeLastLogin(undefined);
    table.resetColumnFilters();
    onSearch?.({ email: '', name: '' });
  };

  const isFiltered = filters.email ?? filters.name ?? table.getState().columnFilters.length > 0;

  const activeFiltersCount =
    table.getState().columnFilters.length + (filters.email || filters.name ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div className="flex flex-col w-full gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-[300px] min-w-[200px]">
            <Input
              placeholder={`${t('SEARCH_BY')} ${searchMode === 'email' ? t('EMAIL').toLowerCase() : t('NAME').toLowerCase()}...`}
              value={filters[searchMode]}
              onChange={(event) => handleFilterChange(event.target.value)}
              className="h-8 w-full rounded-lg bg-background pr-20"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSearchMode}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
            >
              {searchMode === 'email' ? <Mail className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </Button>
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
                    dateRangeCreate={dateRangeCreate}
                    dateRangeLastLogin={dateRangeLastLogin}
                    onDateRangeCreateChange={setDateRangeCreate || (() => {})}
                    onDateRangeLastLoginChange={setDateRangeLastLogin || (() => {})}
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
              dateRangeCreate={dateRangeCreate}
              dateRangeLastLogin={dateRangeLastLogin}
              onDateRangeCreateChange={setDateRangeCreate || (() => {})}
              onDateRangeLastLoginChange={setDateRangeLastLogin || (() => {})}
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

export default IamTableToolbar;
