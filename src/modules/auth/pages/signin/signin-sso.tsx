import { LoginOption, SOCIAL_AUTH_PROVIDERS } from '@/constant/sso';
import { GRANT_TYPES } from '@/constant/auth';
import SSOSigninCard from '@/modules/auth/components/sso-signin-card/sso-signin-card';

type SsoSigninProps = {
  loginOption: LoginOption;
};

export const SsoSignin = ({ loginOption }: SsoSigninProps) => {
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

  // Providers without API configuration will be disabled
  const providersToShow = allProviders;

  // Check if we have at least one configured provider
  const hasAnyConfiguredProvider = allProviders.some((provider) => provider.isAvailable);

  if (!hasAnyConfiguredProvider) {
    return null;
  }

  const isSingleProvider = providersToShow.length === 1;

  return (
    <div className="flex items-center gap-8">
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
    </div>
  );
};
