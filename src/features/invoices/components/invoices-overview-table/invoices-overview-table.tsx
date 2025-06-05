import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  FileEdit,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
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
import { useIsMobile } from 'hooks/use-mobile';
import { TableRow, TableCell, TableHeader, TableHead, Table, TableBody } from 'components/ui/table';
import { Skeleton } from 'components/ui/skeleton';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { DataTablePagination } from 'components/blocks/data-table/data-table-pagination';

interface RowType {
  id: string | number;
  original: any;
}

export interface InvoicesOverviewTableProps<TData> {
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
function InvoicesOverviewTable<TData>({
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
}: Readonly<InvoicesOverviewTableProps<TData>>) {
  const isMobile = useIsMobile();
  const [expandedRows, setExpandedRows] = React.useState(new Set<string>());
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: uuidv4 } = require('utils/uuid');
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

    if (isMobile) {
      handleRowExpand();
    } else {
      handleRowSelect();
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

  // Function to toggle row expansion
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
    <div className="flex flex-col w-full gap-5">
      {toolbar ? toolbar(table) : null}
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardHeader className="!pb-0">
          <CardTitle className="text-xl text-high-emphasis">{t('OVERVIEW')}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('TOTAL_INVOICES')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">120</h3>
                <p className="text-base font-medium text-high-emphasis">CHF 82,564.00</p>
              </div>
            </div>
            <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success-background">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('PAID')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">73</h3>
                <p className="text-base font-medium text-high-emphasis">CHF 35,200.00</p>
              </div>
            </div>
            <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-background">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('PENDING')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">47</h3>
                <p className="text-base font-medium text-high-emphasis">CHF 27,450.00</p>
              </div>
            </div>
            <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-error-background">
                  <AlertCircle className="h-5 w-5 text-error" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('OVERDUE')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">4</h3>
                <p className="text-base font-medium text-high-emphasis">CHF 9,914.00</p>
              </div>
            </div>
            <div className="flex flex-col hover:bg-primary-50 hover:rounded-[4px] cursor-pointer gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface">
                  <FileEdit className="h-5 w-5 text-medium-emphasis" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('DRAFT')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">3</h3>
                <p className="text-base font-medium text-high-emphasis">CHF 10,000.00</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <ScrollArea className="w-full">
              <Table>
                {renderTableHeader()}
                <TableBody>{renderTableBody()}</TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <DataTablePagination
            showSelectedRowContent={false}
            table={table}
            onPaginationChange={onPaginationChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export { InvoicesOverviewTable };
