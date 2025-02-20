/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { Card, CardContent } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { useIsMobile } from 'hooks/use-mobile';

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

function DataTable<TData>({
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
}: DataTableProps<TData>) {
  const isMobile = useIsMobile();
  const [expandedRows, setExpandedRows] = React.useState(new Set<string>());
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // Get visible columns based on view mode
  const visibleColumns = React.useMemo(() => {
    if (!isMobile) return columns;

    return columns.filter((col) => {
      const columnId = (col.id || '').toString();
      return [...mobileColumns, ...mobileProperties].includes(columnId) || columnId === 'actions';
    });
  }, [columns, isMobile, mobileColumns, mobileProperties]);

  const table = useReactTable({
    data: error ? [] : data,
    columns: columns, // Use all columns for the table instance
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    manualPagination,
    pageCount: Math.ceil(pagination.totalCount / pagination.pageSize),
    onPaginationChange: (updater) => {
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

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

  const renderExpandedContent = (rowData: TData) => {
    if (expandedContent) {
      return expandedContent(rowData);
    }

    const expandedColumns = columns.filter((col) => {
      const columnId = (col.id || '').toString();
      const visibleColumnIds = [...mobileColumns, ...mobileProperties];
      return (
        !visibleColumnIds.includes(columnId) && columnId !== 'actions' && columnId !== 'expand'
      );
    });

    const dummyRow =
      table.getRowModel().rows.find((row) => row.original === rowData) ||
      table.getPrePaginationRowModel().rows.find((row) => row.original === rowData);

    if (!dummyRow) return null;

    return (
      <div className="p-4 bg-gray-50 space-y-4">
        {expandedColumns.map((col) => {
          const columnId = (col.id || '').toString();
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

  return (
    <div className="flex flex-col gap-5">
      {toolbar ? toolbar(table) : null}
      <div className="flex">
        <Card className="w-full border-none rounded-lg shadow-sm">
          <CardContent>
            <ScrollArea className="w-full">
              <Table>
                {!isMobile && (
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
                )}
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: pagination.pageSize }).map((_, idx) => (
                      <TableRow key={`skeleton-${idx}`}>
                        {isMobile && expandable && <TableCell className="w-8" />}
                        {(isMobile ? visibleColumns : columns).map((_, colIdx) => (
                          <TableCell key={`skeleton-cell-${idx}-${colIdx}`}>
                            <Skeleton className="h-4 w-3/4" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          (isMobile ? visibleColumns.length : columns.length) +
                          (isMobile && expandable ? 1 : 0)
                        }
                        className="h-24 text-center text-error"
                      >
                        Error loading data: {error.message}
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.id}>
                        <TableRow className="cursor-pointer">
                          {isMobile && expandable && (
                            <TableCell className="w-8" onClick={() => toggleRow(row.id)}>
                              {expandedRows.has(row.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </TableCell>
                          )}
                          {(isMobile
                            ? row.getVisibleCells().filter((cell) => {
                                const columnId = cell.column.id;
                                return (
                                  [...mobileColumns, ...mobileProperties].includes(columnId) ||
                                  columnId === 'actions'
                                );
                              })
                            : row.getVisibleCells()
                          ).map((cell) => (
                            <TableCell
                              key={cell.id}
                              onClick={() => {
                                if (isMobile && expandable) {
                                  toggleRow(row.id);
                                } else if (onRowClick) {
                                  onRowClick(row.original);
                                }
                              }}
                              className={cell.column.id === 'actions' ? 'text-right' : ''}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                        {isMobile && expandable && expandedRows.has(row.id) && (
                          <TableRow>
                            <TableCell colSpan={visibleColumns.length + 1} className="p-0">
                              {renderExpandedContent(row.original)}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={
                          (isMobile ? visibleColumns.length : columns.length) +
                          (isMobile && expandable ? 1 : 0)
                        }
                        className="h-24 text-center"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
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

export default DataTable;
