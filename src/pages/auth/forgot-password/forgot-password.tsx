import { ForgotpasswordForm } from 'features/auth/components/forgot-password';
import logo from 'assets/images/selise_Blocks_logo.svg';

export function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-32 h-14 mb-2">
        <img src={logo} alt="logo" className="w-full h-full" />
      </div>
      <div>
        <div className="text-2xl font-bold text-high-emphasis">Forgot Your Password?</div>
        <div className="flex gap-1 mt-1">
          <div className="text-sm font-normal text-medium-emphasis">
            Enter your registered email address, and we’ll send you instructions to reset your
            password.
          </div>
        </div>
      </div>
      <ForgotpasswordForm />
    </div>
  );
}
