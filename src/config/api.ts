interface IAPIConfig {
  baseUrl: string;
  blocksKey: string;
  auth: {
    token: string;
  };
}

const getBaseUrl = (): string => {
  return isLocalhost()
    ? import.meta.env.VITE_PUBLIC_BLOCKS_API_URL || ''
    : import.meta.env.VITE_PUBLIC_API_URL || '';
};

export const isLocalhost = (): boolean => {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0' ||
    window.location.hostname === 'dev-construct.seliseblocks.com'
  );
};

if (!getBaseUrl() || !import.meta.env.VITE_PUBLIC_X_BLOCKS_KEY) {
  throw new Error('Required environment variables are not defined');
}

const API_CONFIG: IAPIConfig = {
  baseUrl: getBaseUrl(),
  blocksKey: import.meta.env.VITE_PUBLIC_X_BLOCKS_KEY || '',
  auth: {
    token: '/authentication/v1/OAuth/Token',
  },
};

export const getApiUrl = (path: string) => {
  const baseUrl = API_CONFIG.baseUrl.endsWith('/')
    ? API_CONFIG.baseUrl.slice(0, -1)
    : API_CONFIG.baseUrl;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};

export default API_CONFIG;
