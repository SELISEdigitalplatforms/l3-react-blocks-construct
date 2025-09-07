import { ReCaptcha } from './reCaptcha';
import { HCaptcha } from './hCaptcha';
import { CaptchaProps } from './index.type';

/**
 * Captcha Component
 *
 * A dynamic CAPTCHA renderer that supports both Google reCAPTCHA and hCaptcha.
 * It accepts a `type` prop to determine which CAPTCHA to display, and passes through all additional props
 * to the appropriate CAPTCHA component.
 *
 * Features:
 * - Supports `reCaptcha` (Google) and `hCaptcha`
 * - Throws errors for missing or unsupported `type`
 * - Reuses underlying `<ReCaptcha />` and `<HCaptcha />` components
 *
 * Props:
 * - `type`: `'reCaptcha' | 'hCaptcha'` (required) – defines which CAPTCHA provider to use
 * - `...rest`: Additional props forwarded to the selected CAPTCHA component
 *
 * @param {CaptchaProps} props - The props for CAPTCHA selection and rendering
 * @returns {JSX.Element} The rendered CAPTCHA component based on the provided type
 *
 * @throws {Error} If no `type` is passed or an unsupported `type` is provided
 *
 * @example
 * <Captcha
<<<<<<< HEAD
 *   type={process.env.REACT_APP_CAPTCHA_TYPE} // 'reCaptcha' or 'hCaptcha'
=======
 *   type="reCaptcha"
>>>>>>> 395e8667464d4f8bbf596b5aaff4ef3560d507de
 *   siteKey={REACT_APP_CAPTCHA_SITE_KEY}
 *   onVerify={handleVerify}
 * />
 */

export const Captcha = (props: CaptchaProps) => {
  const { type, ...rest } = props;
  if (!type) {
    throw new Error(`Captcha type is not passed`);
  }
  if (type === 'reCaptcha') return <ReCaptcha type={type} {...rest} />;
  if (type === 'hCaptcha') return <HCaptcha type={type} {...rest} />;

  throw new Error(`Captcha type is not supported`);
};
