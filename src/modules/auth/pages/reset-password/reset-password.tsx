import { useEffect } from 'react';
import { redirect, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthState } from '@/state/client-middleware';
import { ResetpasswordForm } from '@/modules/auth/components/reset-password';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const { isMounted, isAuthenticated } = useAuthState();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) redirect('/');
  }, [isAuthenticated]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col w-full gap-6">
      <div>
        <div className="text-2xl font-bold text-high-emphasis">{t('RESET_PASSWORD')}</div>
        <div className="flex gap-1 mt-1">
          <div className="text-sm font-normal text-medium-emphasis">
            {t('CHOOSE_PASSWORD_SECURE_ACCOUNT')}
          </div>
        </div>
      </div>
      <ResetpasswordForm code={code} />
    </div>
  );
};
