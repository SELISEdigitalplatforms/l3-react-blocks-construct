import { ColumnDef } from '@tanstack/react-table';
import { CustomtDateFormat } from 'lib/custom-date-formatter';
import { IFileData } from '../../hooks/use-mock-files-query';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { compareValues } from 'features/iam/services/user-service';
import { getFileTypeIcon, getFileTypeInfo } from '../../utils/file-manager';
import { Info, Users } from 'lucide-react';
import { FileTableRowActions } from '../file-manager-row-actions';
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

const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

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
    cell: ({ row }) => {
      const sharedBy = row.original.sharedBy;
      if (!sharedBy) {
        return (
          <div className="flex items-center">
            <span className="text-muted-foreground text-sm">-</span>
          </div>
        );
      }

      const getInitials = (name: string): string => {
        return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
      };

      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {sharedBy.avatar ? (
              <img
                src={sharedBy.avatar}
                alt={sharedBy.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-xs font-medium text-gray-600">${getInitials(sharedBy.name)}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">
                {getInitials(sharedBy.name)}
              </span>
            )}
          </div>
          <span className="text-sm truncate" title={sharedBy.name}>
            {sharedBy.name}
          </span>
        </div>
      );
    },
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
    cell: ({ row }) => {
      const date = row.original.sharedDate;
      if (!date) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex items-center">
          <span className="text-sm">{CustomtDateFormat(date)}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.sharedDate?.getTime() ?? 0;
      const b = rowB.original.sharedDate?.getTime() ?? 0;
      return compareValues(a, b);
    },
    filterFn: (row, id, value: DateRange) => {
      if (!value) return true;

      const rowDate = row.original.sharedDate;
      if (!rowDate) return false;

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
          <span className="text-sm">{CustomtDateFormat(date)}</span>
        </div>
      );
    },
    sortingFn: (row) => {
      const a = row.original.lastModified.getTime();
      const b = row.original.lastModified.getTime();
      return compareValues(a, b);
    },
    filterFn: (row, id, value: DateRange) => {
      if (!value) return true;

      const rowDate = row.original.lastModified;
      if (!rowDate) return false;

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
        <span className="text-muted-foreground text-sm">{row.original.size}</span>
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const parseSize = (size: string): number => {
        const regex = /^([\d.]+)\s*([KMGT]?B)$/i;
        const match = regex.exec(size);
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

        return value * (multipliers[unit] ?? 1);
      };

      const a = parseSize(rowA.original.size);
      const b = parseSize(rowB.original.size);
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
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        type="button"
      >
        <FileTableRowActions
          row={row}
          onViewDetails={onViewDetails}
          onDownload={onDownload}
          onShare={onShare}
          onDelete={onDelete}
          onMove={onMove}
          onRename={onRename}
        />
      </button>
    ),
  },
];
