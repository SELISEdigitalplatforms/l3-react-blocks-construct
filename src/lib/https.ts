/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from '../state/store/auth';
import { getRefreshToken } from '../features/auth/services/auth.service';

interface Https {
  get<T>(url: string, headers?: HeadersInit): Promise<T>;
  post<T>(url: string, body: BodyInit, headers?: HeadersInit): Promise<T>;
  put<T>(url: string, body: BodyInit, headers?: HeadersInit): Promise<T>;
  delete<T>(url: string, headers?: HeadersInit): Promise<T>;
  request<T>(url: string, options: RequestOptions): Promise<T>;
  createHeaders(headers: any): Headers;
  handleAuthError<T>(url: string, method: string, headers: any, body: any): Promise<T>;
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: BodyInit;
}

export class HttpError extends Error {
  status: number;
  error: Record<string, unknown>;

  constructor(status: number, error: Record<string, unknown>) {
    const errorMessage = typeof error.message === 'string' ? error.message : JSON.stringify(error);

    super(errorMessage);
    this.status = status;
    this.error = error;
  }
}

const BASE_URL = process.env.REACT_APP_PUBLIC_BACKEND_URL?.replace(/\/$/, '');
const BLOCKS_KEY = process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY ?? '';

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

    const requestHeaders = this.createHeaders(headers);

    const config: RequestInit = {
      method,
      credentials: 'include',
      headers: requestHeaders,
    };

    if (body) {
      config.body = body;
    }

    try {
      const response = await fetch(fullUrl, config);

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      if (response.status === 401) {
        return this.handleAuthError<T>(url, method, headers, body);
      }

      const err = await response.json();
      throw new HttpError(response.status, err);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, { error: 'Network error' });
    }
  },

  createHeaders(headers: any): Headers {
    const authToken =
      process.env.REACT_APP_COOKIE_ENABLED === 'false' ? useAuthStore.getState().accessToken : null;

    const baseHeaders = {
      'Content-Type': 'application/json',
      'x-blocks-key': BLOCKS_KEY,
      ...(authToken && { Authorization: `bearer ${authToken}` }),
    };

    const headerEntries =
      headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers;

    return new Headers({
      ...baseHeaders,
      ...headerEntries,
    });
  },

  async handleAuthError<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers: any,
    body: any
  ): Promise<T> {
    const authStore = useAuthStore.getState();

    if (!authStore.refreshToken) {
      throw new HttpError(401, { error: 'invalid_refresh_token' });
    }

    const refreshTokenRes = await getRefreshToken();

    if (refreshTokenRes.error === 'invalid_refresh_token') {
      throw new HttpError(401, refreshTokenRes);
    }

    authStore.setAccessToken(refreshTokenRes.access_token);
    return this.request<T>(url, { method, headers, body });
  },
};
