import { useState } from 'react';
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
import BCOtpInput from 'components/core/otp-input/otp-input';

type EmailVerificationProps = {
  onClose: () => void;
  onNext: () => void;
};

export const EmailVerification: React.FC<EmailVerificationProps> = ({ onClose, onNext }) => {
  const [otpValue, setOtpValue] = useState<string>('');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="rounded-md sm:max-w-[432px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <div className="flex items-center justify-center w-full">
            <div className="w-[120px] h-[108px]">
              <img src={emailSentIcon} alt="emailSentIcon" className="w-full h-full object-cover" />
            </div>
          </div>
          <DialogTitle className="!mt-6 text-2xl">Email sent</DialogTitle>
          <DialogDescription className="text-sm text-high-emphasis">
            We’ve sent a verification key to your registered email address{' '}
            <span className="font-semibold">(demo@blocks.construct)</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-1 text-sm font-normal">
            <span className="text-high-emphasis">Did not receive mail?</span>
            <span className="text-low-emphasis">Resend in 0:30s</span>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-sm text-high-emphasis font-normal">
              Please enter the key below to complete your setup.
            </p>
            <BCOtpInput value={otpValue} onChange={setOtpValue} />
          </div>
        </div>
        <DialogFooter className="mt-5 flex justify-end gap-3">
          <Button variant="outline" className="min-w-[118px]" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onNext} className="min-w-[118px]">
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
