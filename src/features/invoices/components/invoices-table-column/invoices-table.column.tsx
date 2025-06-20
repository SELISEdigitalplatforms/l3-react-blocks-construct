import { ColumnDef } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';
import { format, startOfDay, isAfter, isBefore, isSameDay } from 'date-fns';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { Invoice, InvoiceStatus, statusColors } from '../../data/invoice-data';

interface ColumnFactoryProps {
  t: (key: string) => string;
}

const formatDateOnly = (date: Date) => {
  return format(date, 'dd/MM/yyyy');
};

const isWithinRange = (date: Date, from: Date, to: Date) => {
  const normalizedDate = startOfDay(date);
  const normalizedFrom = startOfDay(from);
  const normalizedTo = startOfDay(to);

  return (
    (isSameDay(normalizedDate, normalizedFrom) || isAfter(normalizedDate, normalizedFrom)) &&
    (isSameDay(normalizedDate, normalizedTo) || isBefore(normalizedDate, normalizedTo))
  );
};

export const createInvoiceTableColumns = ({ t }: ColumnFactoryProps): ColumnDef<Invoice, any>[] => [
  {
    id: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('INVOICE_ID')} />,
    accessorFn: (row) => row.id,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="min-w-[100px] truncate font-medium">{row.original.id}</span>
      </div>
    ),
  },
  {
    id: 'customerName',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('CUSTOMER')} />,
    accessorFn: (row) => row.customerName,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.customerImg}
          alt={row.original.customerName}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="min-w-[150px] truncate">{row.original.customerName}</span>
      </div>
    ),
  },
  {
    id: 'dateIssued',
    accessorFn: (row) => row.dateIssued,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DATE_ISSUED')} />,
    filterFn: (row, id, filterValue: DateRange | undefined) => {
      if (!filterValue?.from) return true;
      const date = new Date(row.original.dateIssued);
      const from = new Date(filterValue.from);
      const to = filterValue.to ? new Date(filterValue.to) : from;
      return isWithinRange(date, from, to);
    },
    cell: ({ row }) => {
      const date = new Date(row.original.dateIssued);
      return (
        <div className="flex items-center">
          <span>{formatDateOnly(date)}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.dateIssued);
      const b = new Date(rowB.original.dateIssued);
      return a.getTime() - b.getTime();
    },
  },
  {
    id: 'amount',
    accessorFn: (row) => row.amount,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('AMOUNT')} />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>CHF {row.original.amount.toFixed(2)}</span>
      </div>
    ),
  },
  {
    id: 'dueDate',
    accessorFn: (row) => row.dueDate,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DUE_DATE')} />,
    filterFn: (row, id, filterValue: DateRange | undefined) => {
      if (!filterValue?.from) return true;
      const date = new Date(row.original.dueDate);
      const from = new Date(filterValue.from);
      const to = filterValue.to ? new Date(filterValue.to) : from;
      return isWithinRange(date, from, to);
    },
    cell: ({ row }) => {
      const date = new Date(row.original.dueDate);
      return (
        <div className="flex items-center">
          <span>{formatDateOnly(date)}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.dueDate);
      const b = new Date(rowB.original.dueDate);
      return a.getTime() - b.getTime();
    },
  },
  {
    id: 'status',
    accessorFn: (row) => row.status,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STATUS')} />,
    filterFn: (row, id, value: InvoiceStatus[] | undefined) => {
      if (!value?.length) return true;
      const status = row.getValue(id);
      return value.includes(status as InvoiceStatus);
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const color = statusColors[status];
      return (
        <div className="flex items-center">
          <span className={`font-semibold ${color.text}`}>{status}</span>
        </div>
      );
    },
  },
];
