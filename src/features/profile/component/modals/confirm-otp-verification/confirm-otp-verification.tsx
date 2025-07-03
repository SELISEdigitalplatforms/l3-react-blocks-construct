import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from 'components/ui/dialog';
import UIOtpInput from 'components/core/otp-input/otp-input';
import { UserMfaType } from '../../../enums/user-mfa-type-enum';
import { useToast } from 'hooks/use-toast';
import useResendOTPTime from 'hooks/use-resend-otp';
import { useGenerateOTP, useResendOtp, useVerifyOTP } from '../../../hooks/use-mfa';
import { VerifyOTP } from '../../../types/mfa.types';
import { User } from 'types/user.type';
import { useTranslation } from 'react-i18next';

/**
 * `ConfirmOtpVerification` component is used to verify a user's identity through OTP when disabling MFA.
 * It supports both authenticator app and email verification flows, with different OTP lengths for each.
 * For email verification, it handles sending the OTP, resending if necessary, and verification.
 * For authenticator app, it simply verifies the entered OTP code.
 *
 * @component
 * @example
 * const userInfo = {
 *   email: 'user@example.com',
 *   itemId: '12345',
 *   userMfaType: 1
 * };
 *
 * <ConfirmOtpVerification
 *   userInfo={userInfo}
 *   onClose={() => {}}
 *   onVerified={() => {}}
 *   mfaType={UserMfaType.AUTHENTICATOR_APP}
 * />
 *
 * @param {Object} props - The component's props
 * @param {Function} props.onClose - Callback function to close the dialog/modal
 * @param {Function} props.onVerified - Callback function to execute after successful verification
 * @param {UserMfaType} props.mfaType - The type of MFA being verified (authenticator app or email)
 * @param {User | undefined} props.userInfo - The user information object containing email and itemId
 *
 * @returns {React.Element} The rendered component
 */

type ConfirmOtpVerificationProps = {
  onClose: () => void;
  onVerified: () => void;
  mfaType: UserMfaType;
  userInfo?: User;
};

