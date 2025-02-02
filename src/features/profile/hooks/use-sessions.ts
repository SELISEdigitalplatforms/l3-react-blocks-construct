import { useQuery } from '@tanstack/react-query';
import { useGetAccount } from './use-account';
import API_CONFIG from 'config/api';
import SessionsService, { IDeviceSessionResponse } from '../services/device.service';

export const useGetSessions = (page = 0, pageSize = 10) => {
  const { data: account } = useGetAccount();

  return useQuery<IDeviceSessionResponse>({
    queryKey: ['sessions', account?.itemId, page, pageSize],
    queryFn: async () => {
      const response = await SessionsService.getSessions({
        page,
        pageSize,
        projectkey: API_CONFIG.blocksKey,
        filter: {
          userId: account?.itemId || '',
        },
      });
      return response;
    },
    enabled: !!account?.itemId,
  });
};

export const useGetActiveDeviceSessions = () => {
  const { data: account } = useGetAccount();

  return useQuery({
    queryKey: ['activeSessions', account?.itemId],
    queryFn: () => SessionsService.getActiveDeviceSessions(account?.itemId || ''),
    enabled: !!account?.itemId,
  });
};
