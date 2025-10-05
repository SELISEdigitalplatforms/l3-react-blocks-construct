//will check later
import '@testing-library/jest-dom';
import 'jest-environment-jsdom';

// Define import.meta for Jest compatibility
(globalThis as any).import = {
  meta: {
    env: {
      VITE_CAPTCHA_SITE_KEY: process.env.VITE_CAPTCHA_SITE_KEY || 'test-site-key',
      VITE_CAPTCHA_TYPE: process.env.VITE_CAPTCHA_TYPE || 'reCaptcha',
      REACT_APP_CAPTCHA_SITE_KEY: process.env.REACT_APP_CAPTCHA_SITE_KEY || 'test-site-key',
      REACT_APP_CAPTCHA_TYPE: process.env.REACT_APP_CAPTCHA_TYPE || 'reCaptcha',
    },
  },
};
