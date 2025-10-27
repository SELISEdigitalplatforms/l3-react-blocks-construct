/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BLOCKS_API_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_X_BLOCKS_KEY: string;
  readonly VITE_CAPTCHA_SITE_KEY: string;
  readonly VITE_CAPTCHA_TYPE: string;
  readonly VITE_PROJECT_SHORT_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
