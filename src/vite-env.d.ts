/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_X_BLOCKS_KEY: string;
  readonly VITE_CAPTCHA_SITE_KEY: string;
  readonly VITE_CAPTCHA_TYPE: string;
  readonly VITE_PROJECT_SLUG: string;
  readonly VITE_BLOCKS_OIDC_CLIENT_ID: string;
  readonly VITE_BLOCKS_OIDC_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
