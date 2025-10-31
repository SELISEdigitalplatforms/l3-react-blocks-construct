import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { Button } from '@/components/ui-kit/button';
import { UIOtpInput } from '@/components/core';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user.type';
import { useGetSetUpTotp, useVerifyOTP } from '../../../hooks/use-mfa';
import QRCodeDummyImage from '@/assets/images/image_off_placeholder.webp';
import API_CONFIG from '../../../../../config/api';
import { SetUpTotp, VerifyOTP } from '@/modules/profile/types/mfa.types';

/**
 * AuthenticatorAppSetup component allows the user to set up an authenticator app for two-factor authentication.
 * It retrieves a QR code that the user can scan or enter a manual setup key, followed by verifying the OTP from the authenticator app.
 *
 * @param {Object} props - The component props.
 * @param {User} [props.userInfo] - The user data, which contains information for setting up MFA (optional).
 * @param {Function} props.onClose - The function to close the dialog.
 * @param {Function} props.onNext - The function to be called when the setup is successful and the next step should be triggered.
 * @param {string} props.mfaId - The ID of the MFA to be set up.
 *
 */

interface AuthenticatorAppSetupProps {
  userInfo?: User;
  onClose: () => void;
  onNext: () => void;
  mfaId: string;
}

export const AuthenticatorAppSetup = ({
  userInfo,
  onClose,
  onNext,
  mfaId,
}: Readonly<AuthenticatorAppSetupProps>) => {
  const { toast } = useToast();
  const [otpValue, setOtpValue] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isImageError, setIsImageError] = useState<boolean>(false);
  const [qrCodeUri, setQrCodeUri] = useState<string>('');
  const [manualQrCode, setManualQrCode] = useState<string>('');
  const lastVerifiedOtpRef = useRef<string>('');
  const { mutate: setUpTotp, isPending: setUpTotpPending } = useGetSetUpTotp();
  const { mutate: verifyOTP, isPending: verifyOtpPending } = useVerifyOTP();
  const { t } = useTranslation();

  useEffect(() => {
    if (!userInfo) return;

    const setUpTotpPayload: SetUpTotp = {
      userId: userInfo?.itemId,
      projectKey: API_CONFIG.blocksKey,
    };

    setUpTotp(setUpTotpPayload, {
      onSuccess: (response) => {
        if (response) {
          setQrCodeUri(response.qrImageUrl);
          setManualQrCode(response.qrCode);
        }
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: t('FAILED_GENERATE_QR_CODE'),
          description: t('SYSTEM_FAILED_GENERATE_QRCODE'),
        });
      },
    });
  }, [setUpTotp, t, toast, userInfo]);

  const onVerify = useCallback(() => {
    if (!mfaId) {
      toast({
        variant: 'destructive',
        title: t('SETUP_NOT_COMPLETE'),
        description: t('MFA_SETUP_NOT_COMPELE'),
      });
      return;
    }

    const verifyPayload: VerifyOTP = {
      verificationCode: otpValue,
      mfaId: mfaId,
      authType: 1,
    };

    verifyOTP(verifyPayload, {
      onSuccess: (res) => {
        if (res?.isSuccess && res?.isValid) {
          onNext();
        } else {
          setOtpError(t('INVALID_OTP_PLEASE_TRY_AGAIN'));
        }
      },
      onError: (error) => {
        console.error('onError:', error);
        setOtpError(t('VERIFICATION_FAILED_PLEASE_TRY_AGAIN'));
      },
    });
  }, [mfaId, otpValue, verifyOTP, toast, t, onNext]);

  useEffect(() => {
    if (
      otpValue.length === 6 &&
      mfaId &&
      !verifyOtpPending &&
      otpValue !== lastVerifiedOtpRef.current
    ) {
      lastVerifiedOtpRef.current = otpValue;
      onVerify();
    }
  }, [onVerify, otpValue, mfaId, verifyOtpPending]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent hideClose className="rounded-md sm:max-w-[432px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t('SET_UP_AUTHENTICATOR_APP')}</DialogTitle>
          <DialogDescription>{t('PLEASE_FOLLOW_INSTRUCTION_BELOW')}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full text-high-emphasis text-sm gap-1 font-normal">
            <span>1.</span>
            <span>{t('SCAN_QR_CODE_BELOW')}</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="w-40 h-40 border border-border rounded-[8px] p-2">
              {!setUpTotpPending ? (
                <img
                  src={qrCodeUri && !isImageError ? qrCodeUri : QRCodeDummyImage}
                  alt="otp qr code"
                  className="w-full h-full object-cover"
                  onError={() => setIsImageError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
              <p className="text-medium-emphasis text-center font-normal">
                {t('OR_ENTER_CODE_MANUALLY_IN_APP')}
              </p>
              <p className="text-center text-sm font-semibold text-high-emphasis">
                {manualQrCode ?? ''}
              </p>
            </div>
          </div>
          <div className="flex w-full text-high-emphasis text-sm gap-1 font-normal">
            <span>2.</span>
            <span>{t('VERIFY_PAIRING_SUCCESSFUL')}</span>
          </div>
          <div className="flex flex-col gap-1">
            <UIOtpInput
              value={otpValue}
              inputStyle={otpError ? '!border-error !text-destructive' : ''}
              onChange={(value) => {
                setOtpValue(value);
                setOtpError('');
              }}
            />
            {otpError && <span className="text-destructive text-xs">{otpError}</span>}
          </div>
        </div>
        <DialogFooter className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="min-w-[118px]">
            {t('CANCEL')}
          </Button>
          <Button
            onClick={onVerify}
            disabled={verifyOtpPending || otpValue.length < 6}
            className="min-w-[118px]"
          >
            {verifyOtpPending ? t('VERIFYING') : t('VERIFY')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
