import { BasePasswordForm } from 'components/blocks/base-password-form/base-password-form';
import { useAccountActivation } from '../../hooks/use-auth';
import { setPasswordFormDefaultValue, setPasswordFormValidationSchema } from './utils';

export const SetpasswordForm = ({ code }: { code: string }) => {
  const { isPending, mutateAsync } = useAccountActivation();

  const handleSubmit = async (password: string, code: string) => {
    await mutateAsync({ password, code });
  };

  return (
    <BasePasswordForm
      code={code}
      onSubmit={handleSubmit}
      validationSchema={setPasswordFormValidationSchema}
      defaultValues={setPasswordFormDefaultValue}
      isPending={isPending}
    />
  );
};
