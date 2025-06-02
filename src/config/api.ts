interface IAPIConfig {
  baseUrl: string;
  blocksKey: string;
  auth: {
    token: string;
  };
}

if (!process.env.REACT_APP_PUBLIC_BLOCKS_API_URL || !process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY) {
  throw new Error('Required environment variables are not defined');
}

const API_CONFIG: IAPIConfig = {
  baseUrl: process.env.REACT_APP_PUBLIC_BLOCKS_API_URL,
  blocksKey: process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY,
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
