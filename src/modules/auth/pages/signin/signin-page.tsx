import { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import darklogo from '@/assets/images/construct_logo_dark.svg';
import lightlogo from '@/assets/images/construct_logo_light.svg';
import { useTheme } from '@/styles/theme/theme-provider';
import { useAuthStore } from '@/state/store/auth';
import { useGetLoginOptions, useSigninMutation } from '../../hooks/use-auth';
import { SignInResponse } from '../../services/auth.service';
import { LoadingOverlay } from '@/components/core/loading-overlay/loading-overlay';
import { Signin } from '@/modules/auth/components/signin';

const blocksOIdCClientId = import.meta.env.VITE_BLOCKS_OIDC_CLIENT_ID;
const oidcRedirectUri = import.meta.env.VITE_BLOCKS_OIDC_REDIRECT_URI;

export const SigninPage = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data } = useGetLoginOptions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutateAsync: signinMutate } = useSigninMutation<'social'>();
  const { login, setTokens } = useAuthStore();
  const isExchangingRef = useRef(false);

  // Handle SSO callback parameters
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const isSSOCallback = !!(code && state);

  useEffect(() => {
    if (code && state && !isExchangingRef.current) {
      isExchangingRef.current = true;

      (async () => {
        try {
          const res = (await signinMutate({
            grantType: 'social',
            code,
            state,
          })) as SignInResponse;

          if (res.enable_mfa) {
            navigate(`/verify-mfa?mfa_id=${res.mfaId}&mfa_type=${res.mfaType}&sso=true`, {
              replace: true,
            });
            return;
          }

          login(res.access_token ?? '', res.refresh_token ?? '');
          setTokens({ accessToken: res.access_token ?? '', refreshToken: res.refresh_token ?? '' });
          navigate('/', { replace: true });
        } catch (error) {
          navigate('/login', { replace: true });
        } finally {
          isExchangingRef.current = false;
        }
      })();
    }
  }, [code, state, searchParams, signinMutate, login, setTokens, navigate]);

  const loginOption = useMemo(() => {
    if (!data && !blocksOIdCClientId) return null;
    if (!data)
      return {
        oidc: { clientId: blocksOIdCClientId, redirectUrl: oidcRedirectUri },
        allowedGrantTypes: [],
        ssoInfo: [],
      };
    return {
      ...data,
      oidc: { clientId: blocksOIdCClientId, redirectUrl: '/login' },
    };
  }, [data]);

  // Show loading overlay during SSO callback processing
  if (isSSOCallback) return <LoadingOverlay />;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-32 h-14 mb-2">
        <img src={theme == 'dark' ? lightlogo : darklogo} className="w-full h-full" alt="logo" />
      </div>
      <div>
        <div className="text-2xl font-bold text-high-emphasis">{t('LOG_IN')}</div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-sm font-normal text-medium-emphasis">{t('DONT_HAVE_ACCOUNT')}</span>
          <Link
            to={'/signup'}
            className="text-sm font-bold text-primary hover:text-primary-600 hover:underline"
          >
            {t('SIGN_UP')}
          </Link>
        </div>
      </div>
      <div className="w-full invisible h-0">
        <div className="rounded-lg bg-success-background border border-success p-4">
          <p className="text-xs font-normal text-success-high-emphasis">
            Log in to explore the complete Demo and Documentation. Use the credentials:{' '}
            <span className="font-semibold">demo.construct@seliseblocks.com</span> with password:{' '}
            <span className="font-semibold">H%FE*FYi5oTQ!VyT6TkEy</span>
          </p>
        </div>
      </div>
      {loginOption && <Signin loginOption={loginOption} />}
    </div>
  );
};
