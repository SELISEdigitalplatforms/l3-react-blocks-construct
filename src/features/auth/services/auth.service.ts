import API_CONFIG, { getApiUrl } from '../../../config/api';
import { clients, HttpError } from '../../../lib/https';
import { useAuthStore } from '../../../state/store/auth';

interface SignInResponse {
  access_token: string;
  refresh_token: string;
}

interface AccountActivationData {
  password: string;
  code: string;
}

interface AccountActivationPayload extends AccountActivationData {
  ProjectKey: string;
  preventPostEvent: boolean;
}

export const signin = async (data: {
  username: string;
  password: string;
  captchaToken?: string;
}): Promise<SignInResponse> => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', data.username);
  formData.append('password', data.password);

  const url = getApiUrl('/authentication/v1/oauth/token');

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-blocks-key': API_CONFIG.blocksKey,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const err = await response.json();
    throw new HttpError(response.status, err);
  }

  return response.json();
};

export const signout = async (): Promise<{ isSuccess: true }> => {
  // eslint-disable-next-line no-useless-catch
  try {
    localStorage.removeItem('auth-storage');
    const url = '/authentication/v1/Authentication/Logout';
    return await clients.post(
      url,
      JSON.stringify({
        refreshToken: useAuthStore.getState().refreshToken,
      })
    );
  } catch (error) {
    throw error;
  }
};

export const getRefreshToken = async () => {
  const url = '/authentication/v1/oauth/token';
  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', useAuthStore.getState().refreshToken || '');

  const response = await fetch(`${API_CONFIG.baseUrl}${url}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-blocks-key': API_CONFIG.blocksKey,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const err = await response.json();
    throw new HttpError(response.status, err);
  }

  return response.json();
};

export const accountActivation = async (data: { password: string; code: string }) => {
  const payload: AccountActivationPayload = {
    ...data,
    ProjectKey: API_CONFIG.blocksKey,
    preventPostEvent: true,
  };

  const url = '/iam/v1/Account/Activate';
  return clients.post(url, JSON.stringify(payload));
};

export const forgotPassword = async (data: { email: string }) => {
  const payload = {
    ...data,
    captchaCode: '',
    mailPurpose: 'RecoverAccount',
  };

  const url = '/iam/v1/Account/Recover';
  return clients.post(url, JSON.stringify(payload));
};

export const resetPassword = async (data: { code: string; password: string }) => {
  const payload = {
    ...data,
    logoutFromAllDevices: true,
    ProjectKey: API_CONFIG.blocksKey,
  };

  const url = '/iam/v1/Account/ResetPassword';
  return clients.post(url, JSON.stringify(payload));
};

export const resendActivation = async (data: { userId: string }) => {
  const payload = {
    ...data,
    mailPurpose: 'ResendActivation',
  };

  const url = '/iam/v1/Account/ResendActivation';
  return clients.post(url, JSON.stringify(payload));
};

export const logoutAll = async () => {
  const url = '/authentication/v1/Authentication/LogoutAll';
  return clients.post(url, '');
};
