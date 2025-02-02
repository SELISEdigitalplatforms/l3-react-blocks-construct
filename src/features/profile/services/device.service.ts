import API_CONFIG from 'config/api';
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
  static async getSessions({
    page = 0,
    pageSize = 10,
    projectkey = 'ef5d4fd7b2fa4c59b6a3df7b17c8c41e',
    filter,
  }: FetchSessionsParams): Promise<IDeviceSessionResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      projectkey: projectkey,
      'filter.userId': filter.userId,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await clients.get<any>(
      `/iam/v1/Activity/GetSessions?${queryParams.toString()}`
    );

    return response.data;
  }

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
