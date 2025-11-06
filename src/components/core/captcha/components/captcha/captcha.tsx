'use client';

import { forwardRef } from 'react';
import { ReCaptcha } from '../reCaptcha/reCaptcha';
import { HCaptcha } from '../hCaptcha/hCaptcha';
import { CaptchaProps, CaptchaRef } from '../../types/captcha.type';

export const Captcha = forwardRef<CaptchaRef, CaptchaProps>((props: CaptchaProps, ref) => {
  const { type, ...rest } = props;
  if (!type) {
    throw new Error(`Captcha type is not passed`);
  }
  if (type === 'reCaptcha-v2-checkbox') return <ReCaptcha type={type} {...rest} ref={ref} />;
  if (type === 'hCaptcha') return <HCaptcha type={type} {...rest} ref={ref} />;

  throw new Error(`Captcha type is not supported`);
});

Captcha.displayName = 'Captcha';
