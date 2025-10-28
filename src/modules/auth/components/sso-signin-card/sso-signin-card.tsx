import { useNavigate } from 'react-router-dom';
import { SocialAuthProvider, SSO_PROVIDERS } from '@/constant/sso';
import { SSOservice, SSOLoginResponse } from '../../services/sso.service';
import { Button } from '@/components/ui-kit/button';

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
  const navigate = useNavigate();

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
        const errorMsg = 'Provider configuration is incomplete';
        console.error('[SSO] Error:', errorMsg, {
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

      const res: SSOLoginResponse = await ssoService.getSocialLoginEndpoint(requestPayload);

      if (res.error) {
        console.error('[SSO] Authentication error:', res.error);
        return alert(`Authentication error: ${res.error}`);
      }

      // Handle MFA required case
      if (res.requiresMfa && res.mfaToken && res.mfaType !== undefined) {
        const redirectUrl = `/verify-mfa?mfa_id=${res.mfaToken}&mfa_type=${res.mfaType}&user_name=${encodeURIComponent(res.email ?? '')}&sso=true`;
        navigate(redirectUrl);
        return;
      }

      // Regular SSO flow
      if (!res.providerUrl) {
        return alert('No redirect URL received from the authentication service.');
      }
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
