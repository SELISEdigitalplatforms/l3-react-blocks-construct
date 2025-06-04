import { useGetAccount } from './use-account';
import { useGlobalQuery } from 'state/query-client/hooks';
import API_CONFIG from '../../../config/api';
import SessionsService, { IDeviceSessionResponse } from '../services/device.service';

/**
 * Custom hook to fetch the device sessions for the user.
 * It retrieves the sessions from the SessionsService using pagination.
 * The query is enabled only when the user's account ID is available.
 *
 * @param {number} page - The current page of sessions to fetch (default is 0).
 * @param {number} pageSize - The number of sessions per page (default is 10).
 *
 * @returns {Object} The query result containing device sessions data.
 *
 * @example
 * const { data, isLoading, error } = useGetSessions(0, 10);
 */

export const useGetSessions = (page = 0, pageSize = 10) => {
  const { data: account } = useGetAccount();

  return useGlobalQuery<IDeviceSessionResponse>({
    queryKey: ['sessions', account?.itemId, page, pageSize],
    queryFn: async () => {
      const response = await SessionsService.getSessions({
        page,
        pageSize,
        projectkey: API_CONFIG.blocksKey,
        filter: {
          userId: account?.itemId ?? '',
        },
      });
      return response;
    },
    enabled: !!account?.itemId,
  });
};

/**
 * Custom hook to fetch the active device sessions for the user.
 * It retrieves the active sessions from the SessionsService for the logged-in user.
 * The query is enabled only when the user's account ID is available.
 *
 * @returns {Object} The query result containing active device session data.
 *
 * @example
 * const { data, isLoading, error } = useGetActiveDeviceSessions();
 */

export const useGetActiveDeviceSessions = () => {
  const { data: account } = useGetAccount();

  return useGlobalQuery({
    queryKey: ['activeSessions', account?.itemId],
    queryFn: () => SessionsService.getActiveDeviceSessions(account?.itemId ?? ''),
    enabled: !!account?.itemId,
  });
};
