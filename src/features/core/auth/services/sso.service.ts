import API_CONFIG from 'config/api';
import { LoginOption } from 'constant/sso';

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

export class SSOservice {
  async getSocialLoginEndpoint(payload: any) {
    try {
      const rawResponse = await fetch(
        `${API_CONFIG.baseUrl}/authentication/v1/OAuth/GetSocialLogInEndPoint`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-blocks-key': API_CONFIG.blocksKey,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!rawResponse.ok) {
        console.error('API responded with error status:', rawResponse.status);
        return {
          error: `API error: ${rawResponse.status}`,
          status: rawResponse.status,
        };
      }

      return await safeJsonParse(rawResponse);
    } catch (error) {
      console.error('Request failed:', error);
      return { error: 'Failed to make request' };
    }
  }
}

export const getLoginOption = async (): Promise<LoginOption | null> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/authentication/v1/Social/GetLoginOptions`, {
      method: 'GET',
      headers: { 'X-Blocks-Key': API_CONFIG.blocksKey },
      referrerPolicy: 'no-referrer',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching login options:', error);
    throw error;
  }
};
