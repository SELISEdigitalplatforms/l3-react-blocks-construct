import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import darklogo from '@/assets/images/construct_logo_dark.svg';
import lightlogo from '@/assets/images/construct_logo_light.svg';
import { useTheme } from '@/styles/theme/theme-provider';
import { Signin } from '../../components/signin/signin';
import { useAuthStore } from '@/state/store/auth';
import { useGetLoginOptions, useSigninMutation } from '../../hooks/use-auth';
import { SignInResponse } from '../../services/auth.service';

export const SigninPage = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data: loginOption } = useGetLoginOptions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutateAsync: signinMutate } = useSigninMutation<'social'>();
  const { login, setTokens } = useAuthStore();
  const isExchangingRef = useRef(false);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const isSSOCallback = !!(code && state);

  useEffect(() => {
    if (!code || !state || isExchangingRef.current) {
      return;
    }

    isExchangingRef.current = true;

    (async () => {
      try {
        const res = (await signinMutate({ grantType: 'social', code, state })) as SignInResponse;

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
        console.error('[SSO Callback] Token exchange failed:', error);
        console.error('[SSO Callback] Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });
        navigate('/login', { replace: true });
      } finally {
        isExchangingRef.current = false;
      }
    })();
  }, [code, state, signinMutate, login, setTokens, navigate]);

  if (isSSOCallback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-high-emphasis">Completing Sign In...</p>
          <p className="text-sm text-muted-foreground">Please wait while we authenticate you</p>
        </div>
      </div>
    );
  }

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
