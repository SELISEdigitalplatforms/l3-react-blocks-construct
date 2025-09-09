/* eslint-disable @typescript-eslint/no-empty-function */
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTableFacetedFilter } from 'components/blocks/data-table/data-table-faceted-filter';
import { DateRangeFilter } from 'components/blocks/data-table/data-table-date-filter';
import { getMfaEnabledOptions, getStatusOptions } from './iam-table-filter-data';
import { DateRange } from 'react-day-picker';

/**
 * FilterControls Component
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

interface FilterControlsProps<TData> {
  table: Table<TData>;
  isMobile?: boolean;
  dateRangeCreate?: DateRange;
  dateRangeLastLogin?: DateRange;
  onDateRangeCreateChange?: (date: DateRange | undefined) => void;
  onDateRangeLastLoginChange?: (date: DateRange | undefined) => void;
}

export function FilterControls<TData>({
  table,
  isMobile = false,
  dateRangeCreate,
  dateRangeLastLogin,
  onDateRangeCreateChange = () => {},
  onDateRangeLastLoginChange = () => {},
}: Readonly<FilterControlsProps<TData>>) {
  const { t } = useTranslation();
  const getFilterColumn = (columnId: string) => {
    return table.getAllFlatColumns().find((col) => col.id === columnId);
  };

  const containerClass = isMobile
    ? 'flex flex-col space-y-4'
    : 'flex flex-row flex-wrap items-center gap-1';

  const activeColumn = getFilterColumn('active');
  const mfaEnabledColumn = getFilterColumn('mfaEnabled');
  const createdDateColumn = getFilterColumn('createdDate');
  const lastLoggedInTimeColumn = getFilterColumn('lastLoggedInTime');

  return (
    <div className={containerClass}>
      {activeColumn && (
        <div className={isMobile ? 'w-full' : undefined}>
          <DataTableFacetedFilter column={activeColumn} title={t('STATUS')} options={getStatusOptions(t)} />
        </div>
      )}

      {mfaEnabledColumn && (
        <div className={isMobile ? 'w-full' : undefined}>
          <DataTableFacetedFilter column={mfaEnabledColumn} title={t('MFA')} options={getMfaEnabledOptions(t)} />
        </div>
      )}

      {createdDateColumn && (
        <div className={isMobile ? 'w-full' : undefined}>
          <DateRangeFilter
            column={createdDateColumn}
            title={t('JOINED_ON')}
            date={dateRangeCreate}
            onDateChange={onDateRangeCreateChange}
          />
        </div>
      )}

      {lastLoggedInTimeColumn && (
        <div className={isMobile ? 'w-full' : undefined}>
          <DateRangeFilter
            column={lastLoggedInTimeColumn}
            title={t('LAST_LOGIN')}
            date={dateRangeLastLogin}
            onDateChange={onDateRangeLastLoginChange}
          />
        </div>
      )}
    </div>
  );
}

export default FilterControls;
