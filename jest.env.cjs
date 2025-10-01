//TODO Later might need to test based on the env set as well

// Legacy CRA environment variables (for backward compatibility)
process.env.REACT_APP_PUBLIC_BACKEND_URL = 'https://dev-api.seliseblocks.com';
process.env.REACT_APP_PUBLIC_X_BLOCKS_KEY = 'cf18dc87904c4e1485639242cda4a026';
process.env.REACT_APP_PUBLIC_BLOCKS_API_URL = 'https://dev-api.seliseblocks.com';
process.env.REACT_APP_PUBLIC_API_URL = 'https://dev-api.seliseblocks.com';

// Vite environment variables (for new development)
process.env.VITE_PUBLIC_BACKEND_URL = 'https://dev-api.seliseblocks.com';
process.env.VITE_PUBLIC_X_BLOCKS_KEY = 'cf18dc87904c4e1485639242cda4a026';
process.env.VITE_PUBLIC_BLOCKS_API_URL = 'https://dev-api.seliseblocks.com';
process.env.VITE_PUBLIC_API_URL = 'https://dev-api.seliseblocks.com';
process.env.VITE_CAPTCHA_SITE_KEY = 'test-site-key';
process.env.VITE_CAPTCHA_TYPE = 'reCaptcha';

// Legacy CRA captcha environment variables (for backward compatibility)
process.env.REACT_APP_CAPTCHA_SITE_KEY = 'test-site-key';
process.env.REACT_APP_CAPTCHA_TYPE = 'reCaptcha';
