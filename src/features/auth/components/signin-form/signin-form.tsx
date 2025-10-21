import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signinFormDefaultValue, signinFormType, getSigninFormValidationSchema } from './utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ErrorAlert, LoadingOverlay, PasswordInput } from '@/components/shared';
import { Captcha } from '@/features/captcha';
import { useAuthStore } from '@/state/store/auth';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useSigninMutation } from '../../hooks/use-auth';
import { SignInResponse } from '../../services/auth.service';
import { SsoSignin } from '@/pages/auth/signin/signin-sso';
import { GRANT_TYPES } from '@/constant/auth';
import { LoginOption } from '@/constant/sso';

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

type SigninProps = {
  loginOption?: LoginOption;
};

export const SigninForm = ({ loginOption }: SigninProps) => {
  const [searchParams] = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const isFirstTimeCall = useRef<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const { handleError } = useErrorHandler();
  const [captchaToken, setCaptchaToken] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const googleSiteKey =
    import.meta.env.VITE_CAPTCHA_SITE_KEY || import.meta.env.REACT_APP_CAPTCHA_SITE_KEY || '';

  const captchaEnabled = googleSiteKey !== '';

  const form = useForm({
    defaultValues: signinFormDefaultValue,
    resolver: zodResolver(getSigninFormValidationSchema(t)),
  });

  const { isPending, mutateAsync, isError } = useSigninMutation();

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
      }
    } catch (error) {
      if (captchaEnabled) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);

        if (newFailedAttempts >= 3 && !showCaptcha) {
          setShowCaptcha(true);
        }
      }
      handleError(error);
    }
  };

  const passwordGrantAllowed = loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.password);
  const socialGrantAllowed = loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.social);

  const signin = useCallback(
    async (code: string, state: string) => {
      try {
        const res = (await mutateAsync({ grantType: 'social', code, state })) as SignInResponse;

        // Check if MFA is enabled for this user (same logic as password signin)
        if (res?.enable_mfa) {
          // For SSO, we use the state parameter or a generic identifier since email is not in the response
          const userIdentifier = state || 'sso_user';
          navigate(
            `/verify-key?mfa_id=${res?.mfaId}&mfa_type=${res?.mfaType}&user_name=${encodeURIComponent(userIdentifier)}&sso=true`
          );
        } else {
          login(res.access_token, res.refresh_token);
          navigate('/');
        }
      } catch (error) {
        handleError(error);
      }
    },
    [login, mutateAsync, navigate, handleError]
  );

  useEffect(() => {
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (code && state && isFirstTimeCall.current) {
      isFirstTimeCall.current = false;
      setIsSigningIn(true);

      signin(code, state)
        .then(() => {
          setIsSigningIn(false);
        })
        .catch((error) => {
          console.error('Signin failed:', error);
          setIsSigningIn(false);
        });
    }
  }, [searchParams, signin]);

  if (isSigningIn) {
    return <LoadingOverlay />;
  }

  return (
    <div className="w-full">
      <ErrorAlert
        isError={isError}
        title={t('INVALID_CREDENTIALS')}
        message={t('EMAIL_PASSWORD_NOT_VALID')}
      />

      {/* Only render the form if password grant type is allowed */}
      {passwordGrantAllowed && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('EMAIL')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('ENTER_YOUR_EMAIL')} {...field} />
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
                  <FormLabel>{t('PASSWORD')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t('ENTER_YOUR_PASSWORD')} {...field} />
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
                {t('FORGOT_PASSWORD')}
              </Link>
            </div>

            {captchaEnabled && showCaptcha && (
              <div className="my-4">
                <Captcha
                  type={
                    (import.meta.env.VITE_CAPTCHA_TYPE ||
                      import.meta.env.REACT_APP_CAPTCHA_TYPE) === 'reCaptcha'
                      ? 'reCaptcha'
                      : 'hCaptcha'
                  }
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
              {t('LOG_IN')}
            </Button>
          </form>
        </Form>
      )}

      {socialGrantAllowed && loginOption && <SsoSignin loginOption={loginOption} />}
    </div>
  );
};
