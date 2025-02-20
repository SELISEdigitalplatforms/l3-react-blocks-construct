import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { DataTablePagination } from 'components/blocks/data-table/data-table-pagination';
import { Checkbox } from 'components/ui/checkbox';
import { Button } from 'components/ui/button';

export interface AdvanceDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
  isLoading?: boolean;
  error?: Error | null;
  columnsToolbar?: (table: TableInstance<TData>) => React.ReactNode;
  filterToolbar?: (table: TableInstance<TData>) => React.ReactNode;
  isExpandRowContent?: boolean;
  expandRowContent?: (rowId: string, columnsLength: number) => React.ReactNode;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  manualPagination?: boolean;
}

export function AdvanceDataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  error = null,
  columnsToolbar,
  filterToolbar,
  isExpandRowContent = true,
  expandRowContent,
  pagination,
  onPaginationChange,
  manualPagination = false,
}: AdvanceDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const table = useReactTable({
    data: error ? [] : data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
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
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
      <TableRow key={`skeleton-${rowIndex}`}>
        {columns.map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const handleRowClick = (rowId: string) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId));
  };

  return (
    <div className="flex w-full flex-col gap-5">
      {columnsToolbar ? columnsToolbar(table) : null}
      <div className="flex w-full">
        <Card className="w-full border-none rounded-[4px] shadow-sm">
          <CardHeader className="hidden">
            <CardTitle />
            <CardDescription />
          </CardHeader>
          <CardContent className="p-0 md:p-0">
            <div className="relative w-full overflow-auto ">
              <Table>
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
                  {filterToolbar ? filterToolbar(table) : null}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    renderSkeletonRows()
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-error">
                        Error loading data: {error.message}
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <>
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                          onClick={() => {
                            onRowClick?.(row.original);
                          }}
                          className={
                            row.getIsSelected() ? '!bg-primary-shade-50' : 'cursor-pointer'
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="[&:has([role=checkbox])]:pr-0 pl-4 py-4"
                            >
                              {cell.column.id === 'select' ? (
                                <div key={cell.id} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={row.getIsSelected()}
                                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Select row"
                                    className="border-medium-emphasis data-[state=checked]:border-none border-2"
                                  />
                                  {isExpandRowContent && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="rounded-full"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRowClick(row.id);
                                      }}
                                    >
                                      <ChevronDown />
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                              )}
                            </TableCell>
                          ))}
                        </TableRow>

                        {/* Accordion content below the row */}
                        {isExpandRowContent &&
                          expandedRow === row.id &&
                          expandRowContent?.(row.id, columns.length)}
                      </>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <DataTablePagination table={table} onPaginationChange={onPaginationChange} />
    </div>
  );
}

export default AdvanceDataTable;
