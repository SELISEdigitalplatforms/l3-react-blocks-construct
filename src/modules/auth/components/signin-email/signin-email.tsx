import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@/components/ui-kit/form';
import { Input } from '@/components/ui-kit/input';
import { Button } from '@/components/ui-kit/button';
import { useAuthStore } from '@/state/store/auth';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useSigninEmail } from '../../hooks/use-auth';
import { ErrorAlert, PasswordInput } from '@/components/core';

export const SigninEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, setTokens } = useAuthStore();
  const { handleError } = useErrorHandler();

  const form = useForm({
    defaultValues: signinFormDefaultValue,
    resolver: zodResolver(getSigninFormValidationSchema(t)),
  });

  const { isPending, mutateAsync, isError } = useSigninEmail();

  const onSubmitHandler = async (values: signinFormType) => {
    try {
      const res = await mutateAsync({
        username: values.username,
        password: values.password,
      });

      if (res.enable_mfa)
        return navigate(
          `/verify-mfa?mfa_id=${res?.mfaId}&mfa_type=${res?.mfaType}&user_name=${values.username}`
        );

      login(res.access_token ?? '', res.refresh_token ?? '');
      setTokens({ accessToken: res.access_token ?? '', refreshToken: res.refresh_token ?? '' });
      navigate('/');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="w-full">
      <ErrorAlert
        isError={isError}
        title={t('INVALID_CREDENTIALS')}
        message={t('EMAIL_PASSWORD_NOT_VALID')}
      />
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {t('LOG_IN')}
          </Button>
        </form>
      </Form>
    </div>
  );
};
