export type AuthState = {
  isAuthenticated: boolean;
  isMfaEnabled: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
};
