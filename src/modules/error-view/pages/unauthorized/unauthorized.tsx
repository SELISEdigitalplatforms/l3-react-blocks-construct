import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import unauthorized from '@/assets/images/unauthorized.png';
import { CustomErrorView } from '../../components/custom-error-view/custom-error-view';

export const UnauthorizedPage = () => {
  const { t } = useTranslation();

  return (
    <CustomErrorView
      image={unauthorized}
      title={'Access Denied'}
      description={"You don't have permission to view this page"}
      buttonText={t('TAKE_ME_BACK')}
      buttonIcon={<ArrowRight />}
    />
  );
};
