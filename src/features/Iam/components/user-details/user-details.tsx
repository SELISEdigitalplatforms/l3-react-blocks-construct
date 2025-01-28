/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from 'components/ui/sheet';
import { Button } from 'components/ui/button';
import { IamData } from '../../services/user-service';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { Calendar, Clock, Mail, Phone, Shield } from 'lucide-react';
import { Separator } from 'components/ui/separator';

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: IamData | null;
}

const UserDetails: React.FC<UserDetailsSheetProps> = ({ open, onOpenChange, selectedUser }) => {
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const handleConfirm = () => {
    setIsResetPasswordModalOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent className="w-full sm:min-w-[450px] md:min-w-[450px] lg:min-w-[450px]">
          <div className="flex flex-col h-[calc(100vh-2rem)] justify-between">
            <div>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200" />
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
                    <div className="text-base font-thin text-medium-emphasis w-24 ">Mobile no.</div>
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
                        {new Date(selectedUser.lastUpdatedDate).toLocaleString()}
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

            <div className="pt-6 pb-2">
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1" onClick={() => {}}>
                  {selectedUser?.active ? 'Reset Password' : 'Resend Activation Link'}
                </Button>

                <Button
                  variant={selectedUser?.active ? 'outline' : 'default'}
                  className={`flex-1 ${selectedUser?.active ? 'text-error hover:bg-red-50' : ''}`}
                  onClick={() => {}}
                >
                  {selectedUser?.active ? 'Deactivate User' : 'Activate User'}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmationModal
        open={isResetPasswordModalOpen}
        onOpenChange={setIsResetPasswordModalOpen}
        title="Reset password for this user?"
        description={`Resetting the password for ${selectedUser?.firstName} ${selectedUser?.lastName} (${selectedUser?.email}) will send a password reset email to the user. Are you sure you want to proceed?`}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default UserDetails;
