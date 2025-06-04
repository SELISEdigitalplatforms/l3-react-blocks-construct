import { useEffect, useState, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { X, Search, Filter } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { debounce } from 'lodash';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import InvoicesFilterControls from './invoices-filter-controls';

/**
 * Renders a toolbar for the Invoices table, allowing users to search
 * and filter data based on invoice ID, customer name, date issued, due date, and status.
 *
 * Features:
 * - Provides an input field for searching by invoice ID or customer name
 * - Includes mobile-responsive filters using a sheet and desktop filters
 * - Supports date range filters for date issued and due date
 * - Supports status filtering with predefined options
 * - Displays a count of active filters and allows resetting them
 *
 * @param {InvoicesTableToolbarProps<TData>} props - The props for configuring the toolbar
 * @param {Table<TData>} props.table - The table instance for controlling the data
 * @param {function} [props.onSearch] - Optional callback function triggered when filters are applied
 *
 * @returns {JSX.Element} - The rendered toolbar with search, filter, and reset options
 *
 * @example
 * <InvoicesTableToolbar
 *   table={tableInstance}
 *   onSearch={(filters) => console.log('Filters applied:', filters)}
 * />
 */

interface InvoicesTableToolbarProps<TData> {
  table: Table<TData>;
  onSearch?: (filters: { query: string }) => void;
  columns: any[];
}

function InvoicesTableToolbar<TData>({
  table,
  onSearch,
}: Readonly<InvoicesTableToolbarProps<TData>>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [dateRangeIssued, setDateRangeIssued] = useState<DateRange | undefined>(undefined);
  const [dateRangeDue, setDateRangeDue] = useState<DateRange | undefined>(undefined);
  const { t } = useTranslation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch?.({ query });

      // Update global filter for the table
      table.setGlobalFilter(query);
    }, 500),
    [onSearch, table]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateRangeIssued(undefined);
    setDateRangeDue(undefined);
    table.resetColumnFilters();
    table.setGlobalFilter('');
    onSearch?.({ query: '' });
  };

  const isFiltered = searchQuery || table.getState().columnFilters.length > 0;

  const activeFiltersCount = table.getState().columnFilters.length + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div className="flex flex-col w-full gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-[300px] min-w-[200px]">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder={`${t('SEARCH_CUSTOMER_NAME')}...`}
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="h-8 w-full rounded-lg bg-background pl-8"
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
                  <InvoicesFilterControls
                    table={table}
                    isMobile={true}
                    dateRangeIssued={dateRangeIssued}
                    dateRangeDue={dateRangeDue}
                    onDateRangeIssuedChange={setDateRangeIssued}
                    onDateRangeDueChange={setDateRangeDue}
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
            <InvoicesFilterControls
              table={table}
              dateRangeIssued={dateRangeIssued}
              dateRangeDue={dateRangeDue}
              onDateRangeIssuedChange={setDateRangeIssued}
              onDateRangeDueChange={setDateRangeDue}
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
    </div>
  );
}

export { InvoicesTableToolbar };
