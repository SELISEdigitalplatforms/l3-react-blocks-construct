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
import { User } from '/types/user.type';
import { UserMfaType } from '../../../enums/user-mfa-type-enum';
import { useConfigureUserMfa } from '../../../hooks/use-mfa';

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
  const { mutate: configureUserMfa } = useConfigureUserMfa();

  const handleEnableMFA = (mfaType: number) => {
    if (!userInfo?.itemId || userInfo.mfaEnabled) return;

    const payload = {
      userId: userInfo.itemId,
      mfaEnabled: true,
      userMfaType: mfaType,
      isMfaVerified: true,
    };
    if (!userInfo?.mfaEnabled) {
      configureUserMfa(payload);
    }
  };

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
          <div
            className={`
              flex items-center justify-between p-4
              ${
                userInfo?.userMfaType === UserMfaType.AUTHENTICATOR_APP ||
                userInfo?.userMfaType === UserMfaType.NONE
                  ? 'hover:bg-muted/50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }
            `}
            onClick={() => {
              if (
                userInfo?.userMfaType === UserMfaType.AUTHENTICATOR_APP ||
                userInfo?.userMfaType === UserMfaType.NONE
              ) {
                handleEnableMFA(UserMfaType.AUTHENTICATOR_APP);
                setCurrentDialog(MfaDialogState.AUTHENTICATOR_APP_SETUP);
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
          <Separator />
          <div
            className={`
              flex items-center justify-between p-4
              ${
                userInfo?.userMfaType === UserMfaType.EMAIL_VERIFICATION ||
                userInfo?.userMfaType === UserMfaType.NONE
                  ? 'hover:bg-muted/50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }
            `}
            onClick={() => {
              if (
                userInfo?.userMfaType === UserMfaType.EMAIL_VERIFICATION ||
                userInfo?.userMfaType === UserMfaType.NONE
              ) {
                handleEnableMFA(UserMfaType.EMAIL_VERIFICATION);
                setCurrentDialog(MfaDialogState.EMAIL_VERIFICATION);
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
