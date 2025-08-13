/* eslint-disable @typescript-eslint/no-empty-function */
import { useTranslation } from 'react-i18next';

interface ExpandedFileDetailsProps {
  user: any;
}

const ExpandedFileDetails: React.FC<ExpandedFileDetailsProps> = ({ user }) => {
  const { t } = useTranslation();

  const formatLastLoginTime = (lastLoggedInTime: string | Date | null | undefined) => {
    if (!lastLoggedInTime) {
      return '-';
    }

    const date = new Date(lastLoggedInTime);

    if (date.getFullYear() === 1) {
      return '-';
    }

    try {
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '-';
    }
  };
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-medium-emphasis">{t('EMAIL')}</h3>
          <p className="text-sm text-high-emphasis">{user.email}</p>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('MOBILE_NO')}</h3>
            <p className="text-sm text-high-emphasis">{user.phoneNumber ?? '-'}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('IAM_ROLES')}</h3>
            <p className="text-sm text-high-emphasis first-letter:uppercase">
              {user.roles && user.roles.length > 0 ? user.roles.join(', ') : '-'}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('JOINED_ON')}</h3>
            <p className="text-sm text-high-emphasis">
              {new Date(user.createdDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('LAST_LOGIN')}</h3>
            <div className="text-sm text-high-emphasis">
              {user.lastLoggedInTime && new Date(user.lastLoggedInTime).getFullYear() !== 1 ? (
                formatLastLoginTime(user.lastLoggedInTime)
              ) : (
                <div className="text-muted-foreground">-</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <h3 className="text-sm  text-medium-emphasis">{t('STATUS')}</h3>
            <h3 className={user.active ? 'text-success ' : 'text-error'}>
              {user.active ? t('ACTIVE') : t('DEACTIVATED')}
            </h3>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">{t('MFA')}</h3>
            <p className="text-sm text-high-emphasis">
              {user.mfaEnabled ? t('ENABLED') : t('DISABLED')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedFileDetails;
