import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Button } from 'components/ui/button';
import { UPasswordInput } from 'components/core/u-password-input';
import { SharedPasswordStrengthChecker } from '../core/shared-password-strength-checker';

interface BasePasswordFormProps {
  code: string;
  onSubmit: (password: string, code: string) => Promise<void>;
  validationSchema: z.ZodSchema;
  defaultValues: {
    password: string;
    confirmPassword: string;
  };
  isPending: boolean;
}

export const BasePasswordForm: React.FC<BasePasswordFormProps> = ({
  code,
  onSubmit,
  validationSchema,
  defaultValues,
  isPending,
}) => {
  const navigate = useNavigate();
  const [requirementsMet, setRequirementsMet] = useState(false);

  const form = useForm({
    defaultValues,
    resolver: zodResolver(validationSchema),
  });

  const onSubmitHandler = async (values: { password: string; confirmPassword: string }) => {
    try {
      await onSubmit(values.password, code);
      navigate('/success');
    } catch (_error) {
      // Error handling can be added here
    }
  };

  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmitHandler)}>
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-high-emphasis font-normal">Confirm Password</FormLabel>
              <FormControl>
                <UPasswordInput placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SharedPasswordStrengthChecker
          password={password}
          confirmPassword={confirmPassword}
          onRequirementsMet={setRequirementsMet}
        />

        <div className="flex gap-10 mt-5">
          <Button
            className="flex-1 font-extrabold"
            size="lg"
            type="submit"
            loading={isPending}
            disabled={isPending || !requirementsMet}
          >
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
};
