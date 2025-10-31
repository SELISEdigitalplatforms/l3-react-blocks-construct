import * as React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TableInstance,
} from '@tanstack/react-table';
import uuidv4 from '@/utils/uuid';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui-kit/table';
import { Card } from '@/components/ui-kit/card';
import { Skeleton } from '@/components/ui-kit/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui-kit/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { DataTablePagination } from './data-table-pagination';

/**
 * DataTable Component
 *
 * A reusable and customizable table component built with `@tanstack/react-table` that supports:
 * - Column-based filtering, sorting, and visibility toggles.
 * - Manual and automatic pagination.
 * - Expandable rows with custom content.
 * - Mobile-friendly column selection.
 * - Error and loading state handling.
 * - Custom toolbar support.
 *
 * Features:
 * - Handles large datasets efficiently.
 * - Supports both client-side and server-side pagination.
 * - Allows row expansion for additional details.
 * - Provides a responsive layout for mobile views.
 * - Enables interactive row selection and click handlers.
 *
 * Props:
 * @template TData - The type of data displayed in the table.
 * @param {ColumnDef<TData, any>[]} columns - Column definitions.
 * @param {TData[]} data - Data to be displayed.
 * @param {(data: TData) => void} [onRowClick] - Callback for row click events.
 * @param {boolean} [isLoading] - Whether data is loading.
 * @param {Error | null} [error] - Error state.
 * @param {(table: TableInstance<TData>) => React.ReactNode} [toolbar] - Custom toolbar component.
 * @param {{ pageIndex: number; pageSize: number; totalCount: number }} pagination - Pagination settings.
 * @param {(pagination: { pageIndex: number; pageSize: number }) => void} [onPaginationChange] - Pagination change handler.
 * @param {boolean} [manualPagination] - Enable manual pagination for server-side handling.
 * @param {(data: TData) => React.ReactNode} [expandedContent] - Function to render expanded row content.
 * @param {string[]} [mobileColumns] - Columns to display on mobile.
 * @param {string[]} [mobileProperties] - Additional properties to show on mobile.
 * @param {boolean} [expandable] - Enable row expansion.
 */

