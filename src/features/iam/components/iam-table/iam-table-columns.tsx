/* eslint-disable @typescript-eslint/no-explicit-any */

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from 'components/ui/badge';
import { DataTableColumnHeader } from 'components/blocks/data-table/data-table-column-header';
import { IamData } from '../../services/user-service';
import { DataTableRowActions } from './iam-table-row-actions';

const userStatuses = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
];

const mfaStatuses = [
  { value: true, label: 'Enabled', color: 'success' },
  { value: false, label: 'Disabled', color: 'error' },
];

interface ColumnFactoryProps {
  onViewDetails: (user: IamData) => void;
  onResetPassword: (user: IamData) => void;
  onResendActivation?: (user: IamData) => void;
}

export const createIamTableColumns = ({
  onViewDetails,
  onResetPassword,
  onResendActivation,
}: ColumnFactoryProps): ColumnDef<IamData, any>[] => [
  {
    id: 'fullName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    accessorFn: (row) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
    cell: ({ row }) => {
      const fullName = `${row.original.firstName} ${row.original.lastName}`.trim();
      return (
        <div className="flex items-center">
          <span className="max-w-[300px] truncate font-medium">{fullName}</span>
        </div>
      );
    },
  },
  {
    id: 'email',
    accessorFn: (row) => row.email,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="max-w-[300px] truncate">{row.original.email}</span>
      </div>
    ),
  },
  {
    id: 'mfaEnabled',
    accessorFn: (row) => row.mfaEnabled,
    header: ({ column }) => <DataTableColumnHeader column={column} title="MFA" />,
    cell: ({ row }) => {
      const mfaStatus = mfaStatuses.find((status) => status.value === row.original.mfaEnabled);
      if (!mfaStatus) return null;
      return <div className="flex items-center">{mfaStatus.label}</div>;
    },
    filterFn: (row, id, value: string[]) => {
      if (value.length === 0) return true;
      const cellValue = row.getValue(id) as boolean;
      return value.includes(String(cellValue));
    },
  },
  {
    id: 'createdDate',
    accessorFn: (row) => row.createdDate,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined On" />,
    cell: ({ row }) => {
      const date = new Date(row.original.createdDate);
      return (
        <div className="flex items-center">
          <span>
            {new Date(date)
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              .split('/')
              .join('/')}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.createdDate).getTime();
      const b = new Date(rowB.original.createdDate).getTime();
      return a < b ? -1 : a > b ? 1 : 0;
    },
    filterFn: (row, id, value) => {
      if (!value?.from || !value?.to) return true;
      const rowDate = new Date(row.getValue(id));
      return rowDate >= value.from && rowDate <= value.to;
    },
  },
  {
    id: 'lastLoggedInTime',
    accessorFn: (row) => row.lastLoggedInTime,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
    cell: ({ row }) => {
      const date = new Date(row.original.lastLoggedInTime);
      if (date.getFullYear() === 1) {
        return <div className="text-muted-foreground">-</div>;
      }
      return (
        <div>
          <span>
            {new Date(date)
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              .split('/')
              .join('/')}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.lastLoggedInTime).getTime();
      const b = new Date(rowB.original.lastLoggedInTime).getTime();
      return a < b ? -1 : a > b ? 1 : 0;
    },
    filterFn: (row, id, value) => {
      if (!value?.from || !value?.to) return true;
      const rowDate = new Date(row.getValue(id));
      return rowDate >= value.from && rowDate <= value.to;
    },
  },
  {
    id: 'active',
    accessorFn: (row) => row.active,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = userStatuses.find(
        (status) => status.value === (row.original.active ? 'active' : 'inactive')
      );
      if (!status) return null;
      return (
        <div className="flex items-center">
          <Badge
            variant="outline"
            className={status.color === 'success' ? 'text-success' : 'text-error'}
          >
            {status.label}
          </Badge>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);

      if (b === a) return 0;
      return a ? -1 : 1;
    },
    filterFn: (row, id, value: string[]) => {
      if (value.length === 0) return true;
      const cellValue = row.getValue(id) as boolean;
      return value.includes(String(cellValue));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onViewDetails={onViewDetails}
        onResetPassword={onResetPassword}
        onResendActivation={onResendActivation}
      />
    ),
  },
];
