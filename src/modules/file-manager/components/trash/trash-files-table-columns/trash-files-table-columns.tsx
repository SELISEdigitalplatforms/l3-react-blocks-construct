/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColumnDef } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/core';
import { IFileTrashData } from '../../../utils/file-manager';
import { NameCell } from '../../table-cells/name-cell';
import { DateCell } from '../../table-cells/date-cell';
import { TrashTableRowActions } from '../trash-files-row-actions/trash-files-row-actions';

interface ColumnFactoryProps {
  onViewDetails?: (file: IFileTrashData) => void;
  onRestore: (file: IFileTrashData) => void;
  onDelete: (file: IFileTrashData) => void;
  t: (key: string) => string;
}

export const TrashTableColumns = ({
  onViewDetails,
  onRestore,
  onDelete,
  t,
}: ColumnFactoryProps): ColumnDef<IFileTrashData, any>[] => [
  {
    id: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('NAME')} />,
    accessorFn: (row) => row.name,
    cell: ({ row }) => (
      <NameCell
        name={row.original.name}
        fileType={row.original.fileType}
        isShared={row.original.isShared}
        t={t}
      />
    ),
  },
  {
    id: 'deletedDate',
    accessorFn: (row) => row.trashedDate,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('DELETED_DATE')} />,
    cell: ({ row }) => <DateCell date={row.original.trashedDate as unknown as Date} />,
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
      <div className="flex justify-end">
        <TrashTableRowActions
          row={row}
          onRestore={onRestore}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      </div>
    ),
  },
];