interface RowType {
  id: string | number;
  original: any;
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
  isLoading?: boolean;
  error?: Error | null;
  toolbar?: (table: TableInstance<TData>) => React.ReactNode;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  manualPagination?: boolean;
  expandedContent?: (data: TData) => React.ReactNode;
  mobileColumns?: string[];
  mobileProperties?: string[];
  expandable?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  error = null,
  toolbar,
  pagination,
  onPaginationChange,
  manualPagination = false,
  expandedContent,
  mobileColumns = [],
  mobileProperties = [],
  expandable = true,
}: Readonly<DataTableProps<TData>>) {
  const isMobile = useIsMobile();
  const [expandedRows, setExpandedRows] = React.useState(new Set<string>());
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const { t } = useTranslation();

  const visibleColumns = React.useMemo(() => {
    if (!isMobile) return columns;

    return columns.filter((col) => {
      const columnId = (col.id ?? '').toString();
      return [...mobileColumns, ...mobileProperties].includes(columnId) || columnId === 'actions';
    });
  }, [columns, isMobile, mobileColumns, mobileProperties]);

  const handleCellClick = (row: RowType): void => {
    const handleRowExpand = () => {
      if (expandable) {
        toggleRow(String(row.id));
      }
    };

    const handleRowSelect = () => {
      if (onRowClick) {
        onRowClick(row.original);
      }
    };

    if (onRowClick) {
      handleRowSelect();
    } else if (isMobile && expandable) {
      handleRowExpand();
    }
  };

  const table = useReactTable({
    data: error ? [] : data, // If there's an error, fallback to an empty array
    columns: columns, // Column definitions for the table

    state: {
      sorting, // Stores sorting state
      columnVisibility, // Stores visibility state for columns
      columnFilters, // Stores active column filters
      pagination: {
        pageIndex: pagination.pageIndex, // Current page index
        pageSize: pagination.pageSize, // Number of items per page
      },
    },

    manualPagination, // Enables server-side pagination
    pageCount: Math.ceil(pagination.totalCount / pagination.pageSize), // Calculates the total number of pages

    onPaginationChange: (updater) => {
      // Handles pagination changes
      if (typeof updater === 'function') {
        const newPagination = updater({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        });
        onPaginationChange?.(newPagination);
      } else {
        onPaginationChange?.(updater);
      }
    },

    onSortingChange: setSorting, // Updates sorting state when sorting changes
    onColumnFiltersChange: setColumnFilters, // Updates filters when they change
    onColumnVisibilityChange: setColumnVisibility, // Updates column visibility state

    getCoreRowModel: getCoreRowModel(), // Retrieves the core row model (basic data handling)
    getFilteredRowModel: getFilteredRowModel(), // Applies filtering logic to the data
    getPaginationRowModel: getPaginationRowModel(), // Handles pagination logic
    getSortedRowModel: getSortedRowModel(), // Handles sorting logic
    getFacetedRowModel: getFacetedRowModel(), // Enables faceted filtering (for multi-filtering)
    getFacetedUniqueValues: getFacetedUniqueValues(), // Gets unique values for filtering UI (e.g., dropdown filters)
  });

  // Function to toggle row expansion in mobile view if applicable
  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const getExpandedColumns = () => {
    return columns.filter((col) => {
      const columnId = (col.id ?? '').toString();
      const visibleColumnIds = [...mobileColumns, ...mobileProperties];
      return (
        !visibleColumnIds.includes(columnId) && columnId !== 'actions' && columnId !== 'expand'
      );
    });
  };

  const getDummyRow = (rowData: TData) => {
    return (
      table.getRowModel().rows.find((row) => row.original === rowData) ||
      table.getPrePaginationRowModel().rows.find((row) => row.original === rowData)
    );
  };

  const generateExpandedContent = (rowData: TData) => {
    if (expandedContent) {
      return expandedContent(rowData);
    }

    const expandedColumns = getExpandedColumns();
    const dummyRow = getDummyRow(rowData);

    if (!dummyRow) return null;

    return (
      <div className="p-4 bg-gray-50 space-y-4">
        {expandedColumns.map((col) => {
          const columnId = (col.id ?? '').toString();
          const cell = dummyRow.getAllCells().find((cell) => cell.column.id === columnId);

          if (!cell) return null;

          return (
            <div key={columnId} className="flex flex-col gap-1">
              <span className="text-sm font-medium text-high-emphasis">
                {typeof col.header === 'string' ? col.header : col.id}
              </span>
              <span className="text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLoadingState = () => {
    return Array.from({ length: pagination.pageSize }).map(() => (
      <TableRow key={`skeleton-row-${uuidv4()}`}>
        {isMobile && expandable && <TableCell className="w-8" />}
        {(isMobile ? visibleColumns : columns).map(() => (
          <TableCell key={`skeleton-cell-${uuidv4()}`}>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const renderErrorState = () => {
    return (
      <TableRow>
        <TableCell
          colSpan={
            (isMobile ? visibleColumns.length : columns.length) + (isMobile && expandable ? 1 : 0)
          }
          className="h-24 text-center text-error"
        >
          {t('ERROR_LOADING_DATA')} {error?.message}
        </TableCell>
      </TableRow>
    );
  };

  const renderEmptyState = () => {
    return (
      <TableRow>
        <TableCell
          colSpan={
            (isMobile ? visibleColumns.length : columns.length) + (isMobile && expandable ? 1 : 0)
          }
          className="h-24 text-center"
        >
          {t('NO_RESULTS_FOUND')}
        </TableCell>
      </TableRow>
    );
  };

  const renderExpandButton = (row: any) => {
    if (!isMobile || !expandable) {
      return null;
    }

    return (
      <TableCell className="w-8" onClick={() => toggleRow(row.id)}>
        {expandedRows.has(row.id) ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </TableCell>
    );
  };

  const getVisibleCells = (row: any) => {
    if (!isMobile) {
      return row.getVisibleCells();
    }

    return row.getVisibleCells().filter((cell: any) => {
      const columnId = cell.column.id;
      return [...mobileColumns, ...mobileProperties].includes(columnId) || columnId === 'actions';
    });
  };

  const renderTableCell = (cell: any, row: any) => (
    <TableCell
      key={cell.id}
      onClick={() => handleCellClick(row)}
      className={cell.column.id === 'actions' ? 'text-right' : ''}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );

  const renderExpandedRow = (row: any) => {
    if (!isMobile || !expandable || !expandedRows.has(row.id)) {
      return null;
    }

    return (
      <TableRow>
        <TableCell colSpan={visibleColumns.length + 1} className="p-0">
          {generateExpandedContent(row.original)}
        </TableCell>
      </TableRow>
    );
  };

  const renderTableRows = () => {
    const rows = table.getRowModel().rows;

    if (!rows.length) {
      return renderEmptyState();
    }

    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow className="cursor-pointer">
          {renderExpandButton(row)}
          {getVisibleCells(row).map((cell: any) => renderTableCell(cell, row))}
        </TableRow>
        {renderExpandedRow(row)}
      </React.Fragment>
    ));
  };

  const renderTableBody = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    return renderTableRows();
  };

  const renderTableHeader = () => {
    if (isMobile) {
      return null;
    }

    return (
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {toolbar ? toolbar(table) : null}
      <div className="flex">
        <Card className="w-full border-none rounded-lg shadow-sm bg-background">
          <ScrollArea className="w-full">
            <Table>
              {renderTableHeader()}
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      </div>
      <DataTablePagination
        showSelectedRowContent={false}
        table={table}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
}
