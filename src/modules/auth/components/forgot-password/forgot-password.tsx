import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  forgotPasswordFormDefaultValue,
  forgotPasswordFormType,
  getForgotPasswordFormValidationSchema,
} from './utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui-kit/form';
import { Input } from '@/components/ui-kit/input';
import { useForgotPassword } from '../../hooks/use-auth';
import { Button } from '@/components/ui-kit/button';
import { Captcha, useCaptcha } from '@/components/core';

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
 */

export const ForgotpasswordForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<forgotPasswordFormType>({
    defaultValues: forgotPasswordFormDefaultValue,
    resolver: zodResolver(getForgotPasswordFormValidationSchema(t)),
  });

  const { isPending, mutateAsync } = useForgotPassword();

  const [showCaptcha, setShowCaptcha] = useState(false);

  const googleSiteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY || '';
  const captchaEnabled = googleSiteKey !== '';

  const captchaType =
    import.meta.env.VITE_CAPTCHA_TYPE === 'reCaptcha' ? 'reCaptcha-v2-checkbox' : 'hCaptcha';

  const {
    code: captchaToken,
    reset: resetCaptcha,
    captcha,
  } = useCaptcha({
    siteKey: googleSiteKey,
    type: captchaType,
  });

  const emailValue = form.watch('email');

  useEffect(() => {
    if (emailValue && emailValue.trim() !== '') {
      setShowCaptcha(true);
    } else {
      setShowCaptcha(false);
    }
  }, [emailValue]);

  const onSubmitHandler = async (values: forgotPasswordFormType) => {
    if (captchaEnabled && showCaptcha && !captchaToken) return;
    try {
      const res = await mutateAsync({
        email: values.email,
        captchaCode: captchaToken || '',
        projectKey: import.meta.env.VITE_X_BLOCKS_KEY || '',
      });
      if (res.isSuccess) navigate('/sent-email');
    } catch (_error) {
      resetCaptcha();
    }
  };

  const isButtonDisabled = isPending || (captchaEnabled && showCaptcha && !captchaToken);

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

        {captchaEnabled && showCaptcha && <Captcha {...captcha} theme="light" size="normal" />}

        <Button
          className="font-extrabold mt-4"
          size="lg"
          type="submit"
          loading={isPending}
          disabled={isButtonDisabled}
        >
          {t('SEND_RESET_LINK')}
        </Button>
      </form>
    </Form>
  );
};
