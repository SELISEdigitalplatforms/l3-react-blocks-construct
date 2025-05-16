import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { InventoryData, InventoryStatus, statusColors } from '../../services/inventory-service';
import { CustomtDateFormat } from 'lib/custom-date-formatter';

/**
 * Creates column definitions for an advanced inventory table.
 * @returns {ColumnDef<InventoryData>[]} An array of column definitions for the table.
 */
interface AdvanceTableColumnProps {
  t: (key: string) => string;
}

export const createAdvanceTableColumns = ({
  t,
}: AdvanceTableColumnProps): ColumnDef<InventoryData>[] => [
  /**
   * Column for selecting an action on the inventory item.
   */
  {
    id: 'select',
    header: () => <span className="text-xs font-medium">{t('ACTION')}</span>,
    accessorKey: 'select',
    meta: 'ACTION',
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
    size: 80,
  },
  /**
   * Column for displaying the item name and its image.
   */
  {
    id: 'itemName',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('ITEM_NAME')} />,
    meta: 'ITEM_NAME',
    enablePinning: true,
    accessorFn: (row) => `${row.itemName || ''}`.trim(),
    size: 160,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center p-[2px] justify-center rounded-md cursor-pointer border w-10 h-10">
            <img
              src={row.original.itemImage}
              alt="item view"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="truncate font-medium">{row.original.itemName}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the item category.
   */
  {
    id: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('CATEGORY')} />,
    meta: 'CATEGORY',
    accessorFn: (row) => `${row.category || ''}`.trim(),
    cell: ({ row }) => (
      <div className="flex items-center w-[180px]">
        <span className="truncate">{row.original.category}</span>
      </div>
    ),
  },
  /**
   * Column for displaying the item's supplier.
   */
  {
    id: 'supplier',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SUPPLIER')} />,
    meta: 'SUPPLIER',
    accessorFn: (row) => `${row.supplier || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex w-[180px] items-center">
          <span className="truncate">{row.original.supplier}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the item location.
   */
  {
    id: 'itemLoc',
    accessorFn: (row) => `${row.itemLoc || ''}`.trim(),
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('ITEM_LOCATION')} />,
    meta: 'ITEM_LOCATION',
    size: 180,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="truncate">{row.original.itemLoc}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the stock quantity of the item.
   */
  {
    id: 'stock',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STOCK')} />,
    meta: 'STOCK',
    accessorFn: (row) => `${row.stock ?? 0}`.trim(),
    size: 100,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
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
  /**
   * Column for displaying the last updated date of the inventory item.
   */
  {
    id: 'lastupdated',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('LAST_UPDATED')} />,
    meta: 'LAST_UPDATED',
    size: 180,
    accessorFn: (row) => (row.lastupdated ? format(new Date(row.lastupdated), 'yyyy-MM-dd') : ''),
    cell: ({ row }) => {
      const lastUpdated = row.original.lastupdated;

      const date = lastUpdated
        ? CustomtDateFormat(lastUpdated, {
            showTime: false,
          })
        : '-';

      return (
        <div className="flex items-center">
          <span className="truncate">{date}</span>
        </div>
      );
    },
    filterFn: (
      row: Row<InventoryData>,
      columnId: string,
      filterValue: { type?: string; date?: string; from?: string; to?: string }
    ) => {
      if (!filterValue) return true;

      const rowDate = String(row.getValue(columnId));

      if (typeof filterValue !== 'object' || filterValue === null) return true;

      const { type, date, from, to } = filterValue;
      const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : null;
      const formattedFrom = from ? format(new Date(from), 'yyyy-MM-dd') : null;
      const formattedTo = to ? format(new Date(to), 'yyyy-MM-dd') : null;
      const today = format(new Date(), 'yyyy-MM-dd');

      const filterStrategies: Record<string, () => boolean> = {
        today: () => rowDate === today,
        date: () => formattedDate !== null && rowDate === formattedDate,
        after: () => formattedDate !== null && rowDate > formattedDate,
        before: () => formattedDate !== null && rowDate < formattedDate,
        date_range: () =>
          formattedFrom !== null &&
          formattedTo !== null &&
          rowDate >= formattedFrom &&
          rowDate <= formattedTo,
        no_entry: () => rowDate === '',
      };

      return filterStrategies[type as keyof typeof filterStrategies]?.() ?? true;
    },
  },
  /**
   * Column for displaying the price of the item.
   */
  {
    id: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('PRICE')} />,
    meta: 'PRICE',
    size: 100,
    accessorFn: (row) => `${row.price || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="truncate">{row.original.price}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the status of the inventory item.
   */
  {
    id: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STATUS')} />,
    meta: 'STATUS',
    size: 100,
    accessorFn: (row) => `${row.status || ''}`.trim(),
    cell: ({ row }) => {
      const status: InventoryStatus =
        (row.original.status as InventoryStatus) || InventoryStatus.DISCONTINUED;

      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-md truncate text-${statusColors[status]}`}>
            {t(status.toUpperCase())}
          </span>
        </div>
      );
    },
  },
];
