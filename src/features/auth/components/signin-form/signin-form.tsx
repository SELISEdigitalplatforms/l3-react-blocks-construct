import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SetStateAction, useState } from 'react';

import { signinFormDefaultValue, signinFormType, signinFormValidationSchema } from './utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { UPasswordInput } from 'components/core/u-password-input';
import { Captcha } from 'features/captcha';
import { useAuthStore } from 'state/store/auth';
import { useToast } from 'hooks/use-toast';
import { useSigninMutation } from '../../hooks/use-auth';
import ErrorAlert from '../../../../components/blocks/error-alert/error-alert';
import { SignInResponse } from '../../services/auth.service';

/**
 * SigninForm Component
 *
 * A comprehensive login form component that handles user authentication with email and password,
 * supports two-factor authentication flow, and implements CAPTCHA protection after failed attempts.
 *
 * Features:
 * - Email and password authentication
 * - Form validation with Zod schema
 * - Progressive security with CAPTCHA after 3 failed login attempts
 * - Two-factor authentication (2FA/MFA) integration
 * - Error handling with alert display
 * - Navigation to relevant routes based on authentication status
 * - Success notification via toast
 * - "Forgot password" link
 *
 * @returns {JSX.Element} The rendered login form with validation and security features
 *
 * @example
 * // Basic usage
 * <SigninForm />
 *
 * // Within an authentication page
 * <div className="auth-container">
 *   <h1>Welcome Back</h1>
 *   <SigninForm />
 *   <div className="auth-footer">
 *     <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
 *   </div>
 * </div>
 */

export const SigninForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [captchaToken, setCaptchaToken] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const googleSiteKey = process.env.REACT_APP_GOOGLE_SITE_KEY || '';

  // Check if captcha is enabled (site key is not empty)
  const captchaEnabled = googleSiteKey !== '';

  const form = useForm({
    defaultValues: signinFormDefaultValue,
    resolver: zodResolver(signinFormValidationSchema),
  });

  const { isPending, mutateAsync, isError, errorDetails } = useSigninMutation();

  const handleCaptchaVerify = (token: SetStateAction<string>) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken('');
  };

  const onSubmitHandler = async (values: signinFormType) => {
    if (captchaEnabled && showCaptcha && !captchaToken) {
      return;
    }

    try {
      const res = (await mutateAsync({
        grantType: 'password',
        username: values.username,
        password: values.password,
      })) as SignInResponse;

      if (res?.enable_mfa) {
        navigate(
          `/verify-key?mfa_id=${res?.mfaId}&mfa_type=${res?.mfaType}&user_name=${values.username}`
        );
      } else {
        login(res.access_token, res.refresh_token);
        navigate('/');
        toast({
          variant: 'success',
          title: 'Success',
          description: 'You are successfully logged in',
        });
      }
    } catch (_error) {
      if (captchaEnabled) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);

        if (newFailedAttempts >= 3 && !showCaptcha) {
          setShowCaptcha(true);
        }
      }
    }
  };

  return (
    <div className="w-full">
      <ErrorAlert isError={isError} title={errorDetails.title} message={errorDetails.message} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <UPasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {captchaEnabled && showCaptcha && (
            <div className="my-4">
              <Captcha
                type="reCaptcha"
                siteKey={googleSiteKey}
                theme="light"
                onVerify={handleCaptchaVerify}
                onExpired={handleCaptchaExpired}
                size="normal"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || (captchaEnabled && showCaptcha && !captchaToken)}
          >
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
};
