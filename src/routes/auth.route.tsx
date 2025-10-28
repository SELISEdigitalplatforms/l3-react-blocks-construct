import { SigninPage } from '@/modules/auth/pages/signin/signin-page';
import { ActivationSuccessPage } from '@/modules/auth/pages/activation-success';
import { AuthLayout } from '@/pages/auth/auth-layout';
import { EmailSentPage } from '@/modules/auth/pages/email-sent';
import { ForgotPasswordPage } from '@/modules/auth/pages/forgot-password';
import { ResetPasswordPage } from '@/pages/auth/reset-password/reset-password';
import { AccountActivationPage } from '@/modules/auth/pages/account-activation';
import { SignupPage } from '@/modules/auth/pages/signup';
import { VerificationFailed } from '@/modules/auth/pages/verification-failed/verification-failed';
import { Route } from 'react-router-dom';
import { VerifyMfaPage } from '@/modules/auth/pages/verify-mfa';

export const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<SigninPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/sent-email" element={<EmailSentPage />} />
    <Route path="/activate" element={<AccountActivationPage />} />
    <Route path="/resetpassword" element={<ResetPasswordPage />} />
    <Route path="/success" element={<ActivationSuccessPage />} />
    <Route path="/activate-failed" element={<VerificationFailed />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/verify-mfa" element={<VerifyMfaPage />} />
  </Route>
);
