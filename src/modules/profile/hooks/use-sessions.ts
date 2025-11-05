import { useQuery } from '@tanstack/react-query';
import { getSessions } from '../services/device.service';
import { GetSessionsPayload } from '../types/device.type';

export const useGetSessions = (options: GetSessionsPayload) => {
  return useQuery({
    queryKey: ['sessions', options],
    queryFn: () => getSessions(options),
  });
};
