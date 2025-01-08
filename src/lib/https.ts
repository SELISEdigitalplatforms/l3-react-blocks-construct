import { getRefreshToken } from "../features/auth/services/auth.service";
import { useAuthStore } from "../state/store/auth";

interface Https {
  get<T>(url: string, headers?: HeadersInit): Promise<T>;
  post<T>(url: string, body: BodyInit, headers?: HeadersInit): Promise<T>;
  put<T>(url: string, body: BodyInit, headers?: HeadersInit): Promise<T>;
  delete<T>(url: string, headers?: HeadersInit): Promise<T>;
  request<T>(url: string, options: RequestOptions): Promise<T>;
}

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: BodyInit;
}

export class HttpError extends Error {
  status: number;
  error: Record<string, unknown>;

  constructor(status: number, error: Record<string, unknown>) {
    super(error.toString());
    this.status = status;
    this.error = error;
  }
}

export const clients: Https = {
  async get<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: "GET", headers });
  },

  async post<T>(
    url: string,
    body: BodyInit,
    headers: HeadersInit = {}
  ): Promise<T> {
    return this.request<T>(url, { method: "POST", headers, body });
  },

  async put<T>(
    url: string,
    body: BodyInit,
    headers: HeadersInit = {}
  ): Promise<T> {
    return this.request<T>(url, { method: "PUT", headers, body });
  },

  async delete<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: "DELETE", headers });
  },

  async request<T>(
    url: string,
    { method, headers = {}, body }: RequestOptions
  ): Promise<T> {
    const config: RequestInit = {
      method,
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Blocks-Key": process.env.NEXT_PUBLIC_X_BLOCKS_KEY || "",
        Authorization: `bearer ${useAuthStore.getState().accessToken}`,
        credentials: "include",
        ...Object(
          headers instanceof Headers
            ? Object.fromEntries(headers.entries())
            : headers
        ),
      }),
    };

    config.body = body;
    const fullUrl = process.env.NEXT_PUBLIC_BACKEND_URL + url;

    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(fullUrl, config);
      if (!response.ok) {
        if (response.status === 401) {
          if (!useAuthStore.getState().refreshToken) {
            throw new HttpError(response.status, {
              error: "invalid_refresh_token",
            });
          }
          const refreshTokenRes = await getRefreshToken();
          if (refreshTokenRes.error === "invalid_refresh_token") {
            throw new HttpError(response.status, refreshTokenRes);
          } else {
            useAuthStore
              .getState()
              .setAccessToken(refreshTokenRes.access_token);
            return this.request<T>(url, { method, headers, body });
          }
        }
        const err = await response.json();
        throw new HttpError(response.status, err);
      }
      return (await response.json()) as T;
    } catch (error) {
      throw error;
    }
  },
};
