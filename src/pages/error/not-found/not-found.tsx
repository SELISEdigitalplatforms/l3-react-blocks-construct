import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import notFound from '@/assets/images/not_found.svg';
import { ErrorState } from '@/modules/error-state';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <ErrorState
      image={notFound}
      title={t('COULDNT_FIND_WHAT_YOU_LOOKING_FOR')}
      description={t('PAGE_MAY_MOVED_NO_LONGER_EXISTS')}
      buttonText={t('TAKE_ME_BACK')}
      buttonIcon={<ArrowRight />}
    />
  );
};
