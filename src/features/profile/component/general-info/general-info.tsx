import { useEffect, useRef, useState } from 'react';
import { Lock, Pencil, ShieldCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Dialog } from 'components/ui/dialog';
import { EditProfile } from '../modals/edit-profile/edit-profile';
import DummyProfile from 'assets/images/dummy_profile.png';
import { UpdatePassword } from '../modals/update-password/update-password';
import { Skeleton } from 'components/ui/skeleton';
import { useGetAccount } from '../../hooks/use-account';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { TwoFactorAuthenticationSetup } from '../modals/two-factor-authentication-setup/two-factor-authentication-setup';
import { AuthenticatorAppSetup } from '../modals/authenticator-app-setup/authenticator-app-setup';
import { ManageTwoFactorAuthentication } from '../modals/manage-two-factor-authentication/manage-two-factor-authentication';
import { EmailVerification } from '../modals/email-verification/email-verification';
import { MfaDialogState } from '../../enums/mfa-dialog-state.enum';
import { UserMfaType } from '../../enums/user-mfa-type-enum';

/**
 * `GeneralInfo` component renders a user profile and account security section with options to
 * edit the profile, manage two-factor authentication (MFA), and change the password.
 * It also handles various dialogs for MFA setup, authentication app setup, and email verification.
 *
 * @returns {JSX.Element} The rendered user profile and account security sections.
 */

