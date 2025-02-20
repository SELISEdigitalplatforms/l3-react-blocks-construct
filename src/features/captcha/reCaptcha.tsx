/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useRef, useCallback } from 'react';
import { ReCaptchaProps } from './index.type';

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          size: 'compact' | 'normal';
          theme: 'light' | 'dark';
          callback: (token: string) => void;
          'expired-callback': () => void;
        }
      ) => number;
      ready: (cb: () => void) => void;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId: number) => string;
    };
  }
}

const scriptCallbacks = new Set<() => void>();

const useScript = (id: string, url: string, callback: () => void) => {
  useEffect(() => {
    scriptCallbacks.add(callback);

    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.id = id;
      script.src = url;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            scriptCallbacks.forEach((cb) => cb());
            scriptCallbacks.clear();
          });
        }
      };
      script.onerror = () => {
        console.error(`Failed to load script: ${url}`);
        scriptCallbacks.delete(callback);
      };
      document.body.appendChild(script);
    } else if (window.grecaptcha) {
      callback();
    }

    return () => {
      scriptCallbacks.delete(callback);
      if (scriptCallbacks.size === 0) {
        const scriptTag = document.getElementById(id);
        if (scriptTag) {
          document.body.removeChild(scriptTag);
        }
      }
    };
  }, [callback, id, url]);
};

export const ReCaptcha = ({
  siteKey,
  theme = 'light',
  onVerify,
  onExpired,
  size = 'normal',
}: ReCaptchaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const renderReCaptcha = useCallback(() => {
    if (!containerRef.current || widgetIdRef.current !== null) return;

    widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      size,
      callback: onVerify,
      'expired-callback': onExpired ?? (() => {}),
    });
  }, [onExpired, onVerify, siteKey, size, theme]);

  useScript(
    'recaptcha-v2-script',
    'https://www.google.com/recaptcha/api.js?render=explicit',
    renderReCaptcha
  );

  return <div ref={containerRef} />;
};
