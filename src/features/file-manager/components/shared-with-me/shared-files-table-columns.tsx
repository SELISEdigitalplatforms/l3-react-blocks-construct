import { ColumnDef } from '@tanstack/react-table';
import { CustomtDateFormat } from 'lib/custom-date-formatter';
import { IFileData } from '../../hooks/use-mock-files-query';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { compareValues } from 'features/iam/services/user-service';
import { getFileTypeIcon, getFileTypeInfo } from '../../utils/file-manager';
import { Users } from 'lucide-react';
import { FileTableRowActions } from '../my-files/my-files-row-actions';
import { DateRange } from 'react-day-picker';

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
  onRename,
  t,
}: ColumnFactoryProps): ColumnDef<IFileData, any>[] => [
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
    // Add name filtering
    filterFn: (row, id, value: string) => {
      if (!value) return true;
      const name = row.original.name.toLowerCase();
      return name.includes(value.toLowerCase());
    },
  },
  {
    id: 'fileType',
    accessorFn: (row) => row.fileType,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('FILE_TYPE')} />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="text-sm">{t(row.original.fileType.toUpperCase())}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      if (!value) return true;
      return row.original.fileType === value;
    },
  },
  {
    id: 'sharedBy',
    accessorFn: (row) => row.sharedBy?.name || '',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SHARED_BY')} />,
    cell: ({ row }) => {
      const sharedBy = row.original.sharedBy;
      if (!sharedBy) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {sharedBy.avatar ? (
              <img
                src={sharedBy.avatar}
                alt={sharedBy.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">
                {sharedBy.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-sm">{sharedBy.name}</span>
        </div>
      );
    },
    // Fixed filter function for sharedBy
    filterFn: (row, id, value: string[]) => {
      if (!value || value.length === 0) return true;
      const sharedById = row.original.sharedBy?.id;
      if (!sharedById) return false;
      return value.includes(sharedById);
    },
  },
  {
    id: 'sharedDate',
    accessorFn: (row) => row.sharedDate,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SHARED_DATE')} />,
    cell: ({ row }) => {
      const date = row.original.sharedDate;
      if (!date) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex items-center">
          <span>{CustomtDateFormat(date)}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.sharedDate?.getTime() || 0;
      const b = rowB.original.sharedDate?.getTime() || 0;
      return compareValues(a, b);
    },
    // Fixed date range filtering
    filterFn: (row, id, value: DateRange) => {
      if (!value) return true;

      const rowDate = row.original.sharedDate;
      if (!rowDate) return false;

      // Normalize dates for comparison (remove time component)
      const normalizeDate = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
      };

      const normalizedRowDate = normalizeDate(rowDate);

      if (value.from && !value.to) {
        const normalizedFrom = normalizeDate(value.from);
        return normalizedRowDate >= normalizedFrom;
      }

      if (!value.from && value.to) {
        const normalizedTo = normalizeDate(value.to);
        return normalizedRowDate <= normalizedTo;
      }

      if (value.from && value.to) {
        const normalizedFrom = normalizeDate(value.from);
        const normalizedTo = normalizeDate(value.to);
        return normalizedRowDate >= normalizedFrom && normalizedRowDate <= normalizedTo;
      }

      return true;
    },
  },
  {
    id: 'lastModified',
    accessorFn: (row) => row.lastModified,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('LAST_MODIFIED')} />,
    cell: ({ row }) => {
      const date = row.original.lastModified;

      return (
        <div className="flex items-center">
          <span>{CustomtDateFormat(date)}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.lastModified.getTime();
      const b = rowB.original.lastModified.getTime();
      return compareValues(a, b);
    },
    filterFn: (row, id, value: DateRange) => {
      if (!value) return true;

      const rowDate = row.original.lastModified;
      if (!rowDate) return false;

      // Normalize dates for comparison (remove time component)
      const normalizeDate = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
      };

      const normalizedRowDate = normalizeDate(rowDate);

      if (value.from && !value.to) {
        const normalizedFrom = normalizeDate(value.from);
        return normalizedRowDate >= normalizedFrom;
      }

      if (!value.from && value.to) {
        const normalizedTo = normalizeDate(value.to);
        return normalizedRowDate <= normalizedTo;
      }

      if (value.from && value.to) {
        const normalizedFrom = normalizeDate(value.from);
        const normalizedTo = normalizeDate(value.to);
        return normalizedRowDate >= normalizedFrom && normalizedRowDate <= normalizedTo;
      }

      return true;
    },
  },
  {
    id: 'size',
    accessorFn: (row) => row.size,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('SIZE')} />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-muted-foreground">{row.original.size}</span>
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const parseSize = (size: string): number => {
        const match = size.match(/^([\d.]+)\s*([KMGT]?B)$/i);
        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        const multipliers: { [key: string]: number } = {
          B: 1,
          KB: 1024,
          MB: 1024 * 1024,
          GB: 1024 * 1024 * 1024,
          TB: 1024 * 1024 * 1024 * 1024,
        };

        return value * (multipliers[unit] || 1);
      };

      const a = parseSize(rowA.original.size);
      const b = parseSize(rowB.original.size);
      return compareValues(a, b);
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
        <FileTableRowActions
          row={row}
          onViewDetails={onViewDetails}
          onDownload={onDownload}
          onShare={onShare}
          onDelete={onDelete}
          onMove={onMove}
          onRename={onRename}
        />
      </div>
    ),
  },
];
