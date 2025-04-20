import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from 'components/ui/dialog';
import emailSentIcon from 'assets/images/email_sent.svg';
import UIOtpInput from 'components/core/otp-input/otp-input';
import { User } from '/types/user.type';
import { useToast } from 'hooks/use-toast';
import useResendOTPTime from 'hooks/use-resend-otp';
import { useGenerateOTP, useResendOtp, useVerifyOTP } from '../../../hooks/use-mfa';
import { VerifyOTP } from '../../../types/mfa.types';

/**
 * `EmailVerification` component is used to handle the verification process of the user's email address via OTP.
 * It allows the user to enter the verification code received in their email, resend the OTP if necessary,
 * and proceed with the setup once the OTP is verified successfully.
 *
 * @component
 * @example
 * const userInfo = {
 *   email: 'user@example.com',
 *   itemId: '12345',
 *   userMfaType: 1
 * };
 *
 * <EmailVerification userInfo={userInfo} onClose={() => {}} onNext={() => {}} />
 *
 * @param {Object} props - The component's props
 * @param {User | undefined} props.userInfo - The user information object containing the email and itemId for OTP generation
 * @param {Function} props.onClose - Callback function to close the dialog/modal
 * @param {Function} props.onNext - Callback function to proceed to the next step once OTP verification is successful
 *
 * @returns {React.Element} The rendered component
 */

type EmailVerificationProps = {
  userInfo: User | undefined;
  onClose: () => void;
  onNext: () => void;
};

export const EmailVerification: React.FC<Readonly<EmailVerificationProps>> = ({
  userInfo,
  onClose,
  onNext,
}) => {
  const { toast } = useToast();
  const [mfaId, setMfaId] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const { mutate: generateOTP } = useGenerateOTP();
  const { mutate: verifyOTP, isPending: verifyOtpPending } = useVerifyOTP();
  const { mutate: resendOtp } = useResendOtp();
  const lastVerifiedOtpRef = useRef<string>('');
  const [newMfaId, setNewMfaId] = useState<string | null>(null);

  const {
    formattedTime,
    isResendDisabled,
    handleResend: handleResendOTP,
  } = useResendOTPTime({
    initialTime: 120,
    onResend: () => {
      if (!userInfo) return;

      if (mfaId) {
        resendOtp(mfaId, {
          onSuccess: (data) => {
            if (data?.mfaId) {
              setNewMfaId(data.mfaId);
            }
          },
        });
      } else {
        generateOTP(userInfo.itemId, {
          onSuccess: (data) => {
            if (data?.isSuccess) {
              setMfaId(data.mfaId);
              toast({
                variant: 'success',
                title: 'OTP Sent',
                description: 'A new verification code has been sent to your email',
              });
            }
          },
          onError: () => {
            toast({
              variant: 'destructive',
              title: 'Resend Failed',
              description: 'Failed to send a new verification code. Please try again.',
            });
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!userInfo) return;

    generateOTP(userInfo.itemId, {
      onSuccess: (data) => {
        if (data?.isSuccess) setMfaId(data.mfaId);
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Failed to generate OTP',
          description: 'Please try again later',
        });
      },
    });
  }, [userInfo, generateOTP, toast]);

  const onVerify = useCallback(() => {
    if (!mfaId) {
      toast({
        variant: 'destructive',
        title: 'Setup Incomplete',
        description: 'Please generate the QR code first',
      });
      return;
    }

    const verifyPayload: VerifyOTP = {
      verificationCode: otpValue,
      mfaId: newMfaId ?? mfaId ?? '',
      authType: userInfo?.userMfaType ?? 0,
    };

    verifyOTP(verifyPayload, {
      onSuccess: (res) => {
        if (res?.isSuccess && res?.isValid) {
          onNext();
        } else {
          setOtpError('Invalid OTP. Please try again.');
        }
      },
      onError: () => {
        setOtpError('Verification failed. Please try again.');
      },
    });
  }, [mfaId, otpValue, newMfaId, userInfo?.userMfaType, verifyOTP, toast, onNext]);

  useEffect(() => {
    if (
      otpValue.length === 5 &&
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
          <div className="flex items-center justify-center w-full">
            <div className="w-[120px] h-[108px]">
              <img src={emailSentIcon} alt="emailSentIcon" className="w-full h-full object-cover" />
            </div>
          </div>
          <DialogTitle className="!mt-6 text-2xl">Email sent</DialogTitle>
          <DialogDescription className="text-sm text-high-emphasis">
            We’ve sent a verification key to your registered email address
            <span className="font-semibold">({userInfo?.email})</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-1 text-sm font-normal">
            <span className="text-high-emphasis">Did not receive mail?</span>
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
          <div className="flex flex-col gap-4">
            <p className="font-sm text-high-emphasis font-normal">
              Please enter the key below to complete your setup.
            </p>
            <div className="flex flex-col gap-1">
              <UIOtpInput
                numInputs={5}
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
        </div>
        <DialogFooter className="mt-5 flex justify-end gap-3">
          <Button variant="outline" className="min-w-[118px]" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onVerify}
            disabled={verifyOtpPending || otpValue.length < 5}
            className="min-w-[118px]"
          >
            {verifyOtpPending ? 'Verifying' : 'Verify'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
