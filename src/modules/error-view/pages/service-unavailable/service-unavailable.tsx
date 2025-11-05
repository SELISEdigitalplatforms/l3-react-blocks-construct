import { RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import temporaryUnavailable from '@/assets/images/unavailable.svg';
import { CustomErrorView } from '../../components/custom-error-view/custom-error-view';

export const ServiceUnavailablePage = () => {
  const { t } = useTranslation();

  return (
    <CustomErrorView
      image={temporaryUnavailable}
      title={t('PAGE_TEMPORARILY_UNAVAILABLE')}
      description={t('SCHEDULED_MAINTENANCE_IN_PROGRESS')}
      buttonText={t('RELOAD_PAGE')}
      buttonIcon={<RefreshCcw />}
    />
  );
};
