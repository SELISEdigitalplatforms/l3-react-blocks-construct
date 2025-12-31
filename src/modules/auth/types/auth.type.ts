export interface SigninEmailPayload {
  username: string;
  password: string;
}

export interface SigninEmailTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface SigninEmailMfaResponse {
  enable_mfa: boolean;
  message: string;
  mfaType: number;
  mfaId: string;
}

export interface SigninEmailResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  enable_mfa?: boolean;
  message?: string;
  mfaType?: number;
  mfaId?: string;
}

export interface ForgotPasswordPayload {
  email: string;
  captchaCode?: string;
  projectKey: string;
}

export interface ForgotPasswordResponse {
  errors: unknown;
  isSuccess: boolean;
}

export interface AccountActivationPayload {
  password: string;
  code: string;
  captchaCode: string;
  projectKey: string;
}
