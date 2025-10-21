import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import { z } from 'zod';
import { BasePasswordForm } from '@/components/core';

const passwordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const meta: Meta<typeof BasePasswordForm> = {
  title: 'Block Components/BasePasswordForm',
  component: BasePasswordForm,
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'A form component for password creation/reset that includes validation, strength checking, and optional CAPTCHA verification for enhanced security.',
      },
    },
  },
  argTypes: {
    code: { control: 'text' },
    isPending: { control: 'boolean' },
    isCaptchaValid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof BasePasswordForm>;

const DefaultComponent = (args: any) => {
  const [isPending, setIsPending] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleSubmit = async (_password: string, code: string, captchaToken?: string) => {
    setIsPending(true);
    // Do NOT log or use real passwords in code. This is a placeholder for demonstration only.
    const maskedPassword = '********';
    // eslint-disable-next-line no-console
    console.log('Form submitted:', {
      password: maskedPassword, // never log real passwords
      code,
      captchaToken: captchaToken ? '***' : undefined,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPending(false);
    alert('Password form submitted successfully!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Create New Password</h2>
      <BasePasswordForm
        {...args}
        code="reset123"
        onSubmit={handleSubmit}
        validationSchema={passwordSchema}
        defaultValues={{
          password: '',
          confirmPassword: '',
        }}
        isPending={isPending}
        isCaptchaValid={isCaptchaValid}
        onCaptchaValidation={setIsCaptchaValid}
      />
    </div>
  );
};

export const Default: Story = {
  render: DefaultComponent,
};

const WithCodeComponent = (args: any) => {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (password: string, code: string, captchaToken?: string) => {
    setIsPending(true);
    // eslint-disable-next-line no-console
    console.log('Password reset with code:', {
      code,
      hasPassword: !!password,
      hasCaptcha: !!captchaToken,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPending(false);
    alert(`Password reset completed for code: ${code}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Reset Password</h2>
      <BasePasswordForm
        {...args}
        code="pwd-reset-789"
        onSubmit={handleSubmit}
        validationSchema={passwordSchema}
        defaultValues={{
          password: '',
          confirmPassword: '',
        }}
        isPending={isPending}
      />
    </div>
  );
};

export const WithCode: Story = {
  render: WithCodeComponent,
};

export const Loading: Story = {
  render: (args) => {
    const handleSubmit = async () => {
      // This won't be called since isPending is true
    };

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Processing...</h2>
        <BasePasswordForm
          {...args}
          code="loading123"
          onSubmit={handleSubmit}
          validationSchema={passwordSchema}
          // Do NOT use real passwords in code. This is a placeholder for demonstration only.
          defaultValues={{
            password: '', // intentionally left blank for security
            confirmPassword: '',
          }}
          isPending={true}
        />
      </div>
    );
  },
};
