import { useTranslation } from 'react-i18next';
import { BasePasswordForm } from '@/components/core';
import { useResetPassword } from '../../hooks/use-auth';
import { resetPasswordFormDefaultValue, getResetPasswordFormValidationSchema } from './utils';

/**
 * ResetPasswordForm Component
 *
 * A wrapper component that handles the reset password functionality by connecting
 * the reset password API mutation with a base password form component.
 *
 * Features:
 * - Handles reset password API integration
 * - Passes loading state to the base form
 * - Manages form submission with password and verification code
 * - Delegates validation and UI rendering to the BasePasswordForm
 *
 * @param {Object} props - Component props
 * @param {string} props.code - Verification code from the reset password link
 *
 * @example
 * // Basic usage with reset code from URL params
 * const { code } = useParams();
 * <ResetPasswordForm code={code || ''} />
 *
 * // With explicit reset code
 * <ResetPasswordForm code="abc123def456" />
 */

export const ResetpasswordForm = ({ code }: { code: string }) => {
  const { t } = useTranslation();
  const { isPending, mutateAsync } = useResetPassword();

  const handleSubmit = async (password: string, code: string) => {
    await mutateAsync({ password, code });
  };

  return (
    <BasePasswordForm
      code={code}
      onSubmit={handleSubmit}
      validationSchema={getResetPasswordFormValidationSchema(t)}
      defaultValues={resetPasswordFormDefaultValue}
      isPending={isPending}
    />
  );
};
