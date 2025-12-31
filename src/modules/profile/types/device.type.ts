export interface DeviceSession {
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

export interface DeviceSessionResponse {
  totalCount: number;
  data: DeviceSession[];
  errors: null | string;
}

export interface GetSessionsPayload {
  page: number;
  pageSize: number;
  projectkey?: string;
  filter: {
    userId: string;
  };
}
