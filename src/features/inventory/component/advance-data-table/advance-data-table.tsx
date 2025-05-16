import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
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
  getExpandedRowModel,
  ColumnPinningState,
  getGroupedRowModel,
  Column,
  Row,
  Cell,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { DataTablePagination } from 'components/blocks/data-table/data-table-pagination';
import { Checkbox } from 'components/ui/checkbox';
import { Button } from 'components/ui/button';
import { useSidebar } from 'components/ui/sidebar';

export interface AdvanceDataTableProps<TData, TValue> {
  /**
   * Defines the column structure of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column-def)
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * The dataset to be displayed in the table.
   */
  data: TData[];
  /**
   * Callback function triggered when a row is clicked.
   */
  onRowClick?: (data: TData) => void;
  /**
   * Displays a loading state when `true`.
   */
  isLoading?: boolean;
  /**
   * Displays an error message if provided.
   */
  error?: Error | null;
  /**
   * Function to render a custom column toolbar.
   * @param table - The table instance providing access to table state and methods.
   * @returns A React node to be rendered as part of the toolbar.
   */
  columnsToolbar?: (table: TableInstance<TData>) => React.ReactNode;
  /**
   * Function to render a custom filter toolbar.
   * @param table - The table instance providing access to table state and methods.
   * @returns A React node to be rendered as part of the filter toolbar.
   */
  filterToolbar?: (table: TableInstance<TData>) => React.ReactNode;
  /**
   * Enables expandable row content when `true`.
   */
  isExpandRowContent?: boolean;
  /**
   * Function to render expandable row content.
   * @param rowId - The unique identifier of the row being expanded.
   * @param colSpan - The number of columns spanned by the expanded content.
   * @returns A React node to be rendered as the expanded row content.
   */
  expandRowContent?: (rowId: string, colSpan: number) => React.ReactNode;
  /**
   * Controls pagination state.
   */
  pagination: {
    /**
     * The index of the current page (zero-based).
     */
    pageIndex: number;
    /**
     * The number of rows displayed per page.
     */
    pageSize: number;
    /**
     * The total number of rows available in the dataset.
     */
    totalCount: number;
  };
  /**
   * Callback function for pagination changes.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  /**
   * Enables manual pagination when `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#manualpagination)
   */
  manualPagination?: boolean;
  /**
   * Used to configure which columns should be pinned to either the left or right side of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning)
   */
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
}: Readonly<AdvanceDataTableProps<TData, TValue>>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState({});
  const { isMobile } = useSidebar();
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(columnPinningConfig);
  const { t } = useTranslation();

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
    return Array.from({ length: pagination.pageSize }).map(() => (
      <TableRow key={`skeleton-${uuidv4()}`}>
        {columns.map(() => (
          <TableCell key={`skeleton-cell-${uuidv4()}`}>
            <Skeleton className="h-4 w-3/4" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const renderErrorRow = (error: Error | null) => (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center text-error">
        {error ? `${t('ERROR_LOADING_DATA')} ${error.message}` : `${t('UNKNOWN_ERROR_OCCURRED')}`}
      </TableCell>
    </TableRow>
  );

  const renderNoResultFound = () => (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        {t('NO_RESULTS_FOUND')}
      </TableCell>
    </TableRow>
  );

  const renderTableBodyContent = () => {
    if (isLoading) return renderSkeletonRows();
    if (error) return renderErrorRow(error);
    if (!table.getRowModel().rows.length) return renderNoResultFound();

    return table.getRowModel().rows.map((row) => (
      <React.Fragment key={row.id}>
        {renderTableRow(row)}
        {isExpandRowContent && row.getIsExpanded() && expandRowContent?.(row.id, columns.length)}
      </React.Fragment>
    ));
  };

  const renderTableRow = (row: Row<TData>) => (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      onClick={() => onRowClick?.(row.original)}
      className={row.getIsSelected() ? '!bg-primary-50' : 'cursor-pointer'}
    >
      {row.getVisibleCells().map((cell) => renderTableCell(cell, row))}
    </TableRow>
  );

  const renderTableCell = (cell: Cell<TData, unknown>, row: Row<TData>) => {
    const { column } = cell;
    return (
      <TableCell
        key={cell.id}
        className={`pl-4 py-4 ${row.getIsSelected() && '!bg-primary-50'} ${getCommonPinningClasses(column)}`}
        style={{
          left: column.getIsPinned() === 'left' ? `${column.getStart('left')}px` : undefined,
          right: column.getIsPinned() === 'right' ? `${column.getAfter('right')}px` : undefined,
          width: column.getSize(),
        }}
      >
        {cell.column.id === 'select'
          ? renderSelectCell(row)
          : flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  };

  const renderSelectCell = (row: Row<TData>) => (
    <div className="flex items-center gap-2">
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
  );

  const getCommonPinningClasses = (column: Column<TData, unknown>) => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    return clsx(
      isPinned
        ? 'sticky z-[1] opacity-95 bg-white/30 backdrop-blur-md'
        : 'relative z-0 opacity-100',
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
              <TableBody>{renderTableBodyContent()}</TableBody>
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
