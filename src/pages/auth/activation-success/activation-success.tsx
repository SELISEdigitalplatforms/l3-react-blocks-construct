import { Link } from 'react-router-dom';
import { Button } from 'components/ui/button';
import successIcon from 'assets/images/verification-success.svg';

export function ActivationSuccess() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center align-center">
        <div className="w-32 h-14 mb-20 ">
          <img src={successIcon} alt="emailSentIcon" />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-high-emphasis mb-4">
          You have successfully set your password
        </div>
        <div className="flex gap-1 mt-1">
          <div className="text-base font-normal text-medium-emphasis leading-6">
            Please, continue to login with your password and unlock a library of open source
            services
          </div>
        </div>
      </div>

      <Link to="/login">
        <Button className="font-extrabold w-full" size="lg" type="submit">
          Log in
        </Button>
      </Link>
    </div>
  );
}
