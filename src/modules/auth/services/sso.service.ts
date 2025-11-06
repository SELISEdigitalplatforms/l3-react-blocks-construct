import API_CONFIG from '@/config/api';
import { LoginOption } from '@/constant/sso';
import { MFASigninResponse } from './auth.service';

const safeJsonParse = async (response: Response) => {
  try {
    if (!response?.text) {
      console.error('Invalid response object');
      return { error: 'Invalid response object' };
    }

    const text = await response.text();

    if (!text || text.trim() === '') {
      console.error('Empty response received');
      return { error: 'Empty response received' };
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse JSON response:', text);
      return {
        error: 'Invalid JSON response',
        rawResponse: text,
      };
    }
  } catch (error) {
    console.error('Response handling error:', error);
    return { error: 'Failed to process response' };
  }
};

export interface SSOLoginResponse {
  providerUrl?: string;
  error?: string;
  requiresMfa?: boolean;
  mfaToken?: string;
  mfaType?: number;
  email?: string;
  status?: number;
}

export class SSOservice {
  async getSocialLoginEndpoint(payload: any): Promise<SSOLoginResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}/authentication/v1/OAuth/GetSocialLogInEndPoint`;

      const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-blocks-key': API_CONFIG.blocksKey,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!rawResponse.ok) {
        const errorText = await rawResponse.text();
        console.error('[SSO] API error response:', {
          status: rawResponse.status,
          statusText: rawResponse.statusText,
          error: errorText,
        });

        return {
          error: `API error: ${rawResponse.status} - ${rawResponse.statusText}`,
          status: rawResponse.status,
        };
      }

      const responseData = await safeJsonParse(rawResponse);

      return responseData;
    } catch (error) {
      console.error('Request failed:', error);
      return { error: 'Failed to make request' };
    }
  }

  async verifyMfaCode(mfaToken: string, code: string): Promise<MFASigninResponse> {
    try {
      const url = `${API_CONFIG.baseUrl}/authentication/v1/OAuth/VerifyMfaCode`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-blocks-key': API_CONFIG.blocksKey,
        },
        credentials: 'include',
        body: JSON.stringify({
          mfaToken,
          code,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SSO] MFA verification failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(errorText || 'Failed to verify MFA code');
      }

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error('MFA verification failed:', error);
      throw error;
    }
  }
}

export const getLoginOption = async (): Promise<LoginOption | null> => {
  try {
    const url = `${API_CONFIG.baseUrl}/authentication/v1/Social/GetLoginOptions`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Blocks-Key': API_CONFIG.blocksKey,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      referrerPolicy: 'no-referrer',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[SSO] Error fetching login options:', error);
    throw error;
  }
};
