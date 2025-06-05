import { ColumnDef } from '@tanstack/react-table';
import { Badge } from 'components/ui/badge';
import { CustomtDateFormat } from 'lib/custom-date-formatter';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { Invoice, statusColors } from '../../data/invoice-data';

interface ColumnFactoryProps {
  t: (key: string) => string;
}

const compareValues = (a: any, b: any) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export const createInvoiceTableColumns = ({ t }: ColumnFactoryProps): ColumnDef<Invoice, any>[] => [
  {
    id: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('INVOICE_ID')} />,
    accessorFn: (row) => row.id,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="max-w-[300px] truncate font-medium">{row.original.id}</span>
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
        <span className="max-w-[300px] truncate">{row.original.customerName}</span>
      </div>
    ),
  },
  {
    id: 'dateIssued',
    accessorFn: (row) => row.dateIssued,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DATE_ISSUED')} />,
    cell: ({ row }) => {
      const date = new Date(row.original.dateIssued);
      return (
        <div className="flex items-center">
          <span>{CustomtDateFormat(date)}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.dateIssued).getTime();
      const b = new Date(rowB.original.dateIssued).getTime();
      return compareValues(a, b);
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
    cell: ({ row }) => {
      const date = new Date(row.original.dueDate);
      return (
        <div className="flex items-center">
          <span>{CustomtDateFormat(date)}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.dueDate).getTime();
      const b = new Date(rowB.original.dueDate).getTime();
      return compareValues(a, b);
    },
  },
  {
    id: 'status',
    accessorFn: (row) => row.status,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STATUS')} />,
    cell: ({ row }) => {
      const status = row.original.status;
      const color = statusColors[status];
      return (
        <div className="flex items-center">
          <Badge variant="outline" className={`text-${color}`}>
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (value.length === 0) return true;
      const cellValue = row.getValue(id);
      return value.includes(String(cellValue));
    },
  },
];
