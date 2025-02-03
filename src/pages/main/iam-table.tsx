/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import { DataTable } from 'components/blocks/data-table/data-table';
import { useGetUsersMutation } from 'features/Iam/hooks/use-iam';
import { ColumnDef } from '@tanstack/react-table';
import { IamData } from 'features/Iam/services/user-service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Button } from 'components/ui/button';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import UserDetails from 'features/Iam/components/user-details/user-details';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { useForgotPassword, useResendActivation } from 'features/auth/hooks/use-auth';

const IamTablePage: React.FC = () => {
  const [openSheet, setOpenSheet] = React.useState(false);
  const { mutate: getUsers, status, data, error } = useGetUsersMutation();

  const [selectedUser, setSelectedUser] = React.useState<IamData | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isResendActivationModalOpen, setIsResendActivationModalOpen] = useState(false);
  const { mutateAsync: resetPassword } = useForgotPassword();
  const { mutateAsync: resendActivation } = useResendActivation();

  const handleConfirmResetPassword = async () => {
    if (!selectedUser) return;

    try {
      await resetPassword({ email: selectedUser.email });
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const handleConfirmActivation = async () => {
    if (!selectedUser) return;

    try {
      await resendActivation({ userId: selectedUser.itemId });
      setIsResendActivationModalOpen(false);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const handleActivationLink = (user: IamData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    setIsResendActivationModalOpen(true);
  };

  const handleResetPassword = (user: IamData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleViewDetails = (user: IamData) => {
    setSelectedUser(user);
    setOpenSheet(true);
  };

  useEffect(() => {
    if (openSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openSheet]);

  const columns: ColumnDef<IamData>[] = [
    {
      id: 'fullName',
      accessorFn: (row) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,

      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'mfaEnabled',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent"
          >
            MFA
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
          </Button>
        );
      },
      cell: ({ row }) => <span>{row.original.mfaEnabled ? 'Enabled' : 'Disabled'}</span>,
    },
    {
      accessorKey: 'createdDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent"
          >
            Joined On
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => new Date(row.original.createdDate).toLocaleDateString(),
      sortingFn: (rowA, rowB) => {
        const a = new Date(rowA.original.createdDate).getTime();
        const b = new Date(rowB.original.createdDate).getTime();
        return a < b ? -1 : a > b ? 1 : 0;
      },
    },
    {
      accessorKey: 'lastLoggedInTime',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent"
          >
            Last log in
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => new Date(row.original.lastLoggedInTime).toLocaleString(),
      sortingFn: (rowA, rowB) => {
        const a = new Date(rowA.original.lastLoggedInTime).getTime();
        const b = new Date(rowB.original.lastLoggedInTime).getTime();
        return a < b ? -1 : a > b ? 1 : 0;
      },
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => (
        <span className={row.original.active ? 'text-success' : 'text-error'}>
          {row.original.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="text-medium-emphasis"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(row.original);
                }}
              >
                View details
              </DropdownMenuItem>

              {row.original.active ? (
                <>
                  <DropdownMenuItem onClick={(e) => handleResetPassword(row.original, e)}>
                    Reset password
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    disabled
                    className="text-error cursor-not-allowed opacity-50"
                  >
                    Deactivate user
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={(e) => handleActivationLink(row.original, e)}>
                  Resend activation link
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    handleFetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchUsers = () => {
    getUsers({
      page: 0,
      pageSize: 10,
    });
  };

  if (error) {
    return <div className="p-4 text-error">Error loading users: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-full flex-col space-y-8 flex w-full">
        <div className="flex w-full items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Identity Access Management</h2>
          </div>
        </div>

        <DataTable
          data={data?.data || []}
          columns={columns}
          onRowClick={handleViewDetails}
          isLoading={status === 'pending'}
          error={error}
        />
      </div>
      <UserDetails open={openSheet} onOpenChange={setOpenSheet} selectedUser={selectedUser} />
      <ConfirmationModal
        open={isResetPasswordModalOpen}
        onOpenChange={setIsResetPasswordModalOpen}
        title="Reset password for this user?"
        description={`Resetting the password for ${selectedUser?.firstName} ${selectedUser?.lastName} (${selectedUser?.email}) will send a password reset email to the user. Are you sure you want to proceed?`}
        onConfirm={handleConfirmResetPassword}
      />
      <ConfirmationModal
        open={isResendActivationModalOpen}
        onOpenChange={setIsResendActivationModalOpen}
        title="Activate this user?"
        description={`Activating the user ${selectedUser?.firstName} ${selectedUser?.lastName} (${selectedUser?.email}) will restore their access. Are you sure you want to proceed?`}
        onConfirm={handleConfirmActivation}
      />
    </div>
  );
};

export default IamTablePage;
