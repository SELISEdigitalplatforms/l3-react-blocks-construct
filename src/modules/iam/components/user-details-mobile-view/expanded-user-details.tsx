/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { IamData } from '../../types/user.types';
import { EditIamProfileDetails } from '@/modules/profile/components/modals/edit-iam-profile-details/edit-iam-profile-details';

/**
 * Displays detailed information about a user with options to reset their password, resend the activation link,
 * or edit their profile details.
 *
 * Features:
 * - Displays the user's email, phone number, roles, join date, last login time, status, and MFA settings.
 * - Allows the user to reset the password (if active) or resend the activation link (if inactive).
 * - Provides a button to edit the user's profile.
 *
 * @param {ExpandedUserDetailsProps} props - The props for the expanded user details component.
 * @param {IamData} props.user - The user object containing the detailed information to display.
 * @param {(user: IamData) => void} props.onResetPassword - A callback function to handle the reset password action.
 * @param {(user: IamData) => void} props.onResendActivation - A callback function to handle the resend activation link action.
 *
 * @example
 * <ExpandedUserDetails
 *   user={selectedUser}
 *   onResetPassword={handleResetPassword}
 *   onResendActivation={handleResendActivation}
 * />
 */

interface ExpandedUserDetailsProps {
  user: IamData;
  onResetPassword: (user: IamData) => void;
  onResendActivation: (user: IamData) => void;
}

export const ExpandedUserDetails = ({
  user,
  onResetPassword,
}: Readonly<ExpandedUserDetailsProps>) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const formatLastLoginTime = (lastLoggedInTime: string | Date | null | undefined) => {
    if (!lastLoggedInTime) {
      return '-';
    }

    const date = new Date(lastLoggedInTime);

    if (date.getFullYear() === 1) {
      return '-';
    }

    try {
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '-';
    }
  };
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-medium-emphasis">{t('EMAIL')}</h3>
          <p className="text-sm text-high-emphasis">{user.email}</p>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('MOBILE_NO')}</h3>
            <p className="text-sm text-high-emphasis">{user.phoneNumber ?? '-'}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('IAM_ROLES')}</h3>
            <p className="text-sm text-high-emphasis first-letter:uppercase">
              {user.roles && user.roles.length > 0 ? user.roles.join(', ') : '-'}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('JOINED_ON')}</h3>
            <p className="text-sm text-high-emphasis">
              {new Date(user.createdDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('LAST_LOGIN')}</h3>
            <div className="text-sm text-high-emphasis">
              {user.lastLoggedInTime && new Date(user.lastLoggedInTime).getFullYear() !== 1 ? (
                formatLastLoginTime(user.lastLoggedInTime)
              ) : (
                <div className="text-muted-foreground">-</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <h3 className="text-sm  text-medium-emphasis">{t('STATUS')}</h3>
            <h3 className={user.active ? 'text-success ' : 'text-error'}>
              {user.active ? t('ACTIVE') : t('DEACTIVATED')}
            </h3>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('MFA')}</h3>
            <p className="text-sm text-high-emphasis">
              {user.mfaEnabled ? t('ENABLED') : t('DISABLED')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button size="sm" className="w-full" onClick={handleEditClick}>
          {t('EDIT')}
        </Button>
        <div className="flex w-full flex-row gap-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onResetPassword(user)}
          >
            {user?.active ? t('RESET_PASSWORD') : t('RESEND_ACTIVATION_LINK')}
          </Button>
          {user?.active && (
            <Button
              variant="outline"
              size="sm"
              className="w-full disabled cursor-not-allowed opacity-50 text-error hover:text-error hover:opacity-50"
              onClick={() => {}}
            >
              {t('DEACTIVATE_USER')}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {user && <EditIamProfileDetails userInfo={user} onClose={handleCloseEditModal} />}
      </Dialog>
    </div>
  );
};
