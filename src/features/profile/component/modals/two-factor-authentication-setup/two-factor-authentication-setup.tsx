import { ChevronRight, Mail, Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { MfaDialogState } from 'features/profile/enums/mfa-dialog-state.enum';
import { Skeleton } from 'components/ui/skeleton';
import { User } from '/types/user.type';
import { useGetMfaTemplate } from '../../../hooks/use-mfa';

/**
 * Component to manage the 2-factor authentication settings for a user.
 * Provides options to enable/disable MFA, switch between MFA methods,
 * and download recovery codes for the authenticator app.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {User} [props.userInfo] - The user's information, including their MFA settings.
 * @param {Function} props.onClose - The function to call when the dialog should be closed.
 * @param {MfaDialogState} props.dialogState - The current state of the MFA dialog.
 *
 * @returns {JSX.Element} - The rendered component.
 */

type TwoFactorAuthenticationSetupProps = {
  userInfo: User | undefined;
  onClose: () => void;
  setCurrentDialog: (dialogState: MfaDialogState) => void;
};

export const TwoFactorAuthenticationSetup: React.FC<
  Readonly<TwoFactorAuthenticationSetupProps>
> = ({ userInfo, onClose, setCurrentDialog }) => {
  const { data: mfaTemplate, isLoading } = useGetMfaTemplate();

  const isAuthenticatorAppEnabled = mfaTemplate?.enableMfa && mfaTemplate?.userMfaType?.includes(1);
  const isEmailVerificationEnabled =
    mfaTemplate?.enableMfa && mfaTemplate?.userMfaType?.includes(2);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent hideClose className="rounded-md sm:max-w-[432px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Set up 2-factor authentication</DialogTitle>
          <DialogDescription>
            Add an extra layer of security by choosing how you`d like to receive verification codes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full">
          {isLoading ? (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-[40px] h-[40px]" />
                <Skeleton className="w-[119px] h-[20px]" />
              </div>
              <Skeleton className="w-[20px] h-[20px]" />
            </div>
          ) : (
            <div
              className={`
              flex items-center justify-between p-4
              ${
                isAuthenticatorAppEnabled
                  ? 'hover:bg-muted/50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }
            `}
              onClick={() => {
                if (isAuthenticatorAppEnabled) {
                  if (
                    userInfo?.isMfaVerified &&
                    userInfo?.mfaEnabled &&
                    userInfo?.userMfaType === 1
                  ) {
                    setCurrentDialog(MfaDialogState.MANAGE_TWO_FACTOR_AUTHENTICATION);
                  } else {
                    setCurrentDialog(MfaDialogState.AUTHENTICATOR_APP_SETUP);
                  }
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface rounded-md">
                  <Smartphone className="text-secondary" size={24} />
                </div>
                <h3 className="text-sm font-semibold text-high-emphasis">Authenticator App</h3>
              </div>
              <ChevronRight className="text-primary" size={20} />
            </div>
          )}
          <Separator />
          {isLoading ? (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-[40px] h-[40px]" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="w-[119px] h-[18px]" />
                  <Skeleton className="w-[119px] h-[10px]" />
                </div>
              </div>
              <Skeleton className="w-[20px] h-[20px]" />
            </div>
          ) : (
            <div
              className={`
              flex items-center justify-between p-4
              ${
                isEmailVerificationEnabled
                  ? 'hover:bg-muted/50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }
            `}
              onClick={() => {
                if (isEmailVerificationEnabled) {
                  if (
                    userInfo?.isMfaVerified &&
                    userInfo?.mfaEnabled &&
                    userInfo?.userMfaType === 2
                  ) {
                    setCurrentDialog(MfaDialogState.MANAGE_TWO_FACTOR_AUTHENTICATION);
                  } else {
                    setCurrentDialog(MfaDialogState.EMAIL_VERIFICATION);
                  }
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface rounded-md">
                  <Mail className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-high-emphasis">Email Verification</h3>
                  <p className="text-xs text-medium-emphasis">{userInfo?.email}</p>
                </div>
              </div>
              <ChevronRight className="text-primary" size={20} />
            </div>
          )}
        </div>

        <DialogFooter className="mt-5 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="min-w-[118px]">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
