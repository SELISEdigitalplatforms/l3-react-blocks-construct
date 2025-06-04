import API_CONFIG from '../../../config/api';
import { clients } from 'lib/https';

export interface IDeviceSession {
  RefreshToken: string;
  TenantId: string;
  IssuedUtc: Date;
  ExpiresUtc: Date;
  UserId: string;
  IpAddresses: string;
  DeviceInformation: {
    Browser: string;
    OS: string;
    Device: string;
    Brand: string;
    Model: string;
  };
  CreateDate: Date;
  UpdateDate: Date;
  IsActive: boolean;
}

export interface IDeviceSessionResponse {
  totalCount: number;
  data: IDeviceSession[];
  errors: null | string;
}

interface FetchSessionsParams {
  page: number;
  pageSize: number;
  projectkey: string;
  filter: {
    userId: string;
  };
}

class SessionsService {
  /**
   * Fetches sessions for a user based on the given parameters.
   *
   * @param {FetchSessionsParams} params - The parameters to fetch the sessions.
   * @param {number} [params.page=0] - The page number for pagination.
   * @param {number} [params.pageSize=10] - The number of sessions to fetch per page.
   * @param {string} [params.projectkey=process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY] - The project key for the request.
   * @param {object} params.filter - The filter object to apply when fetching sessions.
   * @param {string} params.filter.userId - The ID of the user whose sessions need to be fetched.
   *
   * @returns {Promise<IDeviceSessionResponse>} A promise that resolves with the device session data.
   *
   * @throws {Error} If the request fails or the server returns an error.
   *
   * @example
   * const sessions = await SessionsService.getSessions({
   *   page: 0,
   *   pageSize: 10,
   *   filter: { userId: '12345' }
   * });
   */
  static async getSessions({
    page = 0,
    pageSize = 10,
    projectkey = API_CONFIG.blocksKey ?? '',
    filter,
  }: FetchSessionsParams): Promise<IDeviceSessionResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      projectkey: projectkey,
      'filter.userId': filter.userId,
    });

    const response = await clients.get<any>(
      `/iam/v1/Activity/GetSessions?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * Fetches the active device sessions for a specific user.
   *
   * @param {string} userId - The ID of the user whose active device sessions are to be fetched.
   *
   * @returns {Promise<IDeviceSessionResponse>} A promise that resolves with the active device session data.
   *
   * @throws {Error} If the request fails or the server returns an error.
   *
   * @example
   * const activeSessions = await SessionsService.getActiveDeviceSessions('12345');
   */
  static async getActiveDeviceSessions(userId: string): Promise<IDeviceSessionResponse> {
    return this.getSessions({
      page: 0,
      pageSize: 10,
      projectkey: API_CONFIG.blocksKey,
      filter: {
        userId,
      },
    });
  }
}

export default SessionsService;
