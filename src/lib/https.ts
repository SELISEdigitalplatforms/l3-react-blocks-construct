import { useAuthStore } from '../state/store/auth';
import { getRefreshToken } from '../features/auth/services/auth.service';

interface Https {
  get<T>(url: string, headers?: HeadersInit): Promise<T>;
  post<T>(url: string, body: BodyInit, headers?: HeadersInit): Promise<T>;
  put<T>(url: string, body: BodyInit, headers?: HeadersInit): Promise<T>;
  delete<T>(url: string, headers?: HeadersInit): Promise<T>;
  request<T>(url: string, options: RequestOptions): Promise<T>;
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: BodyInit;
}

// const PUBLIC_ENDPOINTS = ['/iam/v1/Account/Activate'];

export class HttpError extends Error {
  status: number;
  error: Record<string, unknown>;

  constructor(status: number, error: Record<string, unknown>) {
    super(error.toString());
    this.status = status;
    this.error = error;
  }
}

const BASE_URL = process.env.REACT_APP_PUBLIC_BACKEND_URL?.replace(/\/$/, '');
const BLOCKS_KEY = process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY || '';

export const clients: Https = {
  async get<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  },

  async post<T>(url: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'POST', headers, body });
  },

  async put<T>(url: string, body: BodyInit, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'PUT', headers, body });
  },

  async delete<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', headers });
  },

  async request<T>(url: string, { method, headers = {}, body }: RequestOptions): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}/${url.replace(/^\//, '')}`;

    // const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    const config: RequestInit = {
      method,
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-blocks-key': BLOCKS_KEY,
        // ...(!isPublicEndpoint && {
        //   Authorization: `bearer ${useAuthStore.getState().accessToken}`,
        // }),
        ...(headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers),
      }),
    };

    if (body) {
      config.body = body;
    }

    try {
      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        if (response.status === 401) {
          const authStore = useAuthStore.getState();
          if (!authStore.refreshToken) {
            throw new HttpError(response.status, {
              error: 'invalid_refresh_token',
            });
          }

          const refreshTokenRes = await getRefreshToken();
          if (refreshTokenRes.error === 'invalid_refresh_token') {
            throw new HttpError(response.status, refreshTokenRes);
          }

          authStore.setAccessToken(refreshTokenRes.access_token);
          return this.request<T>(url, { method, headers, body });
        }

        const err = await response.json();
        throw new HttpError(response.status, err);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, { error: 'Network error' });
    }
  },
};
