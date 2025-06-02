import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  forgotPasswordFormDefaultValue,
  forgotPasswordFormType,
  getForgotPasswordFormValidationSchema,
} from './utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { useForgotPassword } from '../../hooks/use-auth';
import { Button } from 'components/ui/button';
import { SetStateAction, useRef, useState, useEffect } from 'react';
import { CaptchaRef } from 'features/captcha/index.type';
import { Captcha } from 'features/captcha';
import { useTranslation } from 'react-i18next';

/**
 * ForgotPasswordForm Component
 *
 * A form component that handles the password recovery process with email validation,
 * reCAPTCHA integration, and form submission handling.
 *
 * Features:
 * - Email input with validation
 * - Dynamic reCAPTCHA display based on email input status
 * - Form state management with React Hook Form and Zod validation
 * - Asynchronous form submission with loading state
 * - Error handling with captcha reset
 * - Navigation to confirmation page on successful submission
 * - Conditional button enabling based on form validity
 *
 * @returns {JSX.Element} The rendered form component with email input, captcha, and action buttons
 *
 * @example
 * // Basic usage
 * <ForgotPasswordForm />
 *
 * // Within a password recovery page
 * <div className="auth-container">
 *   <h1>Reset Password</h1>
 *   <p>Enter your email to receive a password reset link</p>
 *   <ForgotPasswordForm />
 * </div>
 */

export const ForgotpasswordForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const form = useForm<forgotPasswordFormType>({
    defaultValues: forgotPasswordFormDefaultValue,
    resolver: zodResolver(getForgotPasswordFormValidationSchema(t)),
  });
  const { isPending, mutateAsync } = useForgotPassword();

  const captchaRef = useRef<CaptchaRef>(null);

  const resetCaptcha = () => {
    captchaRef.current?.reset();
  };

  const [captchaToken, setCaptchaToken] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);

  const googleSiteKey = process.env.REACT_APP_CAPTCHA_SITE_KEY ?? '';

  const captchaEnabled = googleSiteKey !== '';

  const emailValue = form.watch('email');

  useEffect(() => {
    if (emailValue && emailValue.trim() !== '') {
      setShowCaptcha(true);
    } else {
      setShowCaptcha(false);
    }
  }, [emailValue]);

  const handleCaptchaVerify = (token: SetStateAction<string>) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken('');
  };

  const onSubmitHandler = async (values: forgotPasswordFormType) => {
    if (captchaEnabled && showCaptcha && !captchaToken) {
      return;
    }

    try {
      await mutateAsync({
        email: values.email,
        captchaCode: captchaToken || '',
      });

      navigate('/sent-email');
    } catch (_error) {
      resetCaptcha();
    }
  };

  const emailError = form.formState.errors.email;

  const isEmailValid = emailValue && emailValue.trim() !== '' && !emailError;

  const isButtonDisabled =
    isPending || !isEmailValid || (captchaEnabled && showCaptcha && !captchaToken);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmitHandler)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-high-emphasis font-normal">{t('EMAIL')}</FormLabel>
              <FormControl>
                <Input placeholder={t('ENTER_YOUR_EMAIL')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {captchaEnabled && showCaptcha && (
          <div className="my-4">
            <Captcha
              type={process.env.REACT_APP_CAPTCHA_TYPE === 'reCaptcha' ? 'reCaptcha' : 'hCaptcha'}
              siteKey={googleSiteKey}
              theme="light"
              onVerify={handleCaptchaVerify}
              onExpired={handleCaptchaExpired}
              size="normal"
            />
          </div>
        )}

        <Button
          className="font-extrabold mt-4"
          size="lg"
          type="submit"
          loading={isPending}
          disabled={isButtonDisabled}
        >
          {t('SEND_RESET_LINK')}
        </Button>
        <Link to={'/login'}>
          <Button className="font-extrabold text-primary w-full" size="lg" variant="ghost">
            {t('GO_TO_LOGIN')}
          </Button>
        </Link>
      </form>
    </Form>
  );
};
