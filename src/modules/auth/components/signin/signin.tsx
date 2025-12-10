import { useTranslation } from 'react-i18next';
import { GRANT_TYPES } from '@/constant/auth';
import { LoginOption } from '@/constant/sso';
import { Divider } from '@/components/core';
import { SsoSignin } from '../../pages/signin/signin-sso';
import { SigninEmail } from '../signin-email';

type SigninProps = {
  loginOption?: LoginOption;
};

export const Signin = ({ loginOption }: Readonly<SigninProps>) => {
  const { t } = useTranslation();
  const passwordGrantAllowed = !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.password);
  const socialOrOidcGrantAllowed = !!loginOption?.ssoInfo?.length || !!loginOption?.oidc?.clientId;

  return (
    <div className="w-full">
      {passwordGrantAllowed && <SigninEmail />}
      {passwordGrantAllowed && socialOrOidcGrantAllowed && (
        <div className="my-6">
          <Divider text={t('AUTH_OR')} />
        </div>
      )}
      {socialOrOidcGrantAllowed && loginOption && <SsoSignin loginOption={loginOption} />}
    </div>
  );
};
