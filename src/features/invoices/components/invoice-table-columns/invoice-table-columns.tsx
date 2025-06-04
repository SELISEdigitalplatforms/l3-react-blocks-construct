import { ColumnDef } from '@tanstack/react-table';
import { Invoice } from '../../data/invoice-data';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { cn } from 'lib/utils';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';

/**
 * Custom hook that defines and returns the columns for the invoice table.
 * It defines column properties such as headers, cell rendering logic, and formatting.
 *
 * @returns {ColumnDef<Invoice>[]} The columns configuration for the invoice table.
 */
export const useInvoiceTableColumns = () => {
  const { t } = useTranslation();

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'Overdue':
        return 'text-error';
      case 'Draft':
      default:
        return 'text-medium-emphasis';
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      id: 'invoiceId',
      header: () => <span>{t('INVOICE_ID')}</span>,
      accessorKey: 'id',
      cell: ({ row }) => <span className="text-high-emphasis">{row.original.id}</span>,
      enableSorting: false,
    },
    {
      id: 'customer',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('CUSTOMER')} />,
      accessorKey: 'customer.name',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.customer.avatar} alt={row.original.customer.name} />
            <AvatarFallback>
              {row.original.customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-high-emphasis">{row.original.customer.name}</span>
        </div>
      ),
    },
    {
      id: 'dateIssued',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('DATE_ISSUED')} />,
      accessorKey: 'dateIssued',
      cell: ({ row }) => <span className="text-high-emphasis">{row.original.dateIssued}</span>,
      enableSorting: true,
    },
    {
      id: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={`${t('AMOUNT')} (CHF)`} />
      ),
      accessorKey: 'amount',
      cell: ({ row }) => (
        <span className="text-high-emphasis">CHF {row.original.amount.toFixed(2)}</span>
      ),
      enableSorting: true,
    },
    {
      id: 'dueDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('DUE_DATE')} />,
      accessorKey: 'dueDate',
      cell: ({ row }) => <span className="text-high-emphasis">{row.original.dueDate}</span>,
      enableSorting: true,
    },
    {
      id: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('STATUS')} />,
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={cn('font-medium', getStatusColor(row.original.status))}>
          {row.original.status}
        </span>
      ),
      enableSorting: true,
    },
  ];

  return columns;
};
