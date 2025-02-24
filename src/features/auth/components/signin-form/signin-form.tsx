import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SetStateAction, useState } from 'react';

import { signinFormDefaultValue, signinFormType, signinFormValidationSchema } from './utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { UPasswordInput } from '../../../../components/core/u-password-input';
import { useSigninMutation } from '../../hooks/use-auth';
import { useAuthStore } from '../../../../state/store/auth';
import ErrorAlert from '../../../../components/blocks/error-alert/error-alert';
import { ReCaptcha } from '../../../../features/captcha/reCaptcha';

export const SigninForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [captchaToken, setCaptchaToken] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

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
    // Only check for captcha if we're showing it (after 2 failed attempts)
    if (showCaptcha && !captchaToken) {
      // Show error or alert that captcha is required
      return;
    }

    try {
      // Include captcha token with the sign-in request (if available)
      const res = await mutateAsync({
        ...values,
        ...(showCaptcha && { captchaToken }),
      });

      login(res.access_token, res.refresh_token);
      navigate('/');
    } catch (_error) {
      // Increment failed attempts counter
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // Show captcha after 2 failed attempts
      if (newFailedAttempts >= 2 && !showCaptcha) {
        setShowCaptcha(true);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
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
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {showCaptcha && (
            <div className="my-4">
              <ReCaptcha
                siteKey="6LckI90qAAAAAK8RP2t0Nohwii1CeKOETsXPVNQA"
                onVerify={handleCaptchaVerify}
                onExpired={handleCaptchaExpired}
                theme="light"
                size="normal"
                type="reCaptcha"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || (showCaptcha && !captchaToken)}
          >
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
};
