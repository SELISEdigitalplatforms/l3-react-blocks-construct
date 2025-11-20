import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (code && state && !isExchangingRef.current) {
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
          // eslint-disable-next-line no-console
          console.error('SSO code exchange failed:', error);
        } finally {
          isExchangingRef.current = false;
        }
      })();
    }
  }, [searchParams, signinMutate, login, setTokens, navigate]);

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
