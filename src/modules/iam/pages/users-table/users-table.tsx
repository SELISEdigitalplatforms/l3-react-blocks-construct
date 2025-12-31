import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { ConfirmationModal, DataTable } from '@/components/core';
import { useIsMobile } from '@/hooks/use-media-query';
import { Button } from '@/components/ui-kit/button';
import { Dialog, DialogTrigger } from '@/components/ui-kit/dialog';
import { useForgotPassword, useResendActivation } from '@/modules/auth/hooks/use-auth';
import { AddUser } from '../../components/add-profile/add-profile';
import { UserDetails } from '../../components/user-details/user-details';
import { IamData } from '../../types/user.types';
import IamTableToolbar from '../../components/iam-table/iam-table-toolbar';
import { useGetUsersQuery } from '../../hooks/use-iam';
import { createIamTableColumns } from '../../components/iam-table/iam-table-columns';
import { ExpandedUserDetails } from '../../components/user-details-mobile-view/expanded-user-details';
import { ProtectedFragment } from '@/state/store/auth/protected-fragment';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

/**
 * Table toolbar component for handling filters and search.
 */
const TableToolbar = ({
  table,
  onSearch,
  columns,
}: {
  table: Table<IamData>;
  onSearch: (filters: { email: string; name: string }) => void;
  columns: any[];
}) => {
  return <IamTableToolbar table={table} onSearch={onSearch} columns={columns} />;
};

/**
 * Main IAM (Identity Access Management) Table Page.
 * Renders user data in a table with search, pagination, row expansion, and modals.
 */
export const UsersTablePage = () => {
  const isMobile = useIsMobile();
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IamData | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isResendActivationModalOpen, setIsResendActivationModalOpen] = useState(false);
  const { mutateAsync: resetPassword } = useForgotPassword();
  const { mutateAsync: resendActivation } = useResendActivation();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { t } = useTranslation();

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

  // Fetch users based on query parameters
  const { data, isLoading, error } = useGetUsersQuery(queryParams);

  /**
   * Handles pagination changes.
   */
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

  /**
   * Updates total count when new data is available.
   */
  useEffect(() => {
    if (data?.totalCount !== undefined) {
      setPaginationState((prev) => ({
        ...prev,
        totalCount: data.totalCount,
      }));
    }
  }, [data?.totalCount]);

  /**
   * Handles search input changes and resets pagination.
   */
  const handleSearch = useCallback((newFilters: { email: string; name: string }) => {
    setFilters(newFilters);
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, []);

  /**
   * Confirms password reset for the selected user.
   */
  const handleConfirmResetPassword = async () => {
    if (!selectedUser) return;
    try {
      await resetPassword({
        email: selectedUser.email,
        projectKey: projectKey,
      });
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  /**
   * Confirms activation resend for the selected user.
   */
  const handleConfirmActivation = async () => {
    if (!selectedUser) return;
    try {
      await resendActivation({ userId: selectedUser.itemId });
      setIsResendActivationModalOpen(false);
    } catch (error) {
      console.error('Failed to resend activation:', error);
    }
  };

  /**
   * Opens the user details modal.
   */
  const handleViewDetails = (user: IamData) => {
    setSelectedUser(user);
    setOpenSheet(true);
  };

  /**
   * Disables scrolling when details modal is open.
   */
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

  /**
   * Opens reset password confirmation modal.
   */
  const handleResetPassword = (user: IamData) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  /**
   * Opens resend activation confirmation modal.
   */
  const handleResendActivation = (user: IamData) => {
    setSelectedUser(user);
    setIsResendActivationModalOpen(true);
  };

  // Define table columns with actions
  const columns = createIamTableColumns({
    onViewDetails: handleViewDetails,
    onResetPassword: handleResetPassword,
    onResendActivation: handleResendActivation,
    t,
  });

  // Show error message if data fetching fails
  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_USERS')}</div>;
  }

  /**
   * Renders expanded row content for mobile view.
   */
  const renderExpandedContent = (user: IamData) => (
    <ExpandedUserDetails
      user={user}
      onResetPassword={handleResetPassword}
      onResendActivation={handleResendActivation}
    />
  );

  /**
   * Renders table filter toolbar.
   */
  const renderFilterToolbar = (table: Table<IamData>) => (
    <TableToolbar table={table} onSearch={handleSearch} columns={columns} />
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-full flex-col flex w-full gap-6 md:gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">{t('IDENTITY_ACCESS_MANAGEMENT')}</h2>

          <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
            <ProtectedFragment roles={['admin']}>
              <DialogTrigger asChild>
                <Button variant="default" className="flex items-center">
                  <Plus size={20} />
                  {t('ADD_USER')}
                </Button>
              </DialogTrigger>
            </ProtectedFragment>
            {isAddUserModalOpen && <AddUser onClose={() => setIsAddUserModalOpen(false)} />}
          </Dialog>
        </div>
        <DataTable
          data={data?.data || []}
          columns={columns}
          onRowClick={handleViewDetails}
          isLoading={isLoading}
          error={error}
          toolbar={(table) => renderFilterToolbar(table)}
          pagination={{
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
            totalCount: paginationState.totalCount,
          }}
          onPaginationChange={handlePaginationChange}
          manualPagination={true}
          expandedContent={renderExpandedContent}
          mobileColumns={['fullName']}
          expandable={true}
        />
      </div>

      {!isMobile && (
        <UserDetails open={openSheet} onOpenChange={setOpenSheet} selectedUser={selectedUser} />
      )}

      <ConfirmationModal
        open={isResetPasswordModalOpen}
        onOpenChange={setIsResetPasswordModalOpen}
        title={t('RESET_PASSWORD_FOR_USER')}
        description={t('PASSWORD_RESET_SENT_EMAIL')}
        onConfirm={handleConfirmResetPassword}
      />

      <ConfirmationModal
        open={isResendActivationModalOpen}
        onOpenChange={setIsResendActivationModalOpen}
        title={t('ACTIVATE_THIS_USER')}
        description={t('USER_ACTIVATION_RESTORED')}
        onConfirm={handleConfirmActivation}
      />
    </div>
  );
};
