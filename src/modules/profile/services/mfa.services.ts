import { clients } from '@/lib/https';
import API_CONFIG from '../../../config/api';
import {
  DisableUserMfaRequest,
  DisableUserMfaResponse,
  GenerateOTPPayload,
  GenerateOTPResponse,
  GetMfaTemplateResponse,
  GetSetUpTotpResponse,
  ResendOtpResponse,
  SetUpTotp,
  VerifyOTP,
  VerifyOTPResponse,
} from '../types/mfa.types';

/**
 * Generates a One-Time Password (OTP) for the user.
 *
 * @param {Object} params - The parameters for generating OTP.
 * @param {string} params.userId - The user ID for whom the OTP is to be generated.
 * @param {number} params.mfaType - The MFA type for whom the OTP is to be generated.
 *
 * @returns {Promise<GenerateOTPResponse>} A promise that resolves with the OTP generation response.
 *
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const otpResponse = await generateOTP({ userId: '12345', mfaType: 1 });
 */

export const generateOTP = async (payload: GenerateOTPPayload): Promise<GenerateOTPResponse> => {
  const requestPayload = {
    ...payload,
    projectKey: API_CONFIG.blocksKey,
  };
  const res = await clients.post<GenerateOTPResponse>(
    '/mfa/v1/Management/GenerateOTP',
    JSON.stringify(requestPayload)
  );
  return res;
};

/**
 * Verifies the OTP entered by the user.
 * Sends the OTP and necessary details to the server for validation.
 *
 * @param {VerifyOTP} payload - The OTP details including the verification code, mfaId, and authType.
 * @returns {Promise<VerifyOTPResponse>} The response indicating the success and validity of the OTP.
 * @throws {Error} Throws an error if the verification request fails.
 *
 * @example
 * const payload = { verificationCode: '123456', mfaId: 'mfa-id-123', authType: 1 };
 * const response = await verifyOTP(payload);
 * if (response.isSuccess && response.isValid) {
 *   console.log('OTP verified');
 * } else {
 *   console.log('Invalid OTP');
 * }
 */
export const verifyOTP = async (payload: VerifyOTP): Promise<VerifyOTPResponse> => {
  const verifyOTPPayload = {
    ...payload,
    projectKey: API_CONFIG.blocksKey,
  };
  const res = await clients.post<VerifyOTPResponse>(
    '/mfa/v1/Management/VerifyOTP',
    JSON.stringify(verifyOTPPayload)
  );
  return res;
};

/**
 * Retrieves the TOTP (Time-based One-Time Password) setup details for the user.
 * Sends a GET request to fetch TOTP configuration using the provided query parameters.
 *
 * @param {Object} context - The context object containing query parameters for the request.
 * @param {SetUpTotp} context.queryKey - The query parameters to set up TOTP.
 * @returns {Promise<GetSetUpTotpResponse>} The TOTP setup details in the response.
 * @throws {Error} Throws an error if the TOTP setup retrieval fails.
 *
 * @example
 * const queryParams = { userId: 'user-id-123', action: 'enable' };
 * const response = await getSetUpTotp({ queryKey: ['setUpTotp', queryParams] });
 * console.log(response); // TOTP setup details
 */
export const getSetUpTotp = async (context: {
  queryKey: [string, SetUpTotp];
}): Promise<GetSetUpTotpResponse> => {
  const [, queryParams] = context.queryKey;
  const stringifiedParams = Object.fromEntries(
    Object.entries(queryParams).map(([key, value]) => [key, String(value)])
  );
  const params = new URLSearchParams(stringifiedParams as Record<string, string>);
  const url = `/mfa/v1/Management/SetUpTotp?${params.toString()}`;
  const res = await clients.get<GetSetUpTotpResponse>(url);

  return res;
};

/**
 * Sends a request to resend the OTP to the user.
 *
 * @param {string} mfaId - The MFA ID for which to resend the OTP.
 * @returns {Promise<ResendOtpResponse>} The response from the OTP resend request.
 * @throws {Error} Throws an error if the OTP resend fails.
 *
 * @example
 * const response = await resendOtp('mfa-123');
 * console.log(response); // Response after resending OTP
 */
export const resendOtp = async (mfaId: string): Promise<ResendOtpResponse> => {
  const requestPayload = {
    mfaId,
    projectKey: API_CONFIG.blocksKey,
  };
  const res = await clients.post<ResendOtpResponse>(
    '/mfa/v1/Management/ResendOtp',
    JSON.stringify(requestPayload)
  );
  return res;
};

/**
 * Retrieves the MFA template configuration for the current project.
 * This service makes a GET request to fetch the MFA configuration settings.
 *
 * @returns {Promise<GetMfaTemplateResponse>} A promise that resolves with the MFA template configuration.
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const template = await getMfaTemplate();
 * if (template.isSuccess) {
 *   console.log('MFA template retrieved successfully');
 * }
 */
export const getMfaTemplate = async (): Promise<GetMfaTemplateResponse> => {
  const params = new URLSearchParams({
    projectKey: API_CONFIG.blocksKey,
  });
  const url = `/mfa/v1/Configuration/Get?${params.toString()}`;
  const res = await clients.get<GetMfaTemplateResponse>(url);

  return res;
};

/**
 * Disables Multi-Factor Authentication (MFA) for a specific user.
 * This service sends a POST request to disable MFA using the provided user ID.
 *
 * @param {string} userId - The ID of the user whose MFA is to be disabled.
 * @returns {Promise<DisableUserMfaResponse>} A promise that resolves with the disable MFA response.
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const response = await disableUserMfa('user-123');
 * if (response.isSuccess) {
 *   console.log('MFA disabled successfully');
 * }
 */
export const disableUserMfa = async (userId: string): Promise<DisableUserMfaResponse> => {
  const payload: DisableUserMfaRequest = {
    userId,
    projectKey: API_CONFIG.blocksKey,
  };
  const res = await clients.post<DisableUserMfaResponse>(
    '/mfa/v1/Management/DisableUserMfa',
    JSON.stringify(payload)
  );
  return res;
};
