import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-kit/button';

/**
 * DataTableColumnHeader Component
 *
 * A reusable header component for columns in the DataTable that supports:
 * - Sorting functionality with ascending, descending, and unsorted states.
 * - Customizable column title and sorting icon.
 * - Integration with the `@tanstack/react-table` column sorting API.
 * - Responsiveness with customizable styles.
 *
 * Features:
 * - Sorts data based on the column's state.
 * - Displays the appropriate sorting icon (ascending, descending, or unsorted).
 * - Provides a clean and customizable layout for table headers.
 * - Allows toggling of sorting through user interaction.
 *
 * Props:
 * @template TData - The type of data displayed in the table.
 * @template TValue - The type of value in the column.
 * @param {Column<TData, TValue>} column - The column definition from `@tanstack/react-table`.
 * @param {string} title - The title of the column to be displayed.
 * @param {string} [className] - Optional additional class names to apply to the header container.
 */

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

const getSortIcon = <TData, TValue>(column: Column<TData, TValue>) => {
  if (column.getIsSorted() === 'desc') return <ArrowDown className="ml-2 h-4 w-4" />;
  if (column.getIsSorted() === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />;
  return <ChevronsUpDown className="ml-2 h-4 w-4" />;
};

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSort = () => {
    const currentSort = column.getIsSorted();
    if (currentSort === false) {
      column.toggleSorting(false);
    } else if (currentSort === 'asc') {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button variant="ghost" size="sm" onClick={handleSort} className="-ml-3 h-8 hover:bg-accent">
        <span>{title}</span>
        {getSortIcon(column)}
      </Button>
    </div>
  );
};
