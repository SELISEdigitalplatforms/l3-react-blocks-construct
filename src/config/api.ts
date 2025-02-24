interface IAPIConfig {
  baseUrl: string;
  blocksKey: string;
  auth: {
    token: string;
  };
}

if (!process.env.VITE_PUBLIC_BACKEND_URL || !process.env.VITE_PUBLIC_X_BLOCKS_KEY) {
  throw new Error('Required environment variables are not defined');
}

const API_CONFIG: IAPIConfig = {
  baseUrl: process.env.VITE_PUBLIC_BACKEND_URL,
  blocksKey: process.env.VITE_PUBLIC_X_BLOCKS_KEY,
  auth: {
    token: '/authentication/v1/oauth/token',
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
