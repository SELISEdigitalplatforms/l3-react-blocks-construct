import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'components/blocks/data-table/data-table';
import { useGetUsersQuery } from 'features/iam/hooks/use-iam';
import UserDetails from 'features/iam/components/user-details/user-details';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { useForgotPassword, useResendActivation } from 'features/auth/hooks/use-auth';
import { IamTableToolbar } from 'features/iam/components/iam-table/iam-table-toolbar';
import { createIamTableColumns } from 'features/iam/components/iam-table/iam-table-columns';
import { IamData } from 'features/iam/services/user-service';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

const IamTablePage: React.FC = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IamData | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isResendActivationModalOpen, setIsResendActivationModalOpen] = useState(false);
  const { mutateAsync: resetPassword } = useForgotPassword();
  const { mutateAsync: resendActivation } = useResendActivation();

  const [filters, setFilters] = useState({
    email: '',
    name: '',
  });

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: filters,
  };

  const { data, isLoading, error } = useGetUsersQuery(queryParams);

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    []
  );

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      setPaginationState((prev) => ({
        ...prev,
        totalCount: data.totalCount,
      }));
    }
  }, [data?.totalCount]);

  const handleSearch = useCallback((newFilters: { email: string; name: string }) => {
    setFilters(newFilters);
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, []);

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
      console.error('Failed to resend activation:', error);
    }
  };

  const handleViewDetails = (user: IamData) => {
    setSelectedUser(user);
    setOpenSheet(true);
  };

  const handleResetPassword = (user: IamData) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleResendActivation = (user: IamData) => {
    setSelectedUser(user);
    setIsResendActivationModalOpen(true);
  };

  const columns = createIamTableColumns({
    onViewDetails: handleViewDetails,
    onResetPassword: handleResetPassword,
    onResendActivation: handleResendActivation,
  });

  if (error) {
    return <div className="p-4 text-error">Error loading users: {error.error?.message}</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-full flex-col flex w-full gap-6 md:gap-8">
        <h2 className="text-2xl font-bold tracking-tight">Identity Access Management</h2>
        <DataTable
          data={data?.data || []}
          columns={columns}
          onRowClick={handleViewDetails}
          isLoading={isLoading}
          error={error}
          toolbar={(table) => <IamTableToolbar table={table} onSearch={handleSearch} />}
          pagination={{
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
            totalCount: paginationState.totalCount,
          }}
          onPaginationChange={handlePaginationChange}
          manualPagination={true}
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
