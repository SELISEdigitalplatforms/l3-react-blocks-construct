import unauthorized from '@/assets/images/unauthorized.png';
import { CustomErrorView } from '../../components/custom-error-view/custom-error-view';

export const UnauthorizedPage = () => {
  return (
    <CustomErrorView
      image={unauthorized}
      title={'Access Denied'}
      description={"You don't have permission to view this page"}
    />
  );
};
