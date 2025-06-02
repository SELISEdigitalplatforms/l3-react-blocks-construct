import { SigninForm } from 'features/auth/components/signin-form';
import { Link } from 'react-router-dom';
import darklogo from 'assets/images/construct_logo_dark.svg';
import lightlogo from 'assets/images/construct_logo_light.svg';
import { useTheme } from 'components/core/theme-provider';
import { useTranslation } from 'react-i18next';
import { useGetLoginOptions } from 'features/auth/hooks/use-auth';

export function SigninPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data: loginOption } = useGetLoginOptions();

  return (
    <div className="flex flex-col gap-6">
      <div className="w-32 h-14 mb-2">
        <img src={theme == 'dark' ? darklogo : lightlogo} className="w-full h-full" alt="logo" />
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

      {loginOption && (
        <SigninForm
          loginOption={{
            ...loginOption,
          }}
        />
      )}
    </div>
  );
}
