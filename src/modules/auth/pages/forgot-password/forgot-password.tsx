import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ForgotpasswordForm } from '@/modules/auth/components/forgot-password';
import { useTheme } from '@/styles/theme/theme-provider';
import darklogo from '@/assets/images/construct_logo_dark.svg';
import lightlogo from '@/assets/images/construct_logo_light.svg';
import { Button } from '@/components/ui-kit/button';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div className="w-32 h-14 mb-2">
        <img src={theme == 'dark' ? lightlogo : darklogo} alt="logo" className="w-full h-full" />
      </div>
      <div>
        <div className="text-2xl font-bold text-high-emphasis">{t('FORGOT_YOUR_PASSWORD')}</div>
        <div className="flex gap-1 mt-1">
          <div className="text-sm font-normal text-medium-emphasis">
            {t('ENTER_YOUR_REGISTERED_EMAIL')}
          </div>
        </div>
      </div>
      <ForgotpasswordForm />
      <Link to={'/login'}>
        <Button className="font-extrabold text-primary w-full" size="lg" variant="ghost">
          {t('GO_TO_LOGIN')}
        </Button>
      </Link>
    </div>
  );
};
