import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
import ErrorAlert from 'components/blocks/error-alert/error-alert';

export const SigninForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const form = useForm<signinFormType>({
    defaultValues: signinFormDefaultValue,
    resolver: zodResolver(signinFormValidationSchema),
  });
  const { isPending, mutateAsync, isError, errorDetails } = useSigninMutation();

  const onSubmitHandler = async (values: signinFormType) => {
    try {
      const res = await mutateAsync(values);
      login(res.access_token, res.refresh_token);
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // Error handling can be added here
    }
  };

  return (
    <div>
      <ErrorAlert isError={isError} title={errorDetails.title} message={errorDetails.message} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-high-emphasis font-normal">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email or username" {...field} />
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
                <FormLabel className="text-high-emphasis font-normal">Password</FormLabel>
                <FormControl>
                  <UPasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="ml-auto inline-block text-sm text-primary hover:text-primary-dark hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex gap-10 mt-6">
            <Button
              className="flex-1 font-extrabold"
              size="lg"
              type="submit"
              loading={isPending}
              disabled={isPending}
            >
              Log in
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
