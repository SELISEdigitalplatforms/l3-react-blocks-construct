import { GRANT_TYPES } from '@/constant/auth';
import { LoginOption } from '@/constant/sso';
import { SsoSignin } from '../../pages/signin/signin-sso';
import { SigninEmail } from '../signin-email';
import { Divider } from '@/components/core';
import { useTranslation } from 'react-i18next';

type SigninProps = {
  loginOption?: LoginOption;
};

export const Signin = ({ loginOption }: SigninProps) => {
  const { t } = useTranslation();
  const passwordGrantAllowed =
    loginOption && loginOption.allowedGrantTypes?.includes(GRANT_TYPES.password);
  const socialGrantAllowed =
    loginOption && loginOption.allowedGrantTypes?.includes(GRANT_TYPES.social);

  return (
    <div className="w-full">
      {passwordGrantAllowed && <SigninEmail />}
      {passwordGrantAllowed && socialGrantAllowed && (
        <div className="my-6">
          <Divider text={t('AUTH_OR')} />
        </div>
      )}
      {socialGrantAllowed && <SsoSignin loginOption={loginOption} />}
    </div>
  );
};
