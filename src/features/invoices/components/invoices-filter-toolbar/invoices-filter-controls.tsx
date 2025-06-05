import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { Calendar } from 'components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { cn } from 'lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { InvoiceStatus } from '../../data/invoice-data';

/**
 * InvoicesFilterControls Component
 *
 * A set of filter controls for managing and interacting with table data, such as filtering by date range.
 * It provides controls for filtering by creation date and last login date, along with customization for mobile views.
 *
 * Features:
 * - Date range filters for creation date and last login date
 * - Customizable for mobile and desktop views
 * - Supports passing date ranges via props and notifying parent component on change
 * - Utilizes table instance to access filterable columns and update state accordingly
 *
 * Props:
 * - `table` (Table<TData>): The table instance that holds the data and controls for filtering
 * - `isMobile` (boolean, optional): Flag to indicate whether the view is for mobile (default is `false`)
 * - `dateRangeCreate` (DateRange, optional): The current date range for creation date filtering
 * - `dateRangeLastLogin` (DateRange, optional): The current date range for last login date filtering
 * - `onDateRangeCreateChange` (function, optional): Callback that triggers when the creation date range changes
 * - `onDateRangeLastLoginChange` (function, optional): Callback that triggers when the last login date range changes
 *
 * @param {FilterControlsProps<TData>} props - The component props
 * @returns {JSX.Element} A filter controls section with date range pickers for creation and last login dates
 *
 * @example
 * <FilterControls
 *   table={tableInstance}
 *   isMobile={true}
 *   dateRangeCreate={{ start: new Date(), end: new Date() }}
 *   dateRangeLastLogin={{ start: new Date(), end: new Date() }}
 *   onDateRangeCreateChange={(newRange) => console.log(newRange)}
 *   onDateRangeLastLoginChange={(newRange) => console.log(newRange)}
 * />
 */

interface InvoicesFilterControlsProps<TData> {
  table: Table<TData>;
  dateIssued?: DateRange;
  dueDate?: DateRange;
  onDateIssuedChange: (date: DateRange | undefined) => void;
  onDueDateChange: (date: DateRange | undefined) => void;
}

export function InvoicesFilterControls<TData>({
  table,
  dateIssued,
  dueDate,
  onDateIssuedChange,
  onDueDateChange,
}: Readonly<InvoicesFilterControlsProps<TData>>) {
  const { t } = useTranslation();

  const statusColumn = table.getColumn('status');
  const statusOptions = Object.values(InvoiceStatus) as InvoiceStatus[];

  return (
    <div className="flex flex-wrap gap-2">
      {/* Date Issued Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 border-dashed',
              dateIssued ? 'text-primary' : ''
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateIssued?.from ? (
              dateIssued.to ? (
                <>
                  {format(dateIssued.from, 'dd.MM.yyyy')} -{' '}
                  {format(dateIssued.to, 'dd.MM.yyyy')}
                </>
              ) : (
                format(dateIssued.from, 'dd.MM.yyyy')
              )
            ) : (
              <span>{t('DATE_ISSUED')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateIssued?.from}
            selected={dateIssued}
            onSelect={onDateIssuedChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Due Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 border-dashed',
              dueDate ? 'text-primary' : ''
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate?.from ? (
              dueDate.to ? (
                <>
                  {format(dueDate.from, 'dd.MM.yyyy')} -{' '}
                  {format(dueDate.to, 'dd.MM.yyyy')}
                </>
              ) : (
                format(dueDate.from, 'dd.MM.yyyy')
              )
            ) : (
              <span>{t('DUE_DATE')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dueDate?.from}
            selected={dueDate}
            onSelect={onDueDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      {statusColumn && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 border-dashed',
            statusColumn.getFilterValue() ? 'text-primary' : ''
          )}
          onClick={() => {
            const currentValue = statusColumn.getFilterValue() as InvoiceStatus | undefined;
            const currentIndex = currentValue ? statusOptions.indexOf(currentValue) : -1;
            const nextIndex = (currentIndex + 1) % statusOptions.length;
            const nextStatus = statusOptions[nextIndex];
            statusColumn.setFilterValue(nextStatus);
          }}
        >
          {(statusColumn.getFilterValue() as InvoiceStatus) || t('STATUS')}
        </Button>
      )}
    </div>
  );
}

export default InvoicesFilterControls;
