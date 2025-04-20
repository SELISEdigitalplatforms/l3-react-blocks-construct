import { useLayoutEffect } from 'react';
import { redirect, useSearchParams } from 'react-router-dom';
import { useAuthState } from 'state/client-middleware';
import { ResetpasswordForm } from 'features/auth/components/reset-password';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const { isMounted, isAuthenticated } = useAuthState();

  useLayoutEffect(() => {
    if (isAuthenticated) redirect('/');
  }, [isAuthenticated]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 mb-4">
      <div>
        <div className="text-2xl font-bold text-high-emphasis">Reset password</div>
        <div className="flex gap-1 mt-1">
          <div className="text-sm font-normal text-medium-emphasis">
            Choose password to secure your account{' '}
          </div>
        </div>
      </div>

      <ResetpasswordForm code={code} />
    </div>
  );
}
