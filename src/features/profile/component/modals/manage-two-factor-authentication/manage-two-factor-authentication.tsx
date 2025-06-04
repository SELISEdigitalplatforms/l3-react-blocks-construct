import { useState } from 'react';
import { Download, Mail, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { useAuthStore } from 'state/store/auth';
import { useSignoutMutation } from 'features/auth/hooks/use-auth';
import { useToast } from 'hooks/use-toast';
import { MfaDialogState } from 'features/profile/enums/mfa-dialog-state.enum';
import { User } from 'types/user.type';
import { UserMfaType } from '../../../enums/user-mfa-type-enum';
import { useDisableUserMfa } from '../../../hooks/use-mfa';
import ConfirmationModal from 'components/blocks/confirmation-modal/confirmation-modal';
import { ConfirmOtpVerification } from '../confirm-otp-verification/confirm-otp-verification';
import { useTranslation } from 'react-i18next';

type ManageTwoFactorAuthenticationProps = {
  userInfo?: User;
  onClose: () => void;
  dialogState: MfaDialogState;
};

export const ManageTwoFactorAuthentication: React.FC<
  Readonly<ManageTwoFactorAuthenticationProps>
> = ({ userInfo, onClose, dialogState }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuthStore();
  const { mutateAsync: signout, isPending: isSigningOut } = useSignoutMutation();
  const disableUserMfaMutation = useDisableUserMfa();
  const [activeModal, setActiveModal] = useState<'manage' | 'delete' | 'otp' | 'temp'>('manage');
  const [isDisabling, setIsDisabling] = useState(false);
  const [disabledMfaType, setDisabledMfaType] = useState<UserMfaType | null>(null);
  const { t } = useTranslation();

  const getMfaMethodTitle = () => {
    if (!initialMfaUserState) {
      return dialogState === MfaDialogState.AUTHENTICATOR_APP_SETUP
        ? t('AUTHENTICATOR_APP')
        : t('EMAIL_VERIFICATION');
    }
    return getMethodName();
  };

  const initialMfaUserState = JSON.parse(localStorage.getItem('initialMfaUserState') ?? 'false');

  const getMethodName = () => {
    const mfaType = isDisabling ? disabledMfaType : userInfo?.userMfaType;
    return mfaType === UserMfaType.AUTHENTICATOR_APP
      ? t('AUTENTICATOR_APP')
      : t('EMAIL_VERIFICATION');
  };

  const getSuccessMessage = () => {
    if (dialogState === MfaDialogState.AUTHENTICATOR_APP_SETUP) {
      return t('AUTHENTICATION_APP_LINKED_SUCCESSFULLY');
    } else if (dialogState === MfaDialogState.EMAIL_VERIFICATION) {
      return t('EMAIL_VERIFICATION_ENABLED_SUCCESSFULLY');
    }
    return '';
  };

  /** Download dummy recovery codes */
  const handleDownloadRecoveryCodes = () => {
    const dummyRecoveryCodes = `Recovery Codes:\n\nABC123-DEF456\nGHI789-JKL012\nMNO345-PQR678\nSTU901-VWX234\nYZA567-BCD890`;
    const blob = new Blob([dummyRecoveryCodes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recovery-codes.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      variant: 'success',
      title: t('RECOVERY_CODES_DOWNLOADED'),
      description: t('RECOVERY_CODES_DOWNLOADED_SUCCESSFULLY'),
    });
  };

  const logoutHandler = async () => {
    try {
      const res = await signout();
      if (res.isSuccess) {
        logout();
        navigate('/login');
      }
    } catch {
      toast({
        variant: 'destructive',
        title: t('UNEXPECTED_ERROR'),
        description: t('LOGGED_OUT_YOUR_SECURITY'),
      });
    }
  };

  const handleDisableClick = () => {
    setActiveModal('delete');
  };

  const handleVerifiedOtp = () => {
    if (!userInfo) return;
    setActiveModal('manage');
    setIsDisabling(true);

    const originalMfaType = userInfo.userMfaType;
    setDisabledMfaType(originalMfaType);

    disableUserMfaMutation.mutate(userInfo.itemId, {
      onSuccess: () => {
        toast({
          variant: 'success',
          title: t('MFA_DISABLED'),
          description: t('MULTI-FACTOR-AUTH-DISABLED-SUCCESSFULLY'),
        });
      },
      onError: (error: { error?: { message?: string } }) => {
        toast({
          variant: 'destructive',
          title: t('FAILED_TO_DISABLE_MFA'),
          description: error?.error?.message ?? t('ERROR_OCCURED_DISABLING_MULTI_FACTOR'),
        });
        setIsDisabling(false);
      },
    });
  };

  const onCancelOtpVerification = () => {
    setActiveModal('manage');
  };

  const handleCloseAll = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={activeModal === 'manage'}
        onOpenChange={(open) => {
          if (!open) handleCloseAll();
        }}
      >
        <DialogContent
          hideClose
          className="rounded-md sm:max-w-[432px] overflow-y-auto max-h-screen"
        >
          <DialogHeader>
            <DialogTitle>{t('MANAGE_2_FACTOR_AUTHENTICATION')}</DialogTitle>
            <DialogDescription>{t('YOU_LIKE_CHANGE_AUTH_METHOD')}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col w-full">
            {!initialMfaUserState && (
              <div className="rounded-lg bg-success-background border border-success p-4 my-6">
                <p className="text-xs font-normal text-success-high-emphasis">
                  {getSuccessMessage()}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface rounded-md">
                  {(!initialMfaUserState &&
                    dialogState === MfaDialogState.AUTHENTICATOR_APP_SETUP) ||
                  (isDisabling && disabledMfaType === UserMfaType.AUTHENTICATOR_APP) ||
                  userInfo?.userMfaType === UserMfaType.AUTHENTICATOR_APP ? (
                    <Smartphone className="text-secondary" size={24} />
                  ) : (
                    <Mail className="text-secondary" size={24} />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-high-emphasis">{getMfaMethodTitle()}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={!initialMfaUserState || disableUserMfaMutation.isPending || isDisabling}
                onClick={handleDisableClick}
                className={`font-bold text-sm ${
                  !initialMfaUserState || disableUserMfaMutation.isPending || isDisabling
                    ? 'text-neutral-400 cursor-not-allowed'
                    : 'text-destructive hover:text-destructive'
                }`}
              >
                {disableUserMfaMutation.isPending || isDisabling ? t('DISABLED') : t('DISABLE')}
              </Button>
            </div>
            {(userInfo?.userMfaType === UserMfaType.AUTHENTICATOR_APP ||
              (isDisabling && disabledMfaType === UserMfaType.AUTHENTICATOR_APP)) && (
              <Button
                variant="ghost"
                className="text-primary hover:text-primary-700 w-[225px]"
                onClick={handleDownloadRecoveryCodes}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-bold">{t('DOWNLOAD_RECOVERY_CODE')}</span>
              </Button>
            )}
          </div>
          <DialogFooter className="mt-5 flex w-full items-center justify-end">
            {!initialMfaUserState ? (
              <Button onClick={logoutHandler} disabled={isSigningOut} className="min-w-[118px]">
                {t('LOGOUT')}
              </Button>
            ) : (
              <Button variant="outline" onClick={handleCloseAll} className="min-w-[118px]">
                {t('CLOSE')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {activeModal === 'delete' && (
        <ConfirmationModal
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setActiveModal('manage');
            }
          }}
          title={t('DISABLE_MFA')}
          confirmText={t('YES')}
          description={t('ARE_SURE_WANT_DISABLE_MFA')}
          preventAutoClose={true}
          onConfirm={() => {
            setActiveModal('otp');
          }}
        />
      )}
      {activeModal === 'otp' && (
        <ConfirmOtpVerification
          onClose={onCancelOtpVerification}
          onVerified={handleVerifiedOtp}
          mfaType={userInfo?.userMfaType ?? UserMfaType.NONE}
          userInfo={userInfo}
        />
      )}
    </>
  );
};
