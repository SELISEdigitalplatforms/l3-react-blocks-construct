export type VerifyOTP = {
  verificationCode: string;
  mfaId: string;
  authType: number;
};

export type GenerateOTPPayload = {
  userId: string;
  mfaType: number;
};

export type GenerateOTPResponse = {
  mfaId: string;
  isSuccess: boolean;
  errors?: Record<string, string>;
};

export type VerifyOTPResponse = {
  isSuccess: boolean;
  isValid: boolean;
  errors?: Record<string, string>;
  useId: string;
};

export type SetUpTotp = {
  userId: string;
  projectKey: string;
};

export type MfaTemplate = {
  templateName: string;
  templateId: string;
};

export type GetMfaTemplateResponse = {
  enableMfa: boolean;
  userMfaType: number[];
  mfaTemplate: MfaTemplate;
  projectKey: string;
};

export type DisableUserMfaRequest = {
  userId: string;
  projectKey: string;
};

export type DisableUserMfaResponse = {
  errors?: Record<string, string>;
  isSuccess: boolean;
};

export type GetSetUpTotpResponse = {
  errors?: Record<string, string>;
  isSuccess: boolean;
  qrImageUrl: string;
  qrCode: string;
};

export type ResendOtpResponse = {
  errors?: Record<string, string>;
  isSuccess: boolean;
  mfaId: string;
};
