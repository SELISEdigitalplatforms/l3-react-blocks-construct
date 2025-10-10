import { RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import temporaryUnavailable from '@/assets/images/unavailable.svg';
import { ErrorState } from '@/features/error-state';

export const ServiceUnavailable = () => {
  const { t } = useTranslation();

  return (
    <ErrorState
      image={temporaryUnavailable}
      title={t('PAGE_TEMPORARILY_UNAVAILABLE')}
      description={t('SCHEDULED_MAINTENANCE_IN_PROGRESS')}
      buttonText={t('RELOAD_PAGE')}
      buttonIcon={<RefreshCcw />}
    />
  );
};
