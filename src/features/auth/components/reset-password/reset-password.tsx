import { BasePasswordForm } from '../../../../components/blocks/base-password-form/base-password-form';
import { useResetPassword } from '../../hooks/use-auth';
import { resetPasswordFormDefaultValue, resetPasswordFormValidationSchema } from './utils';

export const ResetpasswordForm = ({ code }: { code: string }) => {
  const { isPending, mutateAsync } = useResetPassword();

  const handleSubmit = async (password: string, code: string) => {
    await mutateAsync({ password, code });
  };

  return (
    <BasePasswordForm
      code={code}
      onSubmit={handleSubmit}
      validationSchema={resetPasswordFormValidationSchema}
      defaultValues={resetPasswordFormDefaultValue}
      isPending={isPending}
    />
  );
};
