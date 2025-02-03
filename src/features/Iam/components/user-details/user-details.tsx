/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from 'components/ui/sheet';
import { Button } from 'components/ui/button';
import { IamData } from '../../services/user-service';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { Calendar, Clock, Mail, Phone, Shield } from 'lucide-react';
import { Separator } from 'components/ui/separator';
import { useForgotPassword, useResendActivation } from 'features/auth/hooks/use-auth';
import DummyProfile from 'assets/images/dummy_profile.png';

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: IamData | null;
}

const UserDetails: React.FC<UserDetailsSheetProps> = ({ open, onOpenChange, selectedUser }) => {
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

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent className="w-full sm:min-w-[450px] md:min-w-[450px] lg:min-w-[450px] sm:fixed sm:top-[57px] overflow-y-auto">
          <div className="flex flex-col h-[calc(100vh-15rem)] sm:h-[calc(100vh-6rem)]">
            <div>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-4 mb-4">
                  <div className="relative overflow-hidden rounded-full border shadow-sm border-white h-16 w-16">
                    <img
                      src={selectedUser?.profileImageUrl || DummyProfile}
                      alt="profile pic"
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
                        className={`text-sm ${
                          selectedUser?.active ? 'text-success' : 'text-error'
                        }`}
                      >
                        {selectedUser?.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <Separator className="mb-6" />

              {selectedUser && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-base font-thin text-medium-emphasis w-24">Mobile no.</div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-high-emphasis" />
                      <div className="text-base font-normal text-high-emphasis">
                        {selectedUser.phoneNumber || 'Not provided'}
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
            <div className="flex w-full justify-end flex-col sm:flex-row gap-4 mt-auto">
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
    </>
  );
};

export default UserDetails;
