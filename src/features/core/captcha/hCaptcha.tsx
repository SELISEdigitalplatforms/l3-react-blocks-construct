import CoreHCaptcha from '@hcaptcha/react-hcaptcha';
import { HCaptchaProps } from './index.type';

/**
 * HCaptcha Component
 *
 * A wrapper around the core HCaptcha library component for rendering hCaptcha challenges.
 * It provides a customizable interface for integrating hCaptcha verification into forms.
 *
 * Features:
 * - Renders hCaptcha widget with provided `siteKey`
 * - Supports verification, expiration, and error handling callbacks
 * - Configurable size and theme
 *
 * Props:
 * - `siteKey` (string): Your hCaptcha site key (required)
 * - `onVerify` (function): Callback when a user successfully completes the challenge
 * - `onError` (function): Callback when an error occurs during challenge
 * - `onExpired` (function): Callback when the challenge expires
 * - `theme` ('light' | 'dark'): Appearance of the hCaptcha widget (default: 'light')
 * - `size` ('normal' | 'compact' | 'invisible'): Size of the widget (default: 'normal')
 *
 * @param {HCaptchaProps} props - Props required for rendering and interacting with hCaptcha
 * @returns {JSX.Element} The rendered hCaptcha widget
 *
 * @example
 * <HCaptcha
 *   siteKey="your-hcaptcha-site-key"
 *   onVerify={handleVerify}
 *   onError={handleError}
 *   onExpired={handleExpire}
 *   theme="dark"
 * />
 */

export const HCaptcha = ({
  siteKey,
  onVerify,
  onError,
  onExpired,
  theme = 'light',
  size = 'normal',
}: HCaptchaProps) => {
  return (
    <CoreHCaptcha
      sitekey={siteKey}
      onVerify={onVerify}
      onError={onError}
      onExpire={onExpired}
      size={size}
      theme={theme}
    />
  );
};
