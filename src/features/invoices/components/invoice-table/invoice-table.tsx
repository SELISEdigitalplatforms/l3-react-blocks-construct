import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { DataTablePagination } from 'components/blocks/data-table/data-table-pagination';
import { useInvoiceTableColumns } from '../invoice-table-columns/invoice-table-columns';
import { invoiceData } from '../../data/invoice-data';

/**
 * InvoiceTable is a component that displays a paginated table of invoices.
 * It uses TanStack Table for data handling and UI components from shadcn/ui.
 *
 * @component
 * @example
 * return <InvoiceTable />;
 *
 * @returns {JSX.Element} The rendered InvoiceTable component.
 */
function InvoiceTable({
  onTableReady,
}: { onTableReady?: (table: any, columns: any[]) => void } = {}) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useInvoiceTableColumns();

  const table = useReactTable({
    data: invoiceData,
    columns,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (onTableReady) {
      onTableReady(table, columns);
    }
  }, [table, columns, onTableReady]);

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-medium text-medium-emphasis">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={row.getIsSelected() ? '!bg-primary-50' : 'cursor-pointer'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`pl-4 py-4 ${row.getIsSelected() && '!bg-primary-50'}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('NO_INVOICES_FOUND')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination
        table={table}
        showSelectedRowContent={false}
        onPaginationChange={setPagination}
      />
    </div>
  );
}

export { InvoiceTable };
