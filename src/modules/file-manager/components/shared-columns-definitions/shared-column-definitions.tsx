import { ColumnDef } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/core';
import { DateCell } from '../table-cells/date-cell';
import { NameCell } from '../table-cells/name-cell';
import { SharedByCell } from '../table-cells/shared-by-cell';
import { createDateRangeFilter } from '../../utils/table-filters';
import { parseFileSize } from '../../utils/file-size';
import { compareValues } from '../../utils/file-manager';
import { FileType } from '../../types/file-manager.type';

/**
 * Shared column definitions for file manager tables
 * Reduces code duplication across my-files, shared-with-me, and trash tables
 */

// ============================================================================
// COLUMN FACTORY FUNCTIONS
// ============================================================================

/**
 * Creates a name column definition
 */
export const createNameColumn = <T extends { name: string; fileType: FileType; isShared?: boolean }>(
  t: (key: string) => string,
  options?: {
    filterFn?: (row: any, id: string, value: string) => boolean;
  }
): ColumnDef<T, any> => ({
  id: 'name',
  header: ({ column }) => <DataTableColumnHeader column={column} title={t('NAME')} />,
  accessorFn: (row) => row.name,
  cell: ({ row }) => (
    <NameCell
      name={row.original.name}
      fileType={row.original.fileType}
      isShared={row.original.isShared ?? false}
      t={t}
    />
  ),
  filterFn: options?.filterFn,
});

/**
 * Creates a date column definition with sorting and filtering
 */
export const createDateColumn = <T extends Record<string, any>>(
  id: string,
  headerKey: string,
  accessor: (row: T) => Date | undefined,
  t: (key: string) => string
): ColumnDef<T, any> => ({
  id,
  accessorFn: accessor,
  header: ({ column }) => <DataTableColumnHeader column={column} title={t(headerKey)} />,
  cell: ({ row }) => <DateCell date={accessor(row.original)} />,
  sortingFn: (rowA, rowB) => {
    const a = accessor(rowA.original)?.getTime() ?? 0;
    const b = accessor(rowB.original)?.getTime() ?? 0;
    return compareValues(a, b);
  },
  filterFn: createDateRangeFilter(accessor),
});

/**
 * Creates a size column definition with sorting
 */
export const createSizeColumn = <T extends { size: string }>(
  t: (key: string) => string,
  options?: {
    className?: string;
  }
): ColumnDef<T, any> => ({
  id: 'size',
  accessorFn: (row) => row.size,
  header: ({ column }) => <DataTableColumnHeader column={column} title={t('SIZE')} />,
  cell: ({ row }) => (
    <div className="flex items-center">
      <span className={options?.className ?? 'text-muted-foreground text-sm'}>
        {row.original.size}
      </span>
    </div>
  ),
  sortingFn: (rowA, rowB) => {
    const a = parseFileSize(rowA.original.size);
    const b = parseFileSize(rowB.original.size);
    return compareValues(a, b);
  },
});

/**
 * Creates a shared-by column definition
 */
export const createSharedByColumn = <
  T extends { sharedBy?: { id: string; name?: string; avatar?: string } }
>(
  t: (key: string) => string
): ColumnDef<T, any> => ({
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
      return sharedBy.name?.toLowerCase().includes(value.toLowerCase()) ?? sharedBy.id === value;
    }
  },
  sortingFn: (rowA, rowB) => {
    const nameA = rowA.original.sharedBy?.name ?? '';
    const nameB = rowB.original.sharedBy?.name ?? '';
    return nameA.localeCompare(nameB);
  },
});

/**
 * Creates an actions column definition with Info icon header
 */
export const createActionsColumn = <T extends Record<string, any>>(
  renderActions: (row: any) => React.ReactNode
): ColumnDef<T, any> => ({
  id: 'actions',
  header: () => (
    <div className="flex justify-end text-primary">
      <Info />
    </div>
  ),
  cell: ({ row }) => <div className="flex justify-end">{renderActions(row)}</div>,
});

// ============================================================================
// COMMON COLUMN CONFIGURATIONS
// ============================================================================

/**
 * Common configuration for lastModified column
 */
export const createLastModifiedColumn = <T extends { lastModified: Date }>(
  t: (key: string) => string
): ColumnDef<T, any> => createDateColumn('lastModified', 'LAST_MODIFIED', (row) => row.lastModified, t);

/**
 * Common configuration for sharedDate column
 */
export const createSharedDateColumn = <T extends { sharedDate?: Date }>(
  t: (key: string) => string
): ColumnDef<T, any> => createDateColumn('sharedDate', 'SHARED_DATE', (row) => row.sharedDate, t);
