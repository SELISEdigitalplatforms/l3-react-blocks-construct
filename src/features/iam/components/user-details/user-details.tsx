/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from 'components/ui/sheet';
import { Button } from 'components/ui/button';
import { IamData } from '../../services/user-service';
import ConfirmationModal from '../../../../components/blocks/confirmation-modal/confirmation-modal';
import { Calendar, Clock, Mail, Phone, Shield, User } from 'lucide-react';
import { Separator } from 'components/ui/separator';
import { useForgotPassword, useResendActivation } from 'features/auth/hooks/use-auth';
import DummyProfile from 'assets/images/dummy_profile.png';
import { Dialog } from 'components/ui/dialog';
import { EditIamProfileDetails } from 'features/profile/component/modals/edit-iam-profile-details/edit-iam-profile-details';

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
 * @returns {JSX.Element} - The rendered user details sheet modal with options to edit, reset password, or resend activation.
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

export const UserDetails = ({ open, onOpenChange, selectedUser }: UserDetailsSheetProps) => {
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isResendActivationModalOpen, setIsResendActivationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleActivationLink = () => {
    setIsResendActivationModalOpen(true);
  };

  const handleResetPassword = () => {
    setIsResetPasswordModalOpen(true);
  };

  const handleButtonClick = () => {
    if (!selectedUser) return;

    if (selectedUser.active) {
      handleResetPassword();
    } else {
      handleActivationLink();
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
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
                      {selectedUser?.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="mb-6" />
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-base font-thin text-medium-emphasis w-24">Role(s)</div>
                  <div className="flex items-start gap-2">
                    <User className="w-5 h-5 text-high-emphasis mt-0.5" />
                    <div className="text-base font-normal text-high-emphasis first-letter:uppercase">
                      {selectedUser.roles && selectedUser.roles.length > 0
                        ? selectedUser.roles.join(', ')
                        : '-'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-base font-thin text-medium-emphasis w-24">Mobile no.</div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-high-emphasis" />
                    <div className="text-base font-normal text-high-emphasis">
                      {selectedUser.phoneNumber ?? 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-base font-thin text-medium-emphasis w-24">Email</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-high-emphasis shrink-0" />
                      <div className="text-base font-normal text-high-emphasis break-words">
                        {selectedUser.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-base font-thin text-medium-emphasis w-24">Joined on</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-high-emphasis" />
                    <div className="text-base font-normal text-high-emphasis">
                      {new Date(selectedUser.createdDate).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-base font-thin text-medium-emphasis w-24">Last log in</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-high-emphasis" />
                    <div className="text-base font-normal text-high-emphasis">
                      {new Date(selectedUser.lastLoggedInTime).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-base font-thin text-medium-emphasis w-24">MFA</div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-high-emphasis" />
                    <div className="text-base font-normal text-high-emphasis">
                      {selectedUser.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button size="default" className="w-full h-9" onClick={handleEditClick}>
              Edit
            </Button>

            <div className="flex w-full flex-col sm:flex-row gap-4">
              <Button variant="outline" className="w-full" onClick={() => handleButtonClick()}>
                {selectedUser?.active ? 'Reset Password' : 'Resend Activation Link'}
              </Button>
              {selectedUser?.active && (
                <Button
                  variant="outline"
                  className="w-full disabled cursor-not-allowed opacity-50 text-error hover:text-error hover:opacity-50"
                  onClick={() => {}}
                >
                  Deactivate User
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {selectedUser && (
          <EditIamProfileDetails userInfo={selectedUser} onClose={handleCloseEditModal} />
        )}
      </Dialog>
    </>
  );
};
