type CoreCaptchaProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpired?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
};

export type CaptchaRef = {
  reset: () => void;
};

export type HCaptchaProps = CoreCaptchaProps & { type: 'hCaptcha' };

export type ReCaptchaProps = CoreCaptchaProps & { type: 'reCaptcha' };

export type CaptchaProps = ReCaptchaProps | HCaptchaProps;
