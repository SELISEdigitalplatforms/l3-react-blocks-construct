import { Trash } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { ColumnDef } from '@tanstack/react-table';
import { format, startOfDay, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';
import { InvoiceItem, getStatusColors } from '../../types/invoices.types';
import { Button } from '@/components/ui-kit/button';
import { useState } from 'react';
import { ConfirmationModal, DataTableColumnHeader } from '@/components/core';
import { useDeleteInvoiceItem } from '../../hooks/use-invoices';

interface ColumnFactoryProps {
  t: (key: string) => string;
}

const isWithinRange = (date: Date, from: Date, to: Date) => {
  const normalizedDate = startOfDay(date);
  const normalizedFrom = startOfDay(from);
  const normalizedTo = startOfDay(to);

  return (
    (isSameDay(normalizedDate, normalizedFrom) || isAfter(normalizedDate, normalizedFrom)) &&
    (isSameDay(normalizedDate, normalizedTo) || isBefore(normalizedDate, normalizedTo))
  );
};

export const createInvoiceTableColumns = ({
  t,
}: ColumnFactoryProps): ColumnDef<InvoiceItem, any>[] => [
  {
    id: 'ItemId',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('INVOICE_ID')} />,
    accessorFn: (row) => row.ItemId,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="min-w-[100px] truncate font-medium uppercase">{row.original.ItemId}</span>
      </div>
    ),
  },
  {
    id: 'Customer',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('CUSTOMER')} />,
    accessorFn: (row) => row.Customer?.[0]?.CustomerName || '',
    cell: ({ row }) => {
      const customer = row.original.Customer?.[0];
      return (
        <div className="flex items-center gap-2">
          <span className="min-w-[150px] truncate">{customer?.CustomerName || 'N/A'}</span>
        </div>
      );
    },
  },
  {
    id: 'DateIssued',
    accessorFn: (row) => row.DateIssued,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DATE_ISSUED')} />,
    filterFn: (row, id, filterValue: DateRange | undefined) => {
      if (!filterValue?.from) return true;
      const date = parseISO(row.original.DateIssued);
      const from = startOfDay(new Date(filterValue.from));
      const to = filterValue.to ? startOfDay(new Date(filterValue.to)) : from;
      return isWithinRange(date, from, to);
    },
    cell: ({ row }) => {
      const date = parseISO(row.original.DateIssued);
      return (
        <div className="flex items-center">
          <span>{format(date, 'dd/MM/yyyy')}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = parseISO(rowA.original.DateIssued);
      const b = parseISO(rowB.original.DateIssued);
      return a.getTime() - b.getTime();
    },
  },
  {
    id: 'Amount',
    accessorFn: (row) => row.Amount,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('AMOUNT')} />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-medium-emphasis uppercase">
          {row.original.Currency} {row.original.Amount.toFixed(2)}
        </span>
      </div>
    ),
  },
  {
    id: 'DueDate',
    accessorFn: (row) => row.DueDate,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DUE_DATE')} />,
    filterFn: (row, id, filterValue: DateRange | undefined) => {
      if (!filterValue?.from) return true;
      const date = parseISO(row.original.DueDate);
      const from = startOfDay(new Date(filterValue.from));
      const to = filterValue.to ? startOfDay(new Date(filterValue.to)) : from;
      return isWithinRange(date, from, to);
    },
    cell: ({ row }) => {
      const date = parseISO(row.original.DueDate);
      return (
        <div className="flex items-center">
          <span>{format(date, 'dd/MM/yyyy')}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = parseISO(rowA.original.DueDate);
      const b = parseISO(rowB.original.DueDate);
      return a.getTime() - b.getTime();
    },
  },
  {
    id: 'Status',
    accessorKey: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STATUS')} />,
    filterFn: (row, columnId, value: string | string[]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return true;
      const rowValue = row.getValue(columnId);
      return Array.isArray(value)
        ? value.some((v) => v.toLowerCase() === String(rowValue).toLowerCase())
        : String(value).toLowerCase() === String(rowValue).toLowerCase();
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = String(rowA.getValue(columnId) || '').toLowerCase();
      const b = String(rowB.getValue(columnId) || '').toLowerCase();
      return a.localeCompare(b);
    },
    meta: {
      filterVariant: 'select',
      filterSelectOptions: [
        { label: t('PAID'), value: 'Paid' },
        { label: t('PENDING'), value: 'Pending' },
        { label: t('OVERDUE'), value: 'Overdue' },
        { label: t('DRAFT'), value: 'Draft' },
      ],
    },
    cell: ({ row }) => {
      const status = row.original.Status;
      if (!status) return null;

      const { text } = getStatusColors(status);
      return (
        <div className="flex items-center">
          <span className={`font-semibold ${text}`}>{status}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoiceItem();
      const invoice = row.original;

      const handleDelete = () => {
        deleteInvoice(
          {
            filter: JSON.stringify({ _id: invoice.ItemId }),
            input: { isHardDelete: true },
          },
          {
            onSuccess: () => {
              setShowDeleteDialog(false);
            },
            onError: (error) => {
              console.error('Delete error:', error);
            },
          }
        );
      };

      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>

          <button onClick={(e) => e.stopPropagation()}>
            <ConfirmationModal
              open={showDeleteDialog}
              onOpenChange={(open: boolean) => {
                setShowDeleteDialog(open);
              }}
              title="Delete Invoice"
              description="Are you sure you want to delete this invoice?"
              onConfirm={() => {
                handleDelete();
              }}
              confirmText="DELETE"
            />
          </button>
        </div>
      );
    },
  },
];
