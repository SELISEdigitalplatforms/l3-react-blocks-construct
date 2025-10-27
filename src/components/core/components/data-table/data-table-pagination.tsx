import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';

/**
 * DataTablePagination Component
 *
 * A pagination component for navigating and controlling the page size of a data table.
 * It integrates with the `@tanstack/react-table` pagination API to allow users to
 * navigate between pages and select the number of rows per page.
 *
 * Features:
 * - Displays the current page and total number of pages.
 * - Allows selecting the number of rows per page from predefined options.
 * - Includes navigation buttons to move to the first, previous, next, and last pages.
 * - Optionally displays the number of selected rows in the table.
 *
 * @template TData - The type of data used in the table.
 *
 * @param {Table<TData>} table - The instance of the table being paginated, from `@tanstack/react-table`.
 * @param {(pagination: { pageIndex: number; pageSize: number }) => void} [onPaginationChange] - Optional callback to handle pagination changes (e.g., when the page size or page index changes).
 * @param {boolean} [showSelectedRowContent=true] - Whether to show the content related to selected rows (defaults to true).
 */

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  showSelectedRowContent?: boolean;
}

export function DataTablePagination<TData>({
  table,
  onPaginationChange,
  showSelectedRowContent = true,
}: Readonly<DataTablePaginationProps<TData>>) {
  const { t } = useTranslation();
  const totalCount = table.getPageCount() * table.getState().pagination.pageSize;
  const pageSizes = Array.from(
    { length: Math.min(5, Math.max(1, Math.ceil(totalCount / 10))) },
    (_, i) => Math.min((i + 1) * 10, 50)
  ).filter((size, i) => i === 0 || size <= totalCount);

  return (
    <div className="flex w-full items-center justify-between px-2">
      {showSelectedRowContent ? (
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t('DATA_TABLE_OF')}{' '}
          {table.getFilteredRowModel().rows.length} {t('ROWS_SELECTED')}
        </div>
      ) : null}
      <div className={`flex  items-center ${!showSelectedRowContent && 'w-full justify-end'}`}>
        <div className="flex items-center space-x-2">
          <p className="hidden sm:flex text-sm font-medium">{t('ROWS_PER_PAGE')}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const newSize = Number(value);
              table.setPageSize(newSize);
              onPaginationChange?.({
                pageSize: newSize,
                pageIndex: 0,
              });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('PAGE')} {table.getState().pagination.pageIndex + 1} {t('DATA_TABLE_OF')}{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0);
              onPaginationChange?.({
                pageIndex: 0,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('GO_TO_FIRST_PAGE')}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              const previousPage = table.getState().pagination.pageIndex - 1;
              table.previousPage();
              onPaginationChange?.({
                pageIndex: previousPage,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('GO_TO_PREVIOUS_PAGE')}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              const nextPage = table.getState().pagination.pageIndex + 1;
              table.nextPage();
              onPaginationChange?.({
                pageIndex: nextPage,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('GO_TO_NEXT_PAGE')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              const lastPage = table.getPageCount() - 1;
              table.setPageIndex(lastPage);
              onPaginationChange?.({
                pageIndex: lastPage,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('GO_TO_LAST_PAGE')}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
