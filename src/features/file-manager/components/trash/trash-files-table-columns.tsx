/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { getFileTypeIcon, getFileTypeInfo, IFileTrashData } from '../../utils/file-manager';
import { Info, Users } from 'lucide-react';
import { CustomtDateFormat } from 'lib/custom-date-formatter';
import { TrashTableRowActions } from './trash-files-row-actions';

interface ColumnFactoryProps {
  onRestore: (file: IFileTrashData) => void;
  onDelete: (file: IFileTrashData) => void;
  t: (key: string) => string;
}

export const TrashTableColumns = ({
  onRestore,
  onDelete,
  t,
}: ColumnFactoryProps): ColumnDef<IFileTrashData, any>[] => [
  {
    id: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('NAME')} />,
    accessorFn: (row) => row.name,
    cell: ({ row }) => {
      const IconComponent = getFileTypeIcon(row.original.fileType);
      const { iconColor, backgroundColor } = getFileTypeInfo(row.original.fileType);
      return (
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${backgroundColor}`}>
            <IconComponent className={`w-4 h-4 ${iconColor}`} />
          </div>
          <span className="max-w-[300px] truncate font-medium">{row.original.name}</span>
          {row.original.isShared && (
            <span title={t('SHARED')}>
              <Users className="h-4 w-4 text-low-emphasis" />
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: 'deletedDate',
    accessorFn: (row) => row.trashedDate,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DELETED_DATE')} />,
    cell: ({ row }) => {
      const date = row.original.trashedDate;
      return (
        <div className="flex items-center">
          <span className="text-sm">{CustomtDateFormat(date)}</span>
        </div>
      );
    },
  },
  {
    id: 'fileType',
    accessorFn: (row) => row.fileType,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('FILE_TYPE')} />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-sm">{row.original.fileType}</span>
      </div>
    ),
  },
  {
    id: 'size',
    accessorFn: (row) => row.size,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SIZE')} />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-muted-foreground text-sm">{row.original.size}</span>
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => (
      <div className="flex justify-end text-primary">
        <Info />
      </div>
    ),
    cell: ({ row }) => (
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        type="button"
      >
        <TrashTableRowActions row={row} onRestore={onRestore} onDelete={onDelete} />
      </button>
    ),
  },
];
