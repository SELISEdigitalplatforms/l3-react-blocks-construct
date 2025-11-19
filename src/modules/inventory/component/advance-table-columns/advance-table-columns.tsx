import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '@/components/core';
import { CustomtDateFormat } from '@/lib/utils/custom-date/custom-date';
import PlaceHolderImage from '@/assets/images/image_off_placeholder.webp';
import { InventoryStatus, InventoryItem } from '../../types/inventory.types';

/**
 * Creates column definitions for an advanced inventory table.
 * @returns {ColumnDef<InventoryItem>[]} An array of column definitions for the table.
 */
interface AdvanceTableColumnProps {
  t: (key: string) => string;
}

export const createAdvanceTableColumns = ({
  t,
}: AdvanceTableColumnProps): ColumnDef<InventoryItem>[] => [
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
    id: 'ItemName',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('ITEM_NAME')} />,
    meta: 'ITEM_NAME',
    enablePinning: true,
    accessorFn: (row) => `${row.ItemName || ''}`.trim(),
    size: 160,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center p-[2px] justify-center rounded-md cursor-pointer border w-10 h-10">
            <img
              src={row.original.ItemImageFileId || PlaceHolderImage}
              alt="item view"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = PlaceHolderImage;
              }}
            />
          </div>
          <span className="truncate font-medium">{row.original.ItemName}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the item category.
   */
  {
    id: 'Category',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('CATEGORY')} />,
    meta: 'CATEGORY',
    accessorFn: (row) => `${row.Category || ''}`.trim(),
    cell: ({ row }) => (
      <div className="flex items-center w-[180px]">
        <span className="truncate">{row.original.Category}</span>
      </div>
    ),
  },
  /**
   * Column for displaying the item's supplier.
   */
  {
    id: 'Supplier',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SUPPLIER')} />,
    meta: 'SUPPLIER',
    accessorFn: (row) => `${row.Supplier || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex w-[180px] items-center">
          <span className="truncate">{row.original.Supplier ? row.original.Supplier : '_'}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the item location.
   */
  {
    id: 'ItemLoc',
    accessorFn: (row) => `${row.ItemLoc || ''}`.trim(),
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('ITEM_LOCATION')} />,
    meta: 'ITEM_LOCATION',
    size: 180,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="truncate">{row.original.ItemLoc}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the stock quantity of the item.
   */
  {
    id: 'Stock',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STOCK')} />,
    meta: 'STOCK',
    accessorFn: (row) => `${row.Stock ?? 0}`.trim(),
    size: 100,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="truncate">{row.original.Stock}</span>
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
    id: 'LastUpdatedDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('LAST_UPDATED')} />,
    meta: 'LAST_UPDATED',
    accessorFn: (row) =>
      row.LastUpdatedDate ? format(new Date(row.LastUpdatedDate), 'yyyy-MM-dd') : '',
    cell: ({ row }) => {
      const lastUpdated = row.original.LastUpdatedDate;

      const date = lastUpdated
        ? CustomtDateFormat(lastUpdated, {
            showTime: false,
          })
        : '-';

      return (
        <div className="flex items-center min-w-[180px]">
          <span className="truncate">{date}</span>
        </div>
      );
    },
    filterFn: (
      row: Row<InventoryItem>,
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
    id: 'Price',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('PRICE')} />,
    meta: 'PRICE',
    accessorFn: (row) => `${row.Price || ''}`.trim(),
    cell: ({ row }) => {
      return (
        <div className="flex items-center min-w-[100px]">
          <span className="truncate">{row.original.Price}</span>
        </div>
      );
    },
  },
  /**
   * Column for displaying the status of the inventory item.
   */
  {
    id: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('STATUS')} />,
    meta: 'STATUS',
    size: 100,
    accessorFn: (row) => `${row.Status || ''}`.trim(),
    cell: ({ row }) => {
      const statusValue = String(row.original.Status || '').trim();

      const isActive = statusValue.toLowerCase() === InventoryStatus.ACTIVE.toLowerCase();

      const normalizedStatus = isActive ? InventoryStatus.ACTIVE : InventoryStatus.DISCONTINUED;

      const statusColorClass = isActive ? 'text-success' : 'text-low-emphasis';

      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-md truncate font-medium ${statusColorClass}`}>
            {t(normalizedStatus.toUpperCase())}
          </span>
        </div>
      );
    },
  },
];
