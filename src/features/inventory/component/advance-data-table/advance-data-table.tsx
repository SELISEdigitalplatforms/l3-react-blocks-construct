import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
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
  getExpandedRowModel,
  ColumnPinningState,
  getGroupedRowModel,
  Column,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { DataTablePagination } from 'components/blocks/data-table/data-table-pagination';
import { Checkbox } from 'components/ui/checkbox';
import { Button } from 'components/ui/button';
import { useSidebar } from 'components/ui/sidebar';

export interface AdvanceDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
  isLoading?: boolean;
  error?: Error | null;
  columnsToolbar?: (table: TableInstance<TData>) => React.ReactNode;
  filterToolbar?: (table: TableInstance<TData>) => React.ReactNode;
  isExpandRowContent?: boolean;
  expandRowContent?: (rowId: string, colSpan: number) => React.ReactNode;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  manualPagination?: boolean;
  columnPinningConfig?: ColumnPinningState;
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
  columnPinningConfig = { left: ['select'], right: [] },
}: AdvanceDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState({});
  const { open, isMobile } = useSidebar();
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(columnPinningConfig);

  useEffect(() => {
    setColumnPinning(() => ({
      left: isMobile ? ['select'] : columnPinningConfig.left,
      right: columnPinningConfig.right,
    }));
  }, [isMobile, columnPinningConfig]);

  const table = useReactTable({
    data: error ? [] : data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
      columnPinning,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    onExpandedChange: setExpanded,
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
    enableGrouping: true,
    groupedColumnMode: 'reorder',
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
    getExpandedRowModel: getExpandedRowModel(),
    onColumnPinningChange: setColumnPinning,
    getGroupedRowModel: getGroupedRowModel(),
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

  const getCommonPinningClasses = (column: Column<TData, unknown>) => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    return clsx(
      isPinned ? 'sticky z-[1] bg-card' : 'relative z-0',
      isLastLeftPinnedColumn && 'shadow-inset-right',
      isFirstRightPinnedColumn && 'shadow-inset-left'
    );
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
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={`pr-0 ${getCommonPinningClasses(column)}`}
                          style={{
                            left:
                              column.getIsPinned() === 'left'
                                ? `${column.getStart('left')}px`
                                : undefined,
                            right:
                              column.getIsPinned() === 'right'
                                ? `${column.getAfter('right')}px`
                                : undefined,
                            width: column.getSize(),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
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
                  table.getRowModel().rows.map((row) => {
                    return (
                      <>
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                          onClick={() => {
                            onRowClick?.(row.original);
                          }}
                          className={row.getIsSelected() ? '!bg-primary-50' : 'cursor-pointer'}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const { column } = cell;
                            return (
                              <TableCell
                                key={cell.id}
                                className={`pl-4 py-4 ${row.getIsSelected() && '!bg-primary-50'} ${getCommonPinningClasses(column)}`}
                                style={{
                                  left:
                                    column.getIsPinned() === 'left'
                                      ? `${column.getStart('left')}px`
                                      : undefined,
                                  right:
                                    column.getIsPinned() === 'right'
                                      ? `${column.getAfter('right')}px`
                                      : undefined,
                                  width: column.getSize(),
                                }}
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
                                          row.toggleExpanded();
                                        }}
                                      >
                                        {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  flexRender(cell.column.columnDef.cell, cell.getContext())
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>

                        {/* Accordion content below the row */}
                        {isExpandRowContent && row.getIsExpanded() && expandRowContent
                          ? expandRowContent(
                              row.id,
                              open && !isMobile ? columns.length - 2 : columns.length
                            )
                          : null}
                      </>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

export default AdvanceDataTable;
