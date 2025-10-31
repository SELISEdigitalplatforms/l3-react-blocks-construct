import React from 'react';
import { useTranslation } from 'react-i18next';
import uuidv4 from '@/utils/uuid';
import { FileText, Clock, CheckCircle, AlertCircle, FileEdit } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { Separator } from '@/components/ui-kit/separator';
import {
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
  Table,
  TableBody,
} from '@/components/ui-kit/table';
import { Skeleton } from '@/components/ui-kit/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui-kit/scroll-area';
import { DataTablePagination } from '@/components/core';
import { InvoiceItem, InvoiceStatus } from '../../types/invoices.types';

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
}: Readonly<InvoicesOverviewTableProps<TData>>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [activeStatus, setActiveStatus] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const { t } = useTranslation();

  const handleCellClick = (row: RowType): void => {
    if (onRowClick) {
      onRowClick(row.original);
    }
  };

  const table = useReactTable({
    data: error ? [] : data,
    columns: columns,
    pageCount: Math.ceil((error ? 0 : data.length) / pagination.pageSize),
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
    enableSorting: !isLoading,
    enableColumnFilters: true,
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

  const renderLoadingState = () => {
    return Array.from({ length: pagination.pageSize }).map(() => (
      <TableRow key={`skeleton-row-${uuidv4()}`}>
        {columns.map(() => (
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
        <TableCell colSpan={columns.length} className="h-24 text-center text-error">
          {t('ERROR_LOADING_DATA')} {error?.message}
        </TableCell>
      </TableRow>
    );
  };

  const renderEmptyState = () => {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          {t('NO_RESULTS_FOUND')}
        </TableCell>
      </TableRow>
    );
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

  const renderTableRows = () => {
    const rows = table.getRowModel().rows;

    if (!rows.length) {
      return renderEmptyState();
    }

    return rows.map((row) => (
      <TableRow key={row.id} className="cursor-pointer">
        {row.getVisibleCells().map((cell: any) => renderTableCell(cell, row))}
      </TableRow>
    ));
  };

  const calculateStats = (data: TData[]) => {
    const invoices = data as InvoiceItem[];
    return {
      total: {
        count: invoices.length,
        amount: invoices.reduce((sum, invoice) => sum + invoice.Amount, 0),
      },
      paid: {
        count: invoices.filter((invoice) => invoice.Status === InvoiceStatus.PAID).length,
        amount: invoices
          .filter((invoice) => invoice.Status === InvoiceStatus.PAID)
          .reduce((sum, invoice) => sum + invoice.Amount, 0),
      },
      pending: {
        count: invoices.filter((invoice) => invoice.Status === InvoiceStatus.PENDING).length,
        amount: invoices
          .filter((invoice) => invoice.Status === InvoiceStatus.PENDING)
          .reduce((sum, invoice) => sum + invoice.Amount, 0),
      },
      overdue: {
        count: invoices.filter((invoice) => invoice.Status === InvoiceStatus.OVERDUE).length,
        amount: invoices
          .filter((invoice) => invoice.Status === InvoiceStatus.OVERDUE)
          .reduce((sum, invoice) => sum + invoice.Amount, 0),
      },
      draft: {
        count: invoices.filter((invoice) => invoice.Status === InvoiceStatus.DRAFT).length,
        amount: invoices
          .filter((invoice) => invoice.Status === InvoiceStatus.DRAFT)
          .reduce((sum, invoice) => sum + invoice.Amount, 0),
      },
    };
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
            <button
              type="button"
              onClick={() => {
                setActiveStatus(null);
                setColumnFilters(columnFilters.filter((filter) => filter.id !== 'Status'));
              }}
              className={`flex flex-col hover:bg-primary-50 hover:rounded-[4px] w-full text-left gap-2 px-4 py-3 ${!activeStatus ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('TOTAL_INVOICES')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">
                  {calculateStats(data).total.count}
                </h3>
                <p className="text-base font-medium text-high-emphasis">
                  CHF {calculateStats(data).total.amount.toFixed(2)}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveStatus('Paid');
                setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== 'Status'),
                  { id: 'Status', value: 'Paid' },
                ]);
              }}
              className={`flex flex-col hover:bg-primary-50 hover:rounded-[4px] w-full text-left gap-2 px-4 py-3 ${activeStatus === 'Paid' ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success-background">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('PAID')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">
                  {calculateStats(data).paid.count}
                </h3>
                <p className="text-base font-medium text-high-emphasis">
                  CHF {calculateStats(data).paid.amount.toFixed(2)}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveStatus('Pending');
                setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== 'Status'),
                  { id: 'Status', value: 'Pending' },
                ]);
              }}
              className={`flex flex-col hover:bg-primary-50 hover:rounded-[4px] w-full text-left gap-2 px-4 py-3 ${activeStatus === 'Pending' ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-background">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('PENDING')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">
                  {calculateStats(data).pending.count}
                </h3>
                <p className="text-base font-medium text-high-emphasis">
                  CHF {calculateStats(data).pending.amount.toFixed(2)}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveStatus('Overdue');
                setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== 'Status'),
                  { id: 'Status', value: 'Overdue' },
                ]);
              }}
              className={`flex flex-col hover:bg-primary-50 hover:rounded-[4px] w-full text-left gap-2 px-4 py-3 ${activeStatus === 'Overdue' ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-error-background">
                  <AlertCircle className="h-5 w-5 text-error" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('OVERDUE')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">
                  {calculateStats(data).overdue.count}
                </h3>
                <p className="text-base font-medium text-high-emphasis">
                  CHF {calculateStats(data).overdue.amount.toFixed(2)}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveStatus('Draft');
                setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== 'Status'),
                  { id: 'Status', value: 'Draft' },
                ]);
              }}
              className={`flex flex-col hover:bg-primary-50 hover:rounded-[4px] w-full text-left gap-2 px-4 py-3 ${activeStatus === 'Draft' ? 'bg-primary-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface">
                  <FileEdit className="h-5 w-5 text-medium-emphasis" />
                </div>
                <span className="text-sm font-medium text-medium-emphasis capitalize">
                  {t('DRAFT')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-high-emphasis">
                  {calculateStats(data).draft.count}
                </h3>
                <p className="text-base font-medium text-high-emphasis">
                  CHF {calculateStats(data).draft.amount.toFixed(2)}
                </p>
              </div>
            </button>
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
