/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui-kit/sheet';
import { Button } from '@/components/ui-kit/button';
import { ConfirmationModal } from '@/components/core';
import { Calendar, Clock, Mail, Phone, Shield, User } from 'lucide-react';
import { Separator } from '@/components/ui-kit/separator';
import { useForgotPassword, useResendActivation } from '@/modules/auth/hooks/use-auth';
import DummyProfile from '@/assets/images/dummy_profile.png';
import API_CONFIG from '@/config/api';
import { Dialog } from '@/components/ui-kit/dialog';
import { UserDetailItem } from './user-details-item';
import { IamData } from '../../types/user.types';
import { EditIamProfileDetails } from '@/modules/profile/components/modals/edit-iam-profile-details/edit-iam-profile-details';

/**
 * Displays detailed information about a selected user in a sheet modal.
 * Provides options to edit user details, reset the user's password, or resend the activation link if the user is inactive.
 *
 * Features:
 * - Displays the user's profile, including their roles, phone number, email, MFA status, and more.
 * - Allows resetting the password for active users and resending the activation link for inactive users.
 * - Enables editing the user's profile.
 * - Includes confirmation modals for sensitive actions like resetting the password or activating the user.
 *
 * @param {UserDetailsSheetProps} props - The props for configuring the user details sheet.
 * @param {boolean} props.open - Boolean indicating whether the sheet modal is open or closed.
 * @param {function} props.onOpenChange - Callback function to toggle the sheet modal open/closed.
 * @param {IamData | null} props.selectedUser - The currently selected user whose details are displayed.
 *
 * @example
 * <UserDetails
 *   open={isSheetOpen}
 *   onOpenChange={setIsSheetOpen}
 *   selectedUser={selectedUser}
 * />
 */
interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: IamData | null;
}

type ModalType = 'resetPassword' | 'resendActivation' | 'edit' | null;

export const UserDetails = ({
  open,
  onOpenChange,
  selectedUser,
}: Readonly<UserDetailsSheetProps>) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { mutateAsync: resetPassword } = useForgotPassword();
  const { mutateAsync: resendActivation } = useResendActivation();
  const { t } = useTranslation();

  const isModalOpen = (modalType: ModalType) => activeModal === modalType;

  const closeModal = () => setActiveModal(null);

  const handleApiOperation = async (operation: () => Promise<any>) => {
    if (!selectedUser) return;

    try {
      await operation();
      closeModal();
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleConfirmResetPassword = () => {
    if (!selectedUser) return;
    handleApiOperation(() =>
      resetPassword({
        email: selectedUser.email,
        projectKey: API_CONFIG.blocksKey,
      })
    );
  };

  const handleConfirmActivation = () => {
    if (!selectedUser) return;
    handleApiOperation(() => resendActivation({ userId: selectedUser.itemId }));
  };

  const handlePrimaryAction = () => {
    if (!selectedUser) return;

    const modalType = selectedUser.active ? 'resetPassword' : 'resendActivation';
    setActiveModal(modalType);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent className="flex flex-col h-screen sm:h-[calc(100dvh-48px)] justify-between w-full sm:min-w-[450px] md:min-w-[450px] lg:min-w-[450px] sm:fixed sm:top-[57px]">
          <div className="flex flex-col">
            <SheetHeader className="hidden">
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative overflow-hidden rounded-full border shadow-sm border-white h-16 w-16">
                  <img
                    src={selectedUser?.profileImageUrl || DummyProfile}
                    alt="profile"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedUser?.firstName} {selectedUser?.lastName}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedUser?.active ? 'bg-success' : 'bg-error'
                      }`}
                    />
                    <span
                      className={`text-sm ${selectedUser?.active ? 'text-success' : 'text-error'}`}
                    >
                      {selectedUser?.active ? t('ACTIVE') : t('INACTIVE')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="mb-6" />
            {selectedUser && (
              <div className="space-y-6">
                <UserDetailItem
                  label={t('IAM_ROLES')}
                  icon={User}
                  value={
                    selectedUser.roles && selectedUser.roles.length > 0
                      ? selectedUser.roles.join(', ')
                      : '-'
                  }
                />
                <UserDetailItem
                  label={t('MOBILE_NO')}
                  icon={Phone}
                  value={selectedUser.phoneNumber ?? 'Not provided'}
                />
                <div className="flex items-start space-x-4">
                  <div className="text-base font-thin text-medium-emphasis w-24">{t('EMAIL')}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-high-emphasis shrink-0" />
                      <div className="text-base font-normal text-high-emphasis break-words">
                        {selectedUser.email}
                      </div>
                    </div>
                  </div>
                </div>
                <UserDetailItem
                  label={t('JOINED_ON')}
                  icon={Calendar}
                  value={new Date(selectedUser.createdDate).toLocaleString()}
                />
                <UserDetailItem
                  label={t('LAST_LOGIN')}
                  icon={Clock}
                  value={new Date(selectedUser.lastLoggedInTime).toLocaleString()}
                />
                <UserDetailItem
                  label={t('MFA')}
                  icon={Shield}
                  value={selectedUser.mfaEnabled ? t('ENABLED') : t('DISABLED')}
                />
              </div>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button size="default" className="w-full h-9" onClick={() => setActiveModal('edit')}>
              {t('EDIT')}
            </Button>
            <div className="flex w-full flex-col sm:flex-row gap-4">
              <Button variant="outline" className="w-full" onClick={handlePrimaryAction}>
                {selectedUser?.active ? t('RESET_PASSWORD') : t('RESEND_ACTIVATION_LINK')}
              </Button>
              {selectedUser?.active && (
                <Button
                  variant="outline"
                  className="w-full disabled cursor-not-allowed opacity-50 text-error hover:text-error hover:opacity-50"
                  onClick={() => {}}
                >
                  {t('DEACTIVATE_USER')}
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmationModal
        open={isModalOpen('resetPassword')}
        onOpenChange={(open) => !open && closeModal()}
        title={t('RESET_PASSWORD_FOR_USER')}
        description={`${t('RESETTING_PASSWORD_FOR')} ${selectedUser?.firstName} ${selectedUser?.lastName} (${selectedUser?.email}) ${t('WILL_SEND_PASSWORD_RESET_EMAIL')}`}
        onConfirm={handleConfirmResetPassword}
      />

      <ConfirmationModal
        open={isModalOpen('resendActivation')}
        onOpenChange={(open) => !open && closeModal()}
        title={t('ACTIVATE_THIS_USER')}
        description={`${t('ACTIVATING_THE_USER')} ${selectedUser?.firstName} ${selectedUser?.lastName} (${selectedUser?.email}) ${t('WILL_RESTORE_THEIR_ACCESS')}`}
        onConfirm={handleConfirmActivation}
      />

      <Dialog open={isModalOpen('edit')} onOpenChange={(open) => !open && closeModal()}>
        {selectedUser && <EditIamProfileDetails userInfo={selectedUser} onClose={closeModal} />}
      </Dialog>
    </>
  );
};
