import { Link } from 'react-router-dom';
import { Button } from 'components/ui/button';
import githubIcon from 'assets/images/social_media_github.svg';
import linkedinIcon from 'assets/images/social_media_in.svg';
import microsoftIcon from 'assets/images/social_media_ms.svg';
import googleIcon from 'assets/images/social_media_google.svg';
import { SignupForm } from 'features/auth/components/signup-form';
import logo from 'assets/images/selise_Blocks_logo.svg';

export function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-32 h-14 mb-2">
        <img src={logo} className="w-full h-full" alt="logo" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-high-emphasis">
          Sign up to get access to our open source services (Design Only)
        </h2>
        <div className="flex items-center gap-1 mt-4">
          <span className="text-sm font-normal text-medium-emphasis">Already have an account?</span>
          <Link
            to={'/login'}
            className="text-sm font-bold text-primary hover:text-primary-600 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
      <SignupForm />

      <div>
        <div className="flex items-center gap-4 mb-6 mt-23">
          <div className="flex-1">
            <hr className="h-[2px] bg-gray-200 border-0 rounded" />
          </div>
          <div className="text-base font-normal text-low-emphasis">Or</div>
          <div className="flex-1">
            <hr className="h-[2px] bg-gray-200 border-0 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex w-full items-center gap-4">
            <Button variant="outline" className="w-[25%] h-12" disabled>
              <img src={googleIcon} width={20} height={20} alt="Google Logo" />
            </Button>
            <Button variant="outline" className="w-[25%] h-12" disabled>
              <img src={microsoftIcon} width={20} height={20} alt="microsoft Logo" />
            </Button>
            <Button variant="outline" className="w-[25%] h-12" disabled>
              <img src={linkedinIcon} width={20} height={20} alt="linkedin Logo" />
            </Button>

            <Button variant="outline" className="w-[25%] h-12" disabled>
              <img src={githubIcon} width={20} height={20} alt="github Logo" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