export const ConfirmOtpVerification: React.FC<ConfirmOtpVerificationProps> = ({
  onClose,
  onVerified,
  mfaType,
  userInfo,
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const getEmailVerificationMessage = () => {
    const baseMessage = t('WE_SENT_VERIFICATION_KEY_REGISTERED_EMAIL');
    const emailSuffix = userInfo?.email ? ` (${userInfo.email})` : '';
    return baseMessage + emailSuffix;
  };

  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [mfaId, setMfaId] = useState('');
  const [newMfaId, setNewMfaId] = useState<string | null>(null);
  const { mutate: generateOTP } = useGenerateOTP();
  const { mutate: verifyOTP, isPending: verifyOtpPending } = useVerifyOTP();
  const { mutate: resendOtp } = useResendOtp();
  const lastVerifiedOtpRef = useRef<string>('');

  const {
    formattedTime,
    isResendDisabled,
    handleResend: handleResendOTP,
  } = useResendOTPTime({
    initialTime: 120,
    onResend: () => {
      if (!userInfo?.itemId) return;

      if (mfaId) {
        resendOtp(mfaId, {
          onSuccess: (data) => {
            if (data?.mfaId) {
              setNewMfaId(data.mfaId);
              toast({
                variant: 'success',
                title: t('OTP_RESENT'),
                description: t('NEW_VERIFICATION_CODE_SENT_DEVICE'),
              });
            }
          },
        });
      } else {
        generateOTP(
          { userId: userInfo.itemId, mfaType: 2 },
          {
            onSuccess: (data: { isSuccess?: boolean; mfaId?: string }) => {
              if (data?.isSuccess) {
                data.mfaId && setMfaId(data.mfaId);
                toast({
                  variant: 'success',
                  title: t('OTP_SENT'),
                  description: t('NEW_VERIFICATION_CODE_SENT_DEVICE'),
                });
              }
            },
            onError: () => {
              toast({
                variant: 'destructive',
                title: t('COULDNT_SEND_CODE'),
                description: t('COULDNT_NEW_VERIFICATION_CODE'),
              });
            },
          }
        );
      }
    },
  });

  useEffect(() => {
    if (!userInfo?.itemId || mfaType !== UserMfaType.EMAIL_VERIFICATION) return;

    generateOTP(
      { userId: userInfo.itemId, mfaType: 2 },
      {
        onSuccess: (data) => {
          if (data?.isSuccess) setMfaId(data.mfaId);
        },
        onError: () => {
          toast({
            variant: 'destructive',
            title: t('UNABLE_GENERATE_CODE'),
            description: t('PLEASE_TRY_AGAIN_LATER'),
          });
        },
      }
    );
  }, [userInfo, generateOTP, toast, mfaType, t]);

  const onVerify = useCallback(() => {
    if (mfaType === UserMfaType.EMAIL_VERIFICATION && !mfaId) {
      toast({
        variant: 'destructive',
        title: t('VERIFICATION_ISSUE'),
        description: t('PLEASE_WAIT_BEFORE_REQUESTING_ANOTHER_CODE'),
      });
      return;
    }

    if (mfaType === UserMfaType.EMAIL_VERIFICATION) {
      const verifyPayload: VerifyOTP = {
        verificationCode: otpValue,
        mfaId: newMfaId ?? mfaId ?? '',
        authType: 2,
      };

      verifyOTP(verifyPayload, {
        onSuccess: (res: { isSuccess?: boolean; isValid?: boolean }) => {
          if (res?.isSuccess && res?.isValid) {
            onVerified();
          } else {
            setOtpError(t('INVALID_OTP_PLEASE_TRY_AGAIN'));
          }
        },
        onError: () => {
          setOtpError(t('VERIFICATION_FAILED_PLEASE_TRY_AGAIN'));
        },
      });
    } else {
      onVerified();
    }
  }, [mfaType, mfaId, toast, t, otpValue, newMfaId, verifyOTP, onVerified]);

  useEffect(() => {
    const requiredLength = mfaType === UserMfaType.AUTHENTICATOR_APP ? 6 : 5;
    if (
      otpValue.length === requiredLength &&
      !verifyOtpPending &&
      otpValue !== lastVerifiedOtpRef.current
    ) {
      lastVerifiedOtpRef.current = otpValue;
      onVerify();
    }
  }, [onVerify, otpValue, verifyOtpPending, mfaType]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent hideClose className="rounded-md sm:max-w-[432px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('PLEASE_VERIFY_ITS_YOU')}</DialogTitle>
          <DialogDescription className="text-sm text-high-emphasis">
            {mfaType === UserMfaType.EMAIL_VERIFICATION
              ? getEmailVerificationMessage()
              : t('ENTER_VERIFICATION_CODE_AUTHENTICATOR_APP')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4">
          {mfaType === UserMfaType.EMAIL_VERIFICATION && (
            <div className="flex items-center gap-1 text-sm font-normal">
              <span className="text-high-emphasis">{t('DID_NOT_RECEIVE_MAIL')}</span>
              <Button
                variant="ghost"
                size="sm"
                className={`${isResendDisabled ? 'text-sm font-normal' : 'font-semibold'}`}
                disabled={isResendDisabled}
                onClick={handleResendOTP}
              >
                {isResendDisabled ? `Resend in ${formattedTime}` : 'Resend'}
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <UIOtpInput
              numInputs={mfaType === UserMfaType.AUTHENTICATOR_APP ? 6 : 5}
              value={otpValue}
              inputStyle={otpError && '!border-error !text-destructive'}
              onChange={(value) => {
                setOtpValue(value);
                setOtpError('');
              }}
            />
            {otpError && <span className="text-destructive text-xs">{otpError}</span>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="min-w-[118px]">
            {t('CANCEL')}
          </Button>
          <Button
            onClick={onVerify}
            className="min-w-[118px]"
            disabled={
              verifyOtpPending ||
              (mfaType === UserMfaType.AUTHENTICATOR_APP
                ? otpValue.length !== 6
                : otpValue.length !== 5)
            }
          >
            {verifyOtpPending ? t('VERIFYING') : t('VERIFY')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
