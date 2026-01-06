import { LoginOption, SOCIAL_AUTH_PROVIDERS } from '@/constant/sso';
import { GRANT_TYPES } from '@/constant/auth';
import SSOSigninCard from '@/modules/auth/components/sso-signin-card/sso-signin-card';

type SsoSigninProps = {
  loginOption: LoginOption;
};

export const SsoSignin = ({ loginOption }: Readonly<SsoSigninProps>) => {
  const socialGrantAllowed = loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.social);

  if (!socialGrantAllowed) {
    return null;
  }

  // Map all providers and check if they have API configuration
  const allProviders = Object.values(SOCIAL_AUTH_PROVIDERS).map((provider) => {
    const ssoInfo = loginOption.ssoInfo?.find((s) => s.provider === provider.value);
    return {
      ...provider,
      audience: ssoInfo?.audience ?? '',
      provider: ssoInfo?.provider ?? provider.value,
      isAvailable: !!ssoInfo,
    };
  });

  // Only show providers that are configured in the backend
  const providersToShow = allProviders.filter((provider) => provider.isAvailable);

  if (providersToShow.length === 0) {
    return null;
  }

  const isSingleProvider = providersToShow.length === 1;

  return (
    <div className={`flex w-full items-center ${isSingleProvider ? 'justify-center' : 'gap-4'}`}>
      {providersToShow.map((item) => (
        <SSOSigninCard
          key={item?.value}
          providerConfig={item}
          showText={isSingleProvider}
          totalProviders={providersToShow.length}
        />
      ))}
    </div>
  );
};
