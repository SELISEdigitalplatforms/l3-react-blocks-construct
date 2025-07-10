import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { InvoicesFilterControls } from '../invoices-filter-controls/invoices-filter-controls';

interface InvoicesFilterToolbarProps<TData> {
  table: Table<TData>;
}

export function InvoicesFilterToolbar<TData>({
  table,
}: Readonly<InvoicesFilterToolbarProps<TData>>) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [dateIssued, setDateIssued] = useState<DateRange | undefined>();
  const [dueDate, setDueDate] = useState<DateRange | undefined>();

  useEffect(() => {
    const column = table.getColumn('customerName');
    if (column) {
      column.setFilterValue(search);
    }
  }, [search, table]);

  useEffect(() => {
    const column = table.getColumn('dateIssued');
    if (column) {
      column.setFilterValue(
        dateIssued
          ? {
              from: dateIssued.from?.toISOString(),
              to: dateIssued.to?.toISOString(),
            }
          : undefined
      );
    }
  }, [dateIssued, table]);

  useEffect(() => {
    const column = table.getColumn('dueDate');
    if (column) {
      column.setFilterValue(
        dueDate
          ? {
              from: dueDate.from?.toISOString(),
              to: dueDate.to?.toISOString(),
            }
          : undefined
      );
    }
  }, [dueDate, table]);

  const handleResetFilters = () => {
    setSearch('');
    setDateIssued(undefined);
    setDueDate(undefined);
    table.resetColumnFilters();
  };

  const isFiltered = search ?? table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col w-full gap-4 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-[300px] min-w-[200px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`${t('SEARCH_CUSTOMER_NAME')}...`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-full rounded-lg bg-background pl-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <InvoicesFilterControls
          table={table}
          dateIssued={dateIssued}
          dueDate={dueDate}
          onDateIssuedChange={setDateIssued}
          onDueDateChange={setDueDate}
        />

        {isFiltered && (
          <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 lg:px-3">
            {t('RESET')}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default InvoicesFilterToolbar;
