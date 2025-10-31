import { useTranslation } from 'react-i18next';
import { GRANT_TYPES } from '@/constant/auth';
import { LoginOption } from '@/constant/sso';
import { Divider } from '@/components/core';
import { SsoSignin } from '../../pages/signin/signin-sso';
import { SigninEmail } from '../signin-email';

type SigninProps = {
  loginOption?: LoginOption;
};

export const Signin = ({ loginOption }: SigninProps) => {
  const { t } = useTranslation();
  const passwordGrantAllowed = !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.password);
  const socialGrantAllowed = !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.social);

  return (
    <div className="w-full">
      {passwordGrantAllowed && <SigninEmail />}
      {passwordGrantAllowed && socialGrantAllowed && (
        <div className="my-6">
          <Divider text={t('AUTH_OR')} />
        </div>
      )}
      {socialGrantAllowed && loginOption && <SsoSignin loginOption={loginOption} />}
    </div>
  );
};
