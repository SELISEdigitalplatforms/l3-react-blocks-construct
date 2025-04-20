/* eslint-disable @typescript-eslint/no-empty-function */

import { useEffect, useRef, useCallback } from 'react';
import { ReCaptchaProps } from './index.type';

/**
 * ReCaptcha Component
 *
 * A custom wrapper for Google reCAPTCHA v2 (explicit rendering mode). This component handles script loading,
 * widget rendering, and verification callbacks with support for theme, size, and error/expiration handling.
 *
 * Features:
 * - Dynamically loads the Google reCAPTCHA script if not already present
 * - Supports rendering with custom site key, theme, and size
 * - Handles callbacks for successful verification, expiration, and error
 * - Prevents duplicate widget rendering
 *
 * Props:
 * - `siteKey` (string): Google reCAPTCHA site key (required)
 * - `onVerify` (function): Callback when user successfully verifies (required)
 * - `onExpired` (function): Optional callback when the token expires
 * - `onError` (function): Optional callback when an error occurs
 * - `theme` ('light' | 'dark'): Widget theme (default: 'light')
 * - `size` ('normal' | 'compact'): Widget size (default: 'normal')
 *
 * @param {ReCaptchaProps} props - Properties for the reCAPTCHA component
 * @returns {JSX.Element} The rendered Google reCAPTCHA widget container
 *
 * @example
 * <ReCaptcha
 *   siteKey="your-site-key"
 *   onVerify={(token) => console.log(token)}
 *   onExpired={() => console.warn("Captcha expired")}
 *   onError={() => console.error("Captcha error")}
 *   theme="dark"
 *   size="compact"
 * />
 */

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          size: 'compact' | 'normal';
          theme: 'light' | 'dark';
          callback: (token: string) => void;
        }
      ) => number;
      ready: (cb: () => void) => void;
    };
  }
}

const isReady = () => typeof window !== 'undefined' && !!window.grecaptcha;

const SCRIPT_ID = 'blocks-recaptcha-script';
const SCRIPT_SRC = 'https://www.google.com/recaptcha/api.js?render=explicit';

export const ReCaptcha = ({
  siteKey,
  theme = 'light',
  onVerify,
  onExpired,
  onError,
  size = 'normal',
}: ReCaptchaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const renderReCaptcha = useCallback(() => {
    if (!containerRef.current) return;
    window.grecaptcha?.ready(() => {
      if (widgetIdRef.current !== null) return null;
      if (window.grecaptcha && containerRef.current) {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: onVerify,
          ...(onExpired && { 'expired-callback': onExpired }),
          ...(onError && { 'error-callback': onError }),
        });
      }
    });
  }, [siteKey, theme, size, onVerify, onExpired, onError]);

  const loadScript = () => {
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (isReady()) {
      renderReCaptcha();
      return;
    }

    loadScript();
    const scriptNode = document.getElementById(SCRIPT_ID);
    scriptNode?.addEventListener('load', renderReCaptcha);

    return () => {
      scriptNode?.removeEventListener('load', renderReCaptcha);
    };
  }, [renderReCaptcha]);

  return <div ref={containerRef} />;
};