export const GeneralInfo = () => {
  const { data: userInfo, isLoading, isFetching } = useGetAccount();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState<MfaDialogState>(MfaDialogState.NONE);
  const isLocalStorageSet = useRef(false);
  const [dialogState, setDialogState] = useState<MfaDialogState>(
    MfaDialogState.AUTHENTICATOR_APP_SETUP
  );
  const closeAllModals = () => setCurrentDialog(MfaDialogState.NONE);

  const handleEditProfileClose = () => {
    setIsEditProfileModalOpen(false);
  };

  useEffect(() => {
    if (currentDialog === MfaDialogState.AUTHENTICATOR_APP_SETUP) {
      setDialogState(MfaDialogState.AUTHENTICATOR_APP_SETUP);
    } else if (currentDialog === MfaDialogState.EMAIL_VERIFICATION) {
      setDialogState(MfaDialogState.EMAIL_VERIFICATION);
    }
  }, [currentDialog]);

  const joinedDate = userInfo ? new Date(userInfo.createdDate) : null;
  const lastLoggedInDate = userInfo ? new Date(userInfo.lastLoggedInTime) : null;

  useEffect(() => {
    if (!userInfo || isLocalStorageSet.current) return;

    const shouldSetMfaState =
      userInfo.userMfaType === UserMfaType.NONE ||
      (userInfo.userMfaType !== UserMfaType.NONE && userInfo.mfaEnabled);

    if (shouldSetMfaState) {
      localStorage.setItem('initialMfaUserState', String(userInfo.mfaEnabled));
      isLocalStorageSet.current = true;
    }
  }, [userInfo]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardHeader className="p-0 hidden">
          <CardTitle />
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="relative w-16 h-16 rounded-full border overflow-hidden border-white shadow-sm">
                {isLoading || isFetching ? (
                  <Skeleton className="w-16 h-16 rounded-full" />
                ) : (
                  <img
                    src={
                      userInfo?.profileImageUrl !== ''
                        ? (userInfo?.profileImageUrl ?? DummyProfile)
                        : DummyProfile
                    }
                    alt="Profile"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 ml-3 sm:ml-9">
                {isLoading || isFetching ? (
                  <>
                    <Skeleton className="w-40 h-5" />
                    <Skeleton className="w-48 h-4 mt-1" />
                  </>
                ) : (
                  <>
                    <h1 className="text-xl text-high-emphasis font-semibold">
                      {userInfo?.firstName} {userInfo?.lastName}
                    </h1>
                    <p className="text-sm text-medium-emphasis">{userInfo?.email}</p>
                  </>
                )}
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setIsEditProfileModalOpen(true)}>
              <Pencil className="w-3 h-3 text-primary" />
              <span className="text-primary text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
                Edit
              </span>
            </Button>
            <Dialog open={isEditProfileModalOpen} onOpenChange={setIsEditProfileModalOpen}>
              {userInfo && <EditProfile userInfo={userInfo} onClose={handleEditProfileClose} />}
            </Dialog>
          </div>
          <Separator orientation="horizontal" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading || isFetching ? (
              Array.from({ length: 3 }).map(() => (
                <div key={uuidv4()}>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))
            ) : (
              <>
                <div>
                  <p className="text-medium-emphasis text-xs font-normal">Mobile No.</p>
                  <p className="text-high-emphasis text-sm">{userInfo?.phoneNumber ?? '-'}</p>
                </div>
                <div>
                  <p className="text-medium-emphasis text-xs font-normal">Joined On</p>
                  <p className="text-high-emphasis text-sm">
                    {joinedDate
                      ? `${joinedDate.toLocaleDateString('en-US')}, ${joinedDate.toLocaleTimeString('en-US')}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-medium-emphasis text-xs font-normal">Last Logged in</p>
                  <p className="text-high-emphasis text-sm">
                    {lastLoggedInDate
                      ? `${lastLoggedInDate.toLocaleDateString('en-US')}, ${lastLoggedInDate.toLocaleTimeString('en-US')}`
                      : '-'}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full border-none rounded-[8px] shadow-sm">
        <CardHeader className="space-y-0 p-0 hidden">
          <CardTitle />
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <h1 className="text-xl text-high-emphasis font-semibold">Account security</h1>
          <Separator orientation="horizontal" />
          <div className="flex flex-col py-2 gap-10">
            <div
              className={`flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between ${userInfo?.email === 'demo.construct@seliseblocks.com' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-sm text-high-emphasis font-bold">Two-factor authentication</h1>
                <p className="text-sm text-medium-emphasis">
                  Enhance your security with an app or email-based authenticator.
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isLoading || isFetching ? (
                    <Skeleton className="w-[102px] h-8" />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-sm font-bold text-primary hover:text-primary"
                      onClick={() => {
                        setCurrentDialog(MfaDialogState.TWO_FACTOR_SETUP);
                      }}
                      disabled={userInfo?.email === 'demo.construct@seliseblocks.com'}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {userInfo?.mfaEnabled || userInfo?.isMfaVerified ? 'Manage' : 'Enable'}
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-neutral-700 text-white text-center max-w-[100px]">
                  {userInfo?.email === 'demo.construct@seliseblocks.com'
                    ? 'Not available for demo accounts'
                    : userInfo?.mfaEnabled || userInfo?.isMfaVerified
                      ? 'Click here to manage MFA'
                      : 'Click here to enable MFA'}
                </TooltipContent>
              </Tooltip>
              {currentDialog === MfaDialogState.TWO_FACTOR_SETUP && (
                <TwoFactorAuthenticationSetup
                  userInfo={userInfo}
                  setCurrentDialog={setCurrentDialog}
                  onClose={closeAllModals}
                />
              )}
              {currentDialog === MfaDialogState.AUTHENTICATOR_APP_SETUP && (
                <AuthenticatorAppSetup
                  userInfo={userInfo}
                  onClose={closeAllModals}
                  onNext={() => setCurrentDialog(MfaDialogState.MANAGE_TWO_FACTOR_AUTHENTICATION)}
                />
              )}
              {currentDialog === MfaDialogState.EMAIL_VERIFICATION && (
                <EmailVerification
                  userInfo={userInfo}
                  onClose={closeAllModals}
                  onNext={() => setCurrentDialog(MfaDialogState.MANAGE_TWO_FACTOR_AUTHENTICATION)}
                />
              )}
              {currentDialog === MfaDialogState.MANAGE_TWO_FACTOR_AUTHENTICATION && (
                <ManageTwoFactorAuthentication
                  userInfo={userInfo}
                  onClose={closeAllModals}
                  dialogState={dialogState}
                />
              )}
            </div>
            <div
              className={`flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between  ${userInfo?.email === 'demo.construct@seliseblocks.com' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-sm text-high-emphasis font-bold">Change password</h1>
                <p className="text-sm text-medium-emphasis">
                  Update your password to keep your account safe.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-primary hover:text-primary text-sm font-bold"
                onClick={() => setIsChangePasswordModalOpen(true)}
                disabled={userInfo?.email === 'demo.construct@seliseblocks.com'}
              >
                <Lock className="w-4 h-4" />
                Update Password
              </Button>
              <UpdatePassword
                onClose={() => setIsChangePasswordModalOpen(false)}
                open={isChangePasswordModalOpen}
                onOpenChange={setIsChangePasswordModalOpen}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
