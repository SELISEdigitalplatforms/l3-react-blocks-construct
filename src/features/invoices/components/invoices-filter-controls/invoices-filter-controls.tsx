import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-day-picker';
import { InvoiceStatus } from '../../data/invoice-data';
import { DateRangeFilter } from 'components/blocks/data-table/data-table-date-filter';
import { DataTableFacetedFilter } from 'components/blocks/data-table/data-table-faceted-filter';

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
  const statusOptions = Object.values(InvoiceStatus).map((status) => ({
    label: t(status),
    value: status,
    icon: undefined
  }));

  return (
    <div className="flex items-center gap-2">
      {/* Date Issued Filter */}
      <DateRangeFilter
        column={table.getColumn('dateIssued')}
        title={t('DATE_ISSUED')}
        date={dateIssued}
        onDateChange={onDateIssuedChange}
      />

      {/* Due Date Filter */}
      <DateRangeFilter
        column={table.getColumn('dueDate')}
        title={t('DUE_DATE')}
        date={dueDate}
        onDateChange={onDueDateChange}
      />

      {/* Status Filter */}
      {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title={t('STATUS')}
          options={statusOptions}
          className="h-8 px-2"
        />
      )}
    </div>
  );
}

export default InvoicesFilterControls;
