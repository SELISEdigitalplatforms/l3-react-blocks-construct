import { ColumnDef } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/core';
import { DateCell } from '../../table-cells/date-cell';
import { createDateRangeFilter } from '@/modules/file-manager/utils/table-filters';
import { parseFileSize } from '@/modules/file-manager/utils/file-size';
import { NameCell } from '../../table-cells/name-cell';
import { SharedByCell } from '../../table-cells/shared-by-cell';
import { IFileData } from '../../../types/file-manager.type';
import { FileTableRowActions } from '../../file-manager-row-actions/file-manager-row-actions';
import { compareValues } from '../../../utils/file-manager';

interface ColumnFactoryProps {
  onViewDetails: (file: IFileData) => void;
  onDownload: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onOpen: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  t: (key: string) => string;
}

export const SharedFileTableColumns = ({
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onRename,
  t,
}: ColumnFactoryProps): ColumnDef<IFileData, any>[] => [
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
    filterFn: (row, id, value: string) => {
      if (!value) return true;
      const name = row.original.name.toLowerCase();
      return name.includes(value.toLowerCase());
    },
  },
  {
    id: 'sharedBy',
    accessorFn: (row) => row.sharedBy?.name ?? '',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SHARED_BY')} />,
    cell: ({ row }) => (
      <SharedByCell name={row.original.sharedBy?.name} avatar={row.original.sharedBy?.avatar} />
    ),
    filterFn: (row, id, value: string | string[]) => {
      if (!value) return true;

      const sharedBy = row.original.sharedBy;
      if (!sharedBy) return false;

      if (Array.isArray(value)) {
        if (value.length === 0) return true;
        return value.includes(sharedBy.id);
      } else {
        return sharedBy.name.toLowerCase().includes(value.toLowerCase()) ?? sharedBy.id === value;
      }
    },
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.sharedBy?.name ?? '';
      const nameB = rowB.original.sharedBy?.name ?? '';
      return nameA.localeCompare(nameB);
    },
  },
  {
    id: 'sharedDate',
    accessorFn: (row) => row.sharedDate,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SHARED_DATE')} />,
    cell: ({ row }) => <DateCell date={row.original.sharedDate} />,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.sharedDate?.getTime() ?? 0;
      const b = rowB.original.sharedDate?.getTime() ?? 0;
      return compareValues(a, b);
    },
    filterFn: createDateRangeFilter((row) => row.original.sharedDate),
  },
  {
    id: 'lastModified',
    accessorFn: (row) => row.lastModified,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('LAST_MODIFIED')} />,
    cell: ({ row }) => <DateCell date={row.original.lastModified} />,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.lastModified.getTime();
      const b = rowB.original.lastModified.getTime();
      return compareValues(a, b);
    },
    filterFn: createDateRangeFilter((row) => row.original.lastModified),
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
    sortingFn: (rowA, rowB) => {
      const a = parseFileSize(rowA.original.size);
      const b = parseFileSize(rowB.original.size);
      return compareValues(a, b);
    },
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
        <FileTableRowActions
          row={row}
          onViewDetails={onViewDetails}
          onDownload={onDownload}
          onShare={onShare}
          onDelete={onDelete}
          onRename={onRename}
          onCopy={onCopy}
          onMove={onMove}
        />
      </div>
    ),
  },
];
