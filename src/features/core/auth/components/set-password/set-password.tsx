import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasePasswordForm } from 'components/blocks/base-password-form/base-password-form';
import { useAccountActivation } from '../../hooks/use-auth';
import { setPasswordFormDefaultValue, getSetPasswordFormValidationSchema } from './utils';

/**
 * SetPasswordForm Component
 *
 * A wrapper component that handles the account activation and password setting process
 * by connecting the account activation API mutation with a base password form component.
 *
 * Features:
 * - Integrates account activation API with form submission
 * - Manages CAPTCHA validation state
 * - Passes loading state to the base form
 * - Handles form submission with password, verification code, and CAPTCHA token
 * - Delegates validation and UI rendering to the BasePasswordForm
 *
 * @param {Object} props - Component props
 * @param {string} props.code - Verification code for account activation
 *
 * @returns {JSX.Element} The rendered password setting form with CAPTCHA
 *
 * @example
 * // Basic usage with activation code from URL params
 * const { code } = useParams();
 * <SetPasswordForm code={code || ''} />
 *
 * // With explicit activation code
 * <SetPasswordForm code="abc123def456" />
 */

export const SetpasswordForm = ({ code }: { code: string }) => {
  const { t } = useTranslation();
  const { isPending, mutateAsync } = useAccountActivation();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  // Check if captcha is enabled
  const captchaEnabled = (process.env.REACT_APP_CAPTCHA_SITE_KEY ?? '') !== '';

  const handleSubmit = async (password: string, code: string, captchaToken?: string) => {
    if (captchaEnabled && !captchaToken) {
      return;
    }

    await mutateAsync({
      password,
      code,
      captchaCode: captchaToken ?? '',
    });
  };

  const handleCaptchaValidation = (isValid: boolean) => {
    setIsCaptchaValid(isValid);
  };

  return (
    <BasePasswordForm
      code={code}
      onSubmit={handleSubmit}
      validationSchema={getSetPasswordFormValidationSchema(t)}
      defaultValues={setPasswordFormDefaultValue}
      isPending={isPending}
      isCaptchaValid={isCaptchaValid}
      onCaptchaValidation={handleCaptchaValidation}
    />
  );
};
