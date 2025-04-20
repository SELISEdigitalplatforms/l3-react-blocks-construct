import { Button } from 'components/ui/button';
import emailSentIcon from 'assets/images//verification-failed.svg';

export function VerificationFailed() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center align-center">
        <div className="w-32 h-14 mb-20 ">
          <img src={emailSentIcon} alt="emailSentIcon" />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-high-emphasis mb-4">Verification failed</div>
        <div className="flex gap-1 mt-1">
          <div className="text-base font-normal text-medium-emphasis leading-6">
            This link is no longer valid. Please request a new <br></br>verification email.
          </div>
        </div>
      </div>
      <Button className="font-extrabold" size="lg" type="submit">
        Resend link
      </Button>
      <Button
        className="font-extrabold text-primary mt-[-10px]"
        size="lg"
        type="submit"
        variant="ghost"
      >
        Go to Log in
      </Button>
    </div>
  );
}
