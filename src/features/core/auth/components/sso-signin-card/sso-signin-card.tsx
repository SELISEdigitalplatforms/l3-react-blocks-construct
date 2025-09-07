/* eslint-disable @typescript-eslint/no-unused-vars */
import { SocialAuthProvider, SSO_PROVIDERS } from 'constant/sso';
import { SSOservice } from '../../services/sso.service';
import { Button } from 'components/ui/button';

type SSOSigninCardProps = {
  providerConfig: SocialAuthProvider & {
    audience: string;
    provider: SSO_PROVIDERS;
    isAvailable: boolean;
  };
  showText?: boolean;
  totalProviders?: number;
};

const SSOSigninCard = ({
  providerConfig,
  showText = false,
  totalProviders = 1,
}: SSOSigninCardProps) => {
  const ssoService = new SSOservice();

  const getButtonWidth = () => {
    if (showText) return 'w-full';

    switch (totalProviders) {
      case 2:
        return 'w-1/2';
      case 3:
        return 'w-1/3';
      case 4:
        return 'w-1/4';
      default:
        return 'w-full';
    }
  };

  const onClickHandler = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      if (!providerConfig.isAvailable) {
        return;
      }

      if (!providerConfig?.audience || !providerConfig?.provider) {
        console.error('Missing required provider config:', {
          audience: providerConfig?.audience,
          provider: providerConfig?.provider,
          fullConfig: providerConfig,
        });
        alert('Provider configuration is incomplete. Please check the setup.');
        return;
      }

      const requestPayload = {
        provider: providerConfig.provider,
        audience: providerConfig.audience,
        sendAsResponse: true,
      };

      const res = await ssoService.getSocialLoginEndpoint(requestPayload);

      if (res.error) return alert(`Authentication error: ${res.error}`);

      if (!res?.providerUrl)
        return alert('No redirect URL received from the authentication service.');

      window.location.href = res.providerUrl;
    } catch (error) {
      console.error('=== UNEXPECTED ERROR ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Button
      variant="outline"
      className={`${getButtonWidth()} h-12`}
      onClick={onClickHandler}
      disabled={!providerConfig.isAvailable}
      data-state={providerConfig.isAvailable ? 'enabled' : 'disabled'}
    >
      <img
        src={providerConfig.imageSrc}
        width={20}
        height={20}
        alt={`${providerConfig.label} logo`}
        className={`${!providerConfig.isAvailable ? 'opacity-50' : ''} ${showText ? 'mr-2 font-bold' : ''}`}
      />
      {showText && `Log in with ${providerConfig.label}`}
    </Button>
  );
};

export default SSOSigninCard;
