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
}: ColumnFactoryProps): ColumnDef<IamData>[] => [
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
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="max-w-[300px] truncate">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'mfaEnabled',
    header: ({ column }) => <DataTableColumnHeader column={column} title="MFA" />,
    cell: ({ row }) => {
      const mfaStatus = mfaStatuses.find((status) => status.value === row.original.mfaEnabled);

      if (!mfaStatus) return null;

      return <div className="flex items-center">{mfaStatus.label}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined On" />,
    cell: ({ row }) => {
      const date = new Date(row.original.createdDate);
      return (
        <div className="flex items-center">
          <span>{date.toLocaleDateString()}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.createdDate).getTime();
      const b = new Date(rowB.original.createdDate).getTime();
      return a < b ? -1 : a > b ? 1 : 0;
    },
  },
  {
    accessorKey: 'lastLoggedInTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
    cell: ({ row }) => {
      const date = new Date(row.original.lastLoggedInTime);
      if (date.getFullYear() === 1) {
        return <div className="text-muted-foreground">-</div>;
      }
      return (
        <div>
          <span>{date.toLocaleString()}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.lastLoggedInTime).getTime();
      const b = new Date(rowB.original.lastLoggedInTime).getTime();
      return a < b ? -1 : a > b ? 1 : 0;
    },
  },
  {
    accessorKey: 'active',
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
