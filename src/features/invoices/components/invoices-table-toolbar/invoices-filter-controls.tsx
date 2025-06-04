/* eslint-disable @typescript-eslint/no-empty-function */
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTableFacetedFilter } from 'components/blocks/data-table/data-table-faceted-filter';
import { DateRangeFilter } from 'components/blocks/data-table/data-table-date-filter';
import { getStatusOptions } from './invoices-table-filter-data';
import { DateRange } from 'react-day-picker';

/**
 * FilterControls Component for Invoice Table
 *
 * A set of filter controls for managing and interacting with invoice table data.
 * It provides controls for filtering by date issued, due date, and status.
 *
 * Features:
 * - Date range filters for date issued and due date
 * - Status filter with predefined options
 * - Customizable for mobile and desktop views
 * - Supports passing date ranges via props and notifying parent component on change
 * - Utilizes table instance to access filterable columns and update state accordingly
 *
 * @param {FilterControlsProps<TData>} props - The component props
 * @returns {JSX.Element} A filter controls section with date range pickers and status filter
 */

interface InvoicesFilterControlsProps<TData> {
  table: Table<TData>;
  isMobile?: boolean;
  dateRangeIssued?: DateRange;
  dateRangeDue?: DateRange;
  onDateRangeIssuedChange?: (date: DateRange | undefined) => void;
  onDateRangeDueChange?: (date: DateRange | undefined) => void;
}

export function InvoicesFilterControls<TData>({
  table,
  isMobile = false,
  dateRangeIssued,
  dateRangeDue,
  onDateRangeIssuedChange = () => {},
  onDateRangeDueChange = () => {},
}: Readonly<InvoicesFilterControlsProps<TData>>) {
  const { t } = useTranslation();
  const getFilterColumn = (columnId: string) => {
    return table.getAllFlatColumns().find((col) => col.id === columnId);
  };

  const containerClass = isMobile
    ? 'flex flex-col space-y-4'
    : 'flex flex-row flex-wrap items-center gap-1';

  const statusColumn = getFilterColumn('status');
  const dateIssuedColumn = getFilterColumn('dateIssued');
  const dueDateColumn = getFilterColumn('dueDate');

  return (
    <div className={containerClass}>
      {dateIssuedColumn && (
        <div className={isMobile ? 'w-full' : undefined}>
          <DateRangeFilter
            column={dateIssuedColumn}
            title={t('DATE_ISSUED')}
            date={dateRangeIssued}
            onDateChange={onDateRangeIssuedChange}
          />
        </div>
      )}

      {dueDateColumn && (
        <div className={isMobile ? 'w-full' : undefined}>
          <DateRangeFilter
            column={dueDateColumn}
            title={t('DUE_DATE')}
            date={dateRangeDue}
            onDateChange={onDateRangeDueChange}
          />
        </div>
      )}

      {statusColumn && (
        <div className={isMobile ? 'w-full' : undefined}>
          <DataTableFacetedFilter column={statusColumn} title={t('STATUS')} options={getStatusOptions(t)} />
        </div>
      )}
    </div>
  );
}

export default InvoicesFilterControls;
