import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { InventoryData, InventoryStatus, statusColors } from '../../services/inventory-service';

export const createAdvanceTableColumns = (): ColumnDef<InventoryData>[] => [
  {
    id: 'select',
    header: () => <span className="text-xs font-medium">Action</span>,
    meta: 'Action',
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'itemName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item name" />,
    meta: 'Item Name',
    accessorFn: (row) => `${row.itemName || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex w-[200px] items-center gap-2">
          <div className="flex items-center p-[2px] justify-center rounded-md cursor-pointer border w-10 h-10">
            <img
              src={row.original.itemImage}
              alt="item image"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="truncate font-medium">{row.original.itemName}</span>
        </div>
      );
    },
  },
  {
    id: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    meta: 'Category',
    accessorFn: (row) => `${row.category || ''}`.trim(),
    cell: ({ row }) => (
      <div className="flex items-center w-[180px]">
        <span className="truncate">{row.original.category}</span>
      </div>
    ),
  },
  {
    id: 'supplier',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
    meta: 'Supplier',
    accessorFn: (row) => `${row.supplier || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex w-[180px] items-center">
          <span className="truncate">{row.original.supplier}</span>
        </div>
      );
    },
  },
  {
    id: 'itemLoc',
    accessorFn: (row) => `${row.itemLoc || ''}`.trim(),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item location" />,
    meta: 'Item location',
    cell: ({ row }) => {
      return (
        <div className="flex w-[180px] items-center">
          <span className="truncate">{row.original.itemLoc}</span>
        </div>
      );
    },
  },
  {
    id: 'stock',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
    meta: 'Stock',
    accessorFn: (row) => `${row.stock || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex items-center w-[100px]">
          <span className="truncate">{row.original.stock}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.amount === undefined) return true;

      const stockValue = row.getValue(columnId);
      const { type, amount } = filterValue;
      const parsedStock =
        stockValue !== undefined && stockValue !== null ? Number(stockValue) : null;

      if (parsedStock === null) return false;

      if (type === 'less_than') return parsedStock < amount;
      if (type === 'more_than') return parsedStock > amount;
      if (type === 'equal_to') return parsedStock === Number(amount);
      if (type === 'no_entry') return parsedStock === 0;

      return true;
    },
  },
  {
    id: 'lastupdated',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last updated" />,
    meta: 'Last updated',
    accessorFn: (row) => (row.lastupdated ? format(new Date(row.lastupdated), 'yyyy-MM-dd') : ''),
    cell: ({ row }) => {
      const lastUpdated = row.original.lastupdated;
      const date = lastUpdated
        ? new Date(lastUpdated.replace(/\//g, '-')).toISOString().split('T')[0]
        : '-';

      return (
        <div className="flex w-[180px] items-center">
          <span className="truncate">{date}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) {
        return true;
      }

      const rowDate = row.getValue(columnId) as string;

      if (typeof filterValue === 'object' && filterValue !== null) {
        const { type, date, from, to } = filterValue;

        if (type === 'today') {
          const today = format(new Date(), 'yyyy-MM-dd');
          return rowDate === today;
        }

        if (type === 'date' && date) {
          const formattedDate = format(new Date(date), 'yyyy-MM-dd');
          return rowDate === formattedDate;
        }

        if (type === 'after' && date) {
          const formattedDate = format(new Date(date), 'yyyy-MM-dd');
          return rowDate > formattedDate;
        }

        if (type === 'before' && date) {
          const formattedDate = format(new Date(date), 'yyyy-MM-dd');
          return rowDate < formattedDate;
        }

        if (type === 'date_range' && from && to) {
          const formattedFrom = format(new Date(from), 'yyyy-MM-dd');
          const formattedTo = format(new Date(to), 'yyyy-MM-dd');
          return rowDate >= formattedFrom && rowDate <= formattedTo;
        }

        if (type === 'no_entry') {
          return rowDate === '';
        }
      }

      return true;
    },
  },
  {
    id: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    meta: 'Price',
    accessorFn: (row) => `${row.price || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex items-center w-[100px]">
          <span className="truncate">{row.original.price}</span>
        </div>
      );
    },
  },
  {
    id: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    meta: 'Status',
    accessorFn: (row) => `${row.status || ''}`.trim(),
    cell: ({ row }) => {
      const status: InventoryStatus =
        (row.original.status as InventoryStatus) || InventoryStatus.DISCONTINUED;

      return (
        <div className="flex w-[100px] items-center">
          <span className={`px-2 py-1 rounded-md truncate text-${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      );
    },
  },
];
