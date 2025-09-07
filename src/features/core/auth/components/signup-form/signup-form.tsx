import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { signupFormDefaultValue, signupFormType, getSignupFormValidationSchema } from './utils';
import { UCheckbox } from 'components/core/uCheckbox';
import { useTranslation } from 'react-i18next';

/**
 * SignupForm Component
 *
 * A user registration form component that collects username (email) and handles user registration.
 * It ensures basic validation using a Zod schema for secure form submission.
 *
 * Features:
 * - Username (email) field with validation
 * - Form validation using Zod and React Hook Form
 * - Terms of Service and Privacy Policy acknowledgement checkbox
 * - Loading state handling during async submission
 *
 * @returns {JSX.Element} The rendered signup form with validation
 *
 * @example
 * // Basic usage
 * <SignupForm />
 *
 * // Within a registration page
 * <div className="auth-container">
 *   <h1>Create Your Account</h1>
 *   <SignupForm />
 *   <div className="auth-footer">
 *     <p>Already have an account? <Link to="/signin">Sign in</Link></p>
 *   </div>
 * </div>
 */

export const SignupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const form = useForm<signupFormType>({
    defaultValues: signupFormDefaultValue,
    resolver: zodResolver(getSignupFormValidationSchema(t)),
  });

  const onSubmitHandler = async () => {
    setIsSubmitting(true);
    try {
      // Handle sign-up request
      // await signupMutation(values);
      // Handle successful signup
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmitHandler)}>
        <FormField
          control={form.control}
          name="username"
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

        <div className="flex justify-between items-center">
          <UCheckbox
            label={
              <>
                {t('I_AGREE_TO')}{' '}
                <span className="text-primary underline hover:text-primary-600">
                  <a href="https://selisegroup.com/software-development-terms/">
                    {t('TERM_OF_SERVICE')}
                  </a>
                </span>{' '}
                {t('ACKNOWLEDGE_I_HAVE_READ')}{' '}
                <span className="text-primary underline hover:text-primary-600">
                  <a href="https://selisegroup.com/privacy-policy/">{t('PRIVACY_POLICY')}</a>
                </span>
              </>
            }
            labelClassName="text-medium-emphasis font-normal mt-5 leading-5"
          />
        </div>

        <div className="flex gap-10 mt-2">
          <Button className="flex-1 font-extrabold" size="lg" type="submit" disabled={isSubmitting}>
            {t('SIGN_UP')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
