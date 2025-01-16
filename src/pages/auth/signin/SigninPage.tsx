import { Button } from '../../../components/ui/button';
import { SigninForm } from '../../../features/auth/components/signin-form';
import githubIcon from '../../../assets/images/social-media-github.png';
import linkedinIcon from '../../../assets/images/social-media-in.png';
import microsoftIcon from '../../../assets/images/social-media-ms.png';
import googleIcon from '../../../assets/images/social-media-google.png';
import logo from '../../../assets/images/Logo.png';
import { Link } from 'react-router-dom';

export function SigninPage() {
  //inital commit
  return (
    <div className="flex flex-col gap-6">
      <div className="w-32 h-14 mb-2">
        <img src={logo} alt="logo" />
      </div>
      <div>
        <div className="text-2xl font-bold text-high-emphasis">Log in</div>
        <div className="flex gap-1 mt-1">
          <div className="text-sm font-normal text-medium-emphasis">Don’t have an account?</div>
          <Link to={'/signup'}>
            <div className="text-sm font-normal text-primary">Sign up</div>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-4">
        <div className="rounded-lg bg-success-background border border-success p-4">
          <p className="text-xs font-normal text-success-high-emphasis">
            Sign in to explore the complete Demo and Documentation. Use the credentials:{' '}
            <span className="font-semibold">johndoe</span> with password:{' '}
            <span className="font-semibold">1qazZAQ!</span>
          </p>
        </div>
      </div>
      <SigninForm />
      <div>
        <div className="flex items-center gap-4 mb-6 mt-23">
          <div className="flex-1">
            <hr className="h-[2px] bg-gray-200 border-0 rounded" />
          </div>
          <div className="text-base font-normal text-low-emphasis">Or continue with</div>
          <div className="flex-1">
            <hr className="h-[2px] bg-gray-200 border-0 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex w-full items-center gap-4">
            <Button variant="outline" className="w-[25%] h-12">
              <img src={googleIcon} width={20} height={20} alt="Google Logo" />
            </Button>
            <Button variant="outline" className="w-[25%] h-12">
              <img src={microsoftIcon} width={20} height={20} alt="microsoft Logo" />
            </Button>
            <Button variant="outline" className="w-[25%] h-12">
              <img src={linkedinIcon} width={20} height={20} alt="linkedin Logo" />
            </Button>

            <Button variant="outline" className="w-[25%] h-12">
              <img src={githubIcon} width={20} height={20} alt="github Logo" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
