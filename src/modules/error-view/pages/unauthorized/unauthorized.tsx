import unauthorized from '@/assets/images/403.svg';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CustomErrorView } from '../../components/custom-error-view/custom-error-view';

export const UnauthorizedPage = () => {
  const { t } = useTranslation();

  return (
    <CustomErrorView
      image={unauthorized}
      title={t('ACCESS_DENIED')}
      description={t('DONT_HAVE_PERMISSION_RESOURCE')}
      buttonText={t('GO_TO_DASHBOARD')}
      buttonIcon={<ArrowRight />}
      buttonLink="/"
    />
  );
};
