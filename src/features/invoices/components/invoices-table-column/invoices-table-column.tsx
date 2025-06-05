import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { Invoice, statusColors } from '../../data/invoice-data';

/**
 * Creates column definitions for the invoices table.
 * @returns {ColumnDef<Invoice>[]} An array of column definitions for the table.
 */
interface InvoicesTableColumnProps {
  t: (key: string) => string;
}

export const createInvoicesTableColumns = ({
  t,
}: InvoicesTableColumnProps): ColumnDef<Invoice>[] => [
  /**
   * Column for displaying the Invoice ID.
   */
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('INVOICE_ID')} />,
    meta: 'INVOICE_ID',
    size: 150,
    enableSorting: false,
  },
  /**
   * Column for displaying the customer name and image.
   */
  {
    id: 'customer',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('CUSTOMER')} />,
    meta: 'CUSTOMER',
    accessorFn: (row) => row.customerName,
    size: 250,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center p-[2px] justify-center rounded-full cursor-pointer border w-10 h-10">
            <img
              src={row.original.customerImg}
              alt={row.original.customerName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="truncate font-medium">{row.original.customerName}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the date issued.
   */
  {
    accessorKey: 'dateIssued',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DATE_ISSUED')} />,
    meta: 'DATE_ISSUED',
    size: 150,
    cell: ({ row }) => {
      const dateIssued = row.original.dateIssued;
      return (
        <div className="flex items-center">
          <span className="truncate">
            {dateIssued ? format(new Date(dateIssued), 'dd.MM.yyyy') : '-'}
          </span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: [Date, Date]) => {
      const date = new Date(row.getValue(columnId));
      const [start, end] = filterValue;
      if (start && end) {
        return date >= start && date <= end;
      }
      return true;
    },
  },
  /**
   * Column for displaying the amount.
   */
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('AMOUNT')} />,
    meta: 'AMOUNT',
    size: 150,
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <div className="flex items-center">
          <span className="truncate">{amount ? `CHF ${amount.toFixed(2)}` : '-'}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the due date.
   */
  {
    accessorKey: 'dueDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DUE_DATE')} />,
    meta: 'DUE_DATE',
    size: 150,
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return (
        <div className="flex items-center">
          <span className="truncate">
            {dueDate ? format(new Date(dueDate), 'dd.MM.yyyy') : '-'}
          </span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: [Date, Date]) => {
      const date = new Date(row.getValue(columnId));
      const [start, end] = filterValue;
      if (start && end) {
        return date >= start && date <= end;
      }
      return true;
    },
  },
  /**
   * Column for displaying the status.
   */
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STATUS')} />,
    meta: 'STATUS',
    size: 100,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColor = statusColors[status] ?? 'medium-emphasis';

      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-md truncate capitalize text-${statusColor}`}>
            {t(status.toUpperCase())}
          </span>
        </div>
      );
    },
  },
];
