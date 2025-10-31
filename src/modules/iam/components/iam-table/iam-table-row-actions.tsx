import React, { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { Dialog } from '@/components/ui-kit/dialog';
import { IamData } from '../../types/user.types';
import { EditIamProfileDetails } from '@/modules/profile/components/modals/edit-iam-profile-details/edit-iam-profile-details';

/**
 * Renders the actions for a row in the IAM (Identity and Access Management) table.
 *
 * This component provides a dropdown menu with actions that can be performed on a user,
 * such as viewing details, editing the profile, resetting the password, deactivating the user,
 * or resending an activation link if the user is inactive.
 *
 * Features:
 * - Displays a dropdown with context-sensitive actions based on the user's status
 * - Allows opening an "Edit Profile" modal for user details editing
 * - Supports password reset, viewing user details, and resending activation links
 * - Prevents deactivating an already inactive user (disabled action)
 *
 * @param {DataTableRowActionsProps} props - The props for configuring the row actions
 * @param {Row<IamData>} props.row - The row data for the user, containing user information
 * @param {function} props.onViewDetails - Callback function triggered when the "View Details" action is clicked
 * @param {function} props.onResetPassword - Callback function triggered when the "Reset Password" action is clicked
 * @param {function} [props.onResendActivation] - Optional callback function triggered when the "Resend Activation" action is clicked
 *
 * @example
 * <DataTableRowActions
 *   row={userRow}
 *   onViewDetails={(user) => console.log('Viewing details for:', user)}
 *   onResetPassword={(user) => console.log('Resetting password for:', user)}
 *   onResendActivation={(user) => console.log('Resending activation for:', user)}
 * />
 */

interface DataTableRowActionsProps {
  row: Row<IamData>;
  onViewDetails: (user: IamData) => void;
  onResetPassword: (user: IamData) => void;
  onResendActivation?: (user: IamData) => void;
}

export function DataTableRowActions({
  row,
  onViewDetails,
  onResetPassword,
  onResendActivation,
}: Readonly<DataTableRowActionsProps>) {
  const { t } = useTranslation();
  const user = row.original;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleItemClick = (action: (user: IamData) => void, e: React.MouseEvent) => {
    e.stopPropagation();
    action(user);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => handleItemClick(onViewDetails, e)}>
            {t('VIEW_DETAILS')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditClick}>{t('EDIT_PROFILE')}</DropdownMenuItem>
          {user.active ? (
            <>
              <DropdownMenuItem onClick={(e) => handleItemClick(onResetPassword, e)}>
                {t('RESET_PASSWORD')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                disabled
                className="text-error cursor-not-allowed opacity-50"
              >
                {t('DEACTIVATE_USER')}
              </DropdownMenuItem>
            </>
          ) : (
            onResendActivation && (
              <DropdownMenuItem onClick={(e) => handleItemClick(onResendActivation, e)}>
                {t('RESEND_ACTIVATION_LINK')}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {isEditModalOpen && (
          <EditIamProfileDetails
            userInfo={{
              ...user,
              lastName: user.lastName ?? '',
              profileImageUrl: user.profileImageUrl ?? '',
            }}
            onClose={handleEditModalClose}
          />
        )}
      </Dialog>
    </>
  );
}
