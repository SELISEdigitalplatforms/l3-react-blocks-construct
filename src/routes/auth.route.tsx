import { SigninPage } from '@/modules/auth/pages/signin/signin-page';
import { ActivationSuccess } from '@/pages/auth/activation-success/activation-success';
import { AuthLayout } from '@/pages/auth/auth-layout';
import { EmailVerification } from '@/pages/auth/email-verification/email-verification';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password/forgot-password';
import { ResetPasswordPage } from '@/pages/auth/reset-password/reset-password';
import { SetPasswordPage } from '@/pages/auth/set-password/set-password';
import { SignupPage } from '@/pages/auth/signup/signup-page';
import { VerificationFailed } from '@/pages/auth/verification-failed/verification-failed';
import { VerifyOtpKey } from '@/pages/auth/verify-otp-key/verify-otp-key';
import { Route } from 'react-router-dom';

export const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<SigninPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/sent-email" element={<EmailVerification />} />
    <Route path="/activate" element={<SetPasswordPage />} />
    <Route path="/resetpassword" element={<ResetPasswordPage />} />
    <Route path="/success" element={<ActivationSuccess />} />
    <Route path="/activate-failed" element={<VerificationFailed />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/verify-key" element={<VerifyOtpKey />} />
  </Route>
);
