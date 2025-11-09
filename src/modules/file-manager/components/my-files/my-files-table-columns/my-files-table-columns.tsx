import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/core';
import { compareValues } from '@/modules/iam/services/user-service';
import { FileTableRowActions } from '../../file-manager-row-actions/file-manager-row-actions';
import {
  getFileTypeOptions,
  IFileDataWithSharing,
} from '@/modules/file-manager/utils/file-manager';
import { Info } from 'lucide-react';
import { DateCell } from '@/modules/file-manager/components/table-cells/date-cell';
import { createDateRangeFilter } from '@/modules/file-manager/utils/table-filters';
import { parseFileSize } from '@/modules/file-manager/utils/file-size';
import { NameCell } from '@/modules/file-manager/components/table-cells/name-cell';

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
  onViewDetails: (file: IFileDataWithSharing) => void;
  onDownload: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;

  onRename: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  t: (key: string) => string;
}

export const createFileTableColumns = ({
  onViewDetails,
  onDownload,
  onShare,
  onDelete,
  onRename,
  onCopy,
  onMove,
  t,
}: ColumnFactoryProps): ColumnDef<IFileDataWithSharing, any>[] => [
  {
    id: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('NAME')} />,
    accessorFn: (row) => row.name,
    cell: ({ row }) => (
      <NameCell
        name={row.original.name}
        fileType={row.original.fileType}
        isShared={Boolean(
          row.original.isShared || (row.original.sharedWith && row.original.sharedWith.length > 0)
        )}
        t={t}
      />
    ),
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
