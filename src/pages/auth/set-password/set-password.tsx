import { redirect } from 'react-router-dom';
import { SetpasswordForm } from '../../../features/auth/components/set-password';
import { useLayoutEffect } from 'react';
import { useAuthState } from '../../../state/client-middleware';
import { useSearchParams } from 'react-router-dom';

export function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';
  const { isMounted, isAuthenticated } = useAuthState();

  useLayoutEffect(() => {
    if (isAuthenticated) redirect('/');
  }, [isAuthenticated]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-2xl font-bold text-high-emphasis">Set your password</div>
        <div className="flex gap-1 mt-1">
          <div className="text-sm font-normal text-medium-emphasis">
            Secure your account with a strong password.
          </div>
        </div>
      </div>

      {/* <div className="w-full mx-auto">
        <div className="rounded-lg bg-success-background border border-success p-4">
          <p className="text-xs font-normal text-success-high-emphasis">
            Your email has been verified successfully.
          </p>
        </div>
      </div> */}

      <SetpasswordForm code={code} />
    </div>
  );
}
