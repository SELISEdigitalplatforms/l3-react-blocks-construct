import { clients } from '@/lib/https';
import { DeviceSessionResponse, GetSessionsPayload } from '../types/device.type';

const parseMongoSession = (sessionStr: string) => {
  try {
    const cleanedJson = sessionStr
      .replace(/ObjectId\("([^"]*)"\)/g, '"$1"')
      .replace(/ISODate\("([^"]*)"\)/g, '"$1"')
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
};

export const getSessions = async ({
  page = 0,
  pageSize = 10,
  projectkey = '',
  filter,
}: GetSessionsPayload): Promise<DeviceSessionResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    projectkey: projectkey,
    'filter.userId': filter.userId,
  });
  const response = await clients.get<any>(`/idp/v1/Iam/GetSessions?${queryParams.toString()}`);
  const parsedSessions = response.data
    .map((session: string) => parseMongoSession(session))
    .filter((s: any) => s !== null);

  response.data = parsedSessions;
  return response;
};
