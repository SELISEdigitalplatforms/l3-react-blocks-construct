import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/state/store/auth';
import { useSigninMutation } from '../../hooks/use-auth';
import { SignInResponse } from '../../services/auth.service';
import { LoadingOverlay } from '@/components/core/loading-overlay/loading-overlay';
import { Signin } from '@/modules/auth/components/signin';

export const SigninOidcCallBackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutateAsync: signinMutate } = useSigninMutation<'authorization_code'>();
  const { login, setTokens } = useAuthStore();
  const isExchangingRef = useRef(false);

  const code = searchParams.get('code');
  const isOidcCallback = !!code;

  useEffect(() => {
    if (code && !isExchangingRef.current) {
      isExchangingRef.current = true;

      (async () => {
        try {
          const res = (await signinMutate({
            grantType: 'authorization_code',
            code,
          })) as SignInResponse;

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
  }, [code, searchParams, signinMutate, login, setTokens, navigate]);

  if (isOidcCallback) return <LoadingOverlay />;

  return <Signin />;
};
