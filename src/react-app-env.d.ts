/// <reference types="react-scripts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_URL?: string;
  readonly VITE_PUBLIC_BLOCKS_API_URL?: string;
  readonly VITE_PUBLIC_X_BLOCKS_KEY?: string;
  readonly VITE_PUBLIC_BACKEND_URL?: string;
  readonly VITE_PRIMARY_COLOR?: string;
  readonly VITE_SECONDARY_COLOR?: string;
  readonly VITE_CAPTCHA_SITE_KEY?: string;
  readonly VITE_CAPTCHA_TYPE?: string;
  readonly REACT_APP_PUBLIC_API_URL?: string;
  readonly REACT_APP_PUBLIC_BLOCKS_API_URL?: string;
  readonly REACT_APP_PUBLIC_X_BLOCKS_KEY?: string;
  readonly REACT_APP_PUBLIC_BACKEND_URL?: string;
  readonly REACT_APP_PRIMARY_COLOR?: string;
  readonly REACT_APP_SECONDARY_COLOR?: string;
  readonly REACT_APP_CAPTCHA_SITE_KEY?: string;
  readonly REACT_APP_CAPTCHA_TYPE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}