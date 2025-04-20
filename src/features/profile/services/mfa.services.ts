import { clients } from 'lib/https';
import API_CONFIG from '../../../config/api';
import {
  GenerateOTPResponse,
  ManageUserMFA,
  SetUpTotp,
  VerifyOTP,
  VerifyOTPResponse,
} from '../types/mfa.types';

/**
 * Generates a One-Time Password (OTP) for the user.
 *
 * @param {Object} params - The parameters for generating OTP.
 * @param {string} params.userId - The user ID for whom the OTP is to be generated.
 *
 * @returns {Promise<GenerateOTPResponse>} A promise that resolves with the OTP generation response.
 *
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const otpResponse = await generateOTP({ userId: '12345' });
 */

export const generateOTP = async ({ userId }: { userId: string }): Promise<GenerateOTPResponse> => {
  const payload = {
    userId,
    projectKey: API_CONFIG.blocksKey,
  };
  const res = await clients.post<GenerateOTPResponse>(
    '/mfa/v1/Management/GenerateOTP',
    JSON.stringify(payload)
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
 * Configures Multi-Factor Authentication (MFA) for the user.
 * Sends the MFA settings to the server to enable or disable MFA.
 *
 * @param {ManageUserMFA} payload - The MFA configuration details including the user ID and MFA settings.
 * @returns {Promise<ManageUserMFA>} The updated MFA configuration response.
 * @throws {Error} Throws an error if the configuration request fails.
 *
 * @example
 * const payload = { userId: 'user-id-123', mfaEnabled: true, userMfaType: 1 };
 * const response = await configureUserMfa(payload);
 * console.log(response); // Updated MFA settings
 */
export const configureUserMfa = async (payload: ManageUserMFA): Promise<ManageUserMFA> => {
  const configureUserMfaPayload = {
    ...payload,
    projectKey: API_CONFIG.blocksKey,
  };
  const res = await clients.post<{ data: ManageUserMFA }>(
    '/mfa/v1/Management/ConfigureUserMfa',
    JSON.stringify(configureUserMfaPayload)
  );
  return res.data;
};

/**
 * Retrieves the TOTP (Time-based One-Time Password) setup details for the user.
 * Sends a GET request to fetch TOTP configuration using the provided query parameters.
 *
 * @param {Object} context - The context object containing query parameters for the request.
 * @param {SetUpTotp} context.queryKey - The query parameters to set up TOTP.
 * @returns {Promise<any>} The TOTP setup details in the response.
 * @throws {Error} Throws an error if the TOTP setup retrieval fails.
 *
 * @example
 * const queryParams = { userId: 'user-id-123', action: 'enable' };
 * const response = await getSetUpTotp({ queryKey: ['setUpTotp', queryParams] });
 * console.log(response); // TOTP setup details
 */
export const getSetUpTotp = async (context: { queryKey: [string, SetUpTotp] }): Promise<any> => {
  const [, queryParams] = context.queryKey;
  const stringifiedParams = Object.fromEntries(
    Object.entries(queryParams).map(([key, value]) => [key, String(value)])
  );
  const params = new URLSearchParams(stringifiedParams as Record<string, string>);
  const url = `/mfa/v1/Management/SetUpTotp?${params.toString()}`;
  const res = await clients.get<any>(url);

  return res;
};

/**
 * Sends a request to resend the OTP to the user based on the provided MFA ID.
 *
 * @param {string} mfaId - The MFA ID associated with the user for OTP resending.
 * @returns {Promise<any>} The response from the OTP resend request.
 * @throws {Error} Throws an error if the OTP resend fails.
 *
 * @example
 * const mfaId = 'user-mfa-id';
 * const response = await resendOtp(mfaId);
 * console.log(response); // Response after resending OTP
 */
export const resendOtp = async (mfaId: string): Promise<any> => {
  const res = await clients.post<any>(
    `/mfa/v1/Management/ResendOtp?mfaId=${encodeURIComponent(mfaId)}`,
    ''
  );
  return res;
};
