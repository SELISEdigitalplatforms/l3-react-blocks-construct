import { CaptchaProps, CaptchaRef } from './index.type';
import { useCallback, useRef, useState } from 'react';

type UseCaptchaProps = {
  siteKey: string;
  type: CaptchaProps['type'];
};

type UseCaptchaReturn = {
  code: string;
  reset: () => void;
  ref: React.RefObject<CaptchaRef | null>;
  captcha: {
    ref: React.RefObject<CaptchaRef | null>;
    type: CaptchaProps['type'];
    siteKey: string;
    onVerify: (code: string) => void;
    onExpired: () => void;
    onError: () => void;
  };
};

export const useCaptcha = ({ siteKey, type }: UseCaptchaProps): UseCaptchaReturn => {
  const [code, setCode] = useState('');
  const ref = useRef<CaptchaRef>(null);

  const reset = useCallback(() => {
    ref.current?.reset();
    setCode('');
  }, []);

  return {
    code,
    reset,
    ref,
    captcha: {
      ref,
      type,
      siteKey,
      onVerify: setCode,
      onExpired: () => setCode(''),
      onError: () => setCode(''),
    },
  };
};
