import { LoginOption, SOCIAL_AUTH_PROVIDERS } from '@/constant/sso';
import { GRANT_TYPES } from '@/constant/auth';
import SSOSigninCard from '@/modules/auth/components/sso-signin-card/sso-signin-card';
import { Button } from '@/components/ui-kit/button';
import seliseSmallLogo from '@/assets/images/selise_logo_small.svg';

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

  const oidcClickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const oidc = loginOption.oidc;
    if (oidc?.clientId) {
      const oidcUrl = `${import.meta.env.VITE_API_BASE_URL}/authentication/v1/oauth/authorize?X-Blocks-Key=${import.meta.env.VITE_X_BLOCKS_KEY}&client_id=${oidc.clientId}&redirect_uri=${oidc.redirectUrl}&response_type=code"`;
      window.location.href = oidcUrl;
    }
  };

  return (
    <>
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
      {loginOption.oidc?.clientId && (
        <Button
          className="w-full h-12 font-bold mt-4"
          variant={'outline'}
          onClick={oidcClickHandler}
        >
          <img src={seliseSmallLogo} width={25} height={25} alt="Blocks logo" className="mr-2" />
          Log in with Blocks
        </Button>
      )}
    </>
  );
};
