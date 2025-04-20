export type ManageUserMFA = {
  userId: string;
  mfaEnabled: boolean;
  userMfaType: number;
  isMfaVerified: boolean;
};

export type VerifyOTP = {
  verificationCode: string;
  mfaId: string;
  authType: number;
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
