import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { CaptchaRef, ReCaptchaProps } from '../../types/captcha.type';

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
      reset: (widgetId?: number) => void;
    };
  }
}

const isReady = () => typeof window !== 'undefined' && !!window.grecaptcha;

const SCRIPT_ID = 'blocks-recaptcha-script';
const SCRIPT_SRC = 'https://www.google.com/recaptcha/api.js?render=explicit';

export const ReCaptcha = forwardRef<CaptchaRef, ReCaptchaProps>(
  ({ siteKey, theme = 'light', onVerify, onExpired, onError, size = 'normal' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      },
    }));

    const renderReCaptcha = useCallback(() => {
      if (!containerRef.current || !window.grecaptcha) return;
      window.grecaptcha.ready(() => {
        if (widgetIdRef.current !== null || !containerRef.current || !window.grecaptcha) return;
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: onVerify,
          ...(onExpired && { 'expired-callback': onExpired }),
          ...(onError && { 'error-callback': onError }),
        });
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
  }
);

ReCaptcha.displayName = 'ReCaptcha';
