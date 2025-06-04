import { useTranslation } from 'react-i18next';
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
import { User } from 'types/user.type';
import { useGetMfaTemplate, useGenerateOTP } from '../../../hooks/use-mfa';
import { useToast } from 'hooks/use-toast';

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
 * @param {Function} props.setMfaId - The function to call when the MFA ID should be set.
 *
 * @returns {JSX.Element} - The rendered component.
 */

type TwoFactorAuthenticationSetupProps = {
  userInfo: User | undefined;
  onClose: () => void;
  setCurrentDialog: (dialogState: MfaDialogState) => void;
  setMfaId: (mfaId: string) => void;
};

export const TwoFactorAuthenticationSetup: React.FC<
  Readonly<TwoFactorAuthenticationSetupProps>
> = ({ userInfo, onClose, setCurrentDialog, setMfaId }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: mfaTemplate, isLoading } = useGetMfaTemplate();
  const { mutate: generateOTP, isPending: isGeneratingOTP } = useGenerateOTP();

  const isAuthenticatorAppEnabled = mfaTemplate?.enableMfa && mfaTemplate?.userMfaType?.includes(1);
  const isEmailVerificationEnabled =
    mfaTemplate?.enableMfa && mfaTemplate?.userMfaType?.includes(2);

  const handleAuthenticatorAppClick = () => {
    if (!isAuthenticatorAppEnabled || !userInfo) return;

    if (userInfo?.isMfaVerified && userInfo?.mfaEnabled && userInfo?.userMfaType === 1) {
      setCurrentDialog(MfaDialogState.MANAGE_TWO_FACTOR_AUTHENTICATION);
    } else {
      generateOTP(
        { userId: userInfo.itemId, mfaType: 1 },
        {
          onSuccess: (data) => {
            if (data?.isSuccess && data?.mfaId) {
              setMfaId(data.mfaId);
              setCurrentDialog(MfaDialogState.AUTHENTICATOR_APP_SETUP);
            }
          },
          onError: () => {
            toast({
              variant: 'destructive',
              title: t('FAILED_TO_GENERATE_OTP'),
              description: t('PLEASE_TRY_AGAIN_LATER'),
            });
          },
        }
      );
    }
  };

  const handleEmailVerificationClick = () => {
    if (!isEmailVerificationEnabled || !userInfo) return;

    if (userInfo?.isMfaVerified && userInfo?.mfaEnabled && userInfo?.userMfaType === 2) {
      setCurrentDialog(MfaDialogState.MANAGE_TWO_FACTOR_AUTHENTICATION);
    } else {
      generateOTP(
        { userId: userInfo.itemId, mfaType: 2 },
        {
          onSuccess: (data) => {
            if (data?.isSuccess && data?.mfaId) {
              setMfaId(data.mfaId);
              setCurrentDialog(MfaDialogState.EMAIL_VERIFICATION);
            }
          },
          onError: () => {
            toast({
              variant: 'destructive',
              title: t('FAILED_TO_GENERATE_OTP'),
              description: t('PLEASE_TRY_AGAIN_LATER'),
            });
          },
        }
      );
    }
  };

  const renderAuthenticatorAppContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-[40px] h-[40px]" />
            <Skeleton className="w-[119px] h-[20px]" />
          </div>
          <Skeleton className="w-[20px] h-[20px]" />
        </div>
      );
    }

    if (!isAuthenticatorAppEnabled) {
      return (
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-surface rounded-md">
              <Smartphone className="text-secondary" size={24} />
            </div>
            <h3 className="text-sm font-semibold text-high-emphasis">{t('AUTHENTICATOR_APP')}</h3>
          </div>
          <ChevronRight className="text-primary" size={20} />
        </div>
      );
    }

    if (isGeneratingOTP) {
      return (
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-[40px] h-[40px] rounded-md" />
            <Skeleton className="w-[119px] h-[20px]" />
          </div>
          <Skeleton className="w-[20px] h-[20px]" />
        </div>
      );
    }

    return (
      <button
        type="button"
        disabled={!isAuthenticatorAppEnabled}
        className={`
        w-full flex items-center justify-between p-4
        ${isAuthenticatorAppEnabled ? 'hover:bg-muted/50' : 'opacity-50'}
      `}
        onClick={handleAuthenticatorAppClick}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface rounded-md">
            <Smartphone className="text-secondary" size={24} />
          </div>
          <h3 className="text-sm font-semibold text-high-emphasis">{t('AUTHENTICATOR_APP')}</h3>
        </div>
        <ChevronRight className="text-primary" size={20} />
      </button>
    );
  };

  const renderEmailVerificationContent = () => {
    if (isLoading) {
      return (
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
      );
    }

    if (isGeneratingOTP) {
      return (
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-[40px] h-[40px] rounded-md" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-[119px] h-[18px]" />
              <Skeleton className="w-[119px] h-[10px]" />
            </div>
          </div>
          <Skeleton className="w-[20px] h-[20px]" />
        </div>
      );
    }

    return (
      <button
        type="button"
        disabled={!isEmailVerificationEnabled}
        className={`
        w-full flex items-center justify-between p-4
        ${isEmailVerificationEnabled ? 'hover:bg-muted/50' : 'opacity-50'}
      `}
        onClick={handleEmailVerificationClick}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface rounded-md">
            <Mail className="text-secondary" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-high-emphasis">{t('EMAIL_VERIFICATION')}</h3>
            <p className="text-xs text-medium-emphasis">{userInfo?.email}</p>
          </div>
        </div>
        <ChevronRight className="text-primary" size={20} />
      </button>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent hideClose className="rounded-md sm:max-w-[432px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t('SET_UP_2_FACTOR_AUTHENTICATION')}</DialogTitle>
          <DialogDescription>{t('ADD_EXTRA_LAYER_SECURITY')}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full">
          {renderAuthenticatorAppContent()}
          <Separator />
          {renderEmailVerificationContent()}
        </div>

        <DialogFooter className="mt-5 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="min-w-[118px]">
              {t('CLOSE')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
