import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/state/store/auth';
import { useSigninMutation } from '../../hooks/use-auth';
import { SignInResponse } from '../../services/auth.service';
import { LoadingOverlay } from '@/components/core/loading-overlay/loading-overlay';
import { Signin } from '@/modules/auth/components/signin';

export const SigninPage = () => {
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

  if (isSSOCallback) return <LoadingOverlay />;
  return <Signin />;
};
