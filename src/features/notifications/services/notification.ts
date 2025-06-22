import { subscribeNotifications } from '@seliseblocks/notifications';
import API_CONFIG from 'config/api';

export const connect = async (): Promise<void> => {
  await subscribeNotifications(
    API_CONFIG.baseUrl + '/notification/v1',
    {
      projectKey: API_CONFIG.blocksKey,
      accessTokenFactory: () => API_CONFIG.auth.token || '',
    },
    (channel: string, message: any) => {
      window.dispatchEvent(
        new CustomEvent('notification-received', {
          detail: { channel, message },
        })
      );
    }
  );
};
