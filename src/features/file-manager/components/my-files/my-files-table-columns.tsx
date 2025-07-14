import { ColumnDef } from '@tanstack/react-table';
import { CustomtDateFormat } from 'lib/custom-date-formatter';
import { IFileData } from '../../hooks/use-mock-files-query';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { compareValues } from 'features/iam/services/user-service';
import { FileTableRowActions } from '../file-manager-row-actions';
import {
  getFileTypeIcon,
  getFileTypeInfo,
  getFileTypeOptions,
  IFileDataWithSharing,
} from '../../utils/file-manager';
import { Info, Users } from 'lucide-react';

/**
 * Creates the columns for the File Management table.
 *
 * This function generates the column configuration for a table displaying file data,
 * including file details like name, type, size, last modified date, sharing status, and actions.
 *
 * Features:
 * - Displays file information with sorting and filtering capabilities
 * - Supports custom actions such as viewing details, downloading, sharing, and deleting
 * - Filters by file type and date range for last modified dates
 * - Displays file types with appropriate icons
 * - Shows sharing status with visual indicators
 *
 * @param {ColumnFactoryProps} props - The props for configuring the table columns
 * @param {function} props.onViewDetails - Callback function triggered when the "View Details" action is clicked
 * @param {function} props.onDownload - Callback function triggered when the "Download" action is clicked
 * @param {function} [props.onShare] - Optional callback function triggered when the "Share" action is clicked
 * @param {function} [props.onDelete] - Optional callback function triggered when the "Delete" action is clicked
 * @param {function} props.t - Translation function for internationalization
 *
 * @returns {ColumnDef<IFileData, any>[]} - An array of column definitions for the file table
 *
 * @example
 * const columns = createFileTableColumns({
 *   onViewDetails: (file) => console.log(file),
 *   onDownload: (file) => console.log('Downloading:', file),
 *   onShare: (file) => console.log('Sharing:', file),
 *   onDelete: (file) => console.log('Deleting:', file),
 *   t: (key) => key,
 * });
 */

interface ColumnFactoryProps {
  onViewDetails: (file: IFileData) => void;
  onDownload: (file: IFileData) => void;

  onRename: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  t: (key: string) => string;
}

export const createFileTableColumns = ({
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onRename,
  t,
}: ColumnFactoryProps): ColumnDef<IFileDataWithSharing, any>[] => [
  {
    id: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('NAME')} />,
    accessorFn: (row) => row.name,
    cell: ({ row }) => {
      const IconComponent = getFileTypeIcon(row.original.fileType);
      const { iconColor, backgroundColor } = getFileTypeInfo(row.original.fileType);
      const isShared =
        row.original.isShared || (row.original.sharedWith && row.original.sharedWith.length > 0);
      return (
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${backgroundColor}`}>
            <IconComponent className={`w-4 h-4 ${iconColor}`} />
          </div>
          <span className="max-w-[300px] truncate font-medium">{row.original.name}</span>
          {isShared && (
            <span title={t('SHARED')}>
              <Users className="h-4 w-4 text-low-emphasis" />
            </span>
          )}
        </div>
      );
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
    filterFn: (row, id, value) => {
      if (!value) return true;

      const rowDate = row.original.lastModified;

      if (value.from && !value.to) {
        return rowDate >= value.from;
      }

      if (!value.from && value.to) {
        return rowDate <= value.to;
      }

      if (value.from && value.to) {
        return rowDate >= value.from && rowDate <= value.to;
      }

      return true;
    },
  },
  {
    id: 'fileType',
    accessorFn: (row) => row.fileType,
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('TYPE')} />,
    cell: ({ row }) => {
      const fileTypeOption = getFileTypeOptions(t).find(
        (option) => option.value === row.original.fileType
      );
      if (!fileTypeOption) return null;

      return (
        <div className="flex items-center gap-2">
          <span>{fileTypeOption.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (value.length === 0) return true;
      const cellValue = row.getValue(id);
      return value.includes(String(cellValue));
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

        return value * (multipliers[unit] || 1);
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
          onRename={onRename}
        />
      </button>
    ),
  },
];
