import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import successIcon from '@/assets/images/verification-success.svg';

export function ActivationSuccessPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center align-center">
        <div className="w-32 h-14 mb-20 ">
          <img src={successIcon} alt="emailSentIcon" />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-high-emphasis mb-4">
          {t('SUCCESSFULLY_SET_PASSWORD')}
        </div>
        <div className="flex gap-1 mt-1">
          <div className="text-base font-normal text-medium-emphasis leading-6">
            {t('CONTINUE_LOGIN_PASSWORD')}
          </div>
        </div>
      </div>

      <Link to={'/login'}>
        <Button className="font-extrabold w-full" size="lg" type="submit">
          {t('LOG_IN')}
        </Button>
      </Link>
    </div>
  );
}
