import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { redirect, useSearchParams } from 'react-router-dom';
import { SetpasswordForm } from 'features/auth/components/set-password';
import { useAuthState } from 'state/client-middleware';

export function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const { isMounted, isAuthenticated } = useAuthState();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (isAuthenticated) redirect('/');
  }, [isAuthenticated]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-2xl font-bold text-high-emphasis">{t('SET_YOUR_PASSWORD')}</div>
        <div className="flex gap-1 mt-1">
          <div className="text-sm font-normal text-medium-emphasis">
            {t('SECURE_ACCOUNT_STRONG_PASSWORD')}
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
