import { ReCaptcha } from './reCaptcha';
import { HCaptcha } from './hCaptcha';
import { CaptchaProps } from './index.type';

export const Captcha = (props: CaptchaProps) => {
  const { type, ...rest } = props;
  if (!type) {
    throw new Error(`Captcha type is not passed`);
  }
  if (type === 'reCaptcha') return <ReCaptcha type={type} {...rest} />;
  if (type === 'hCaptcha') return <HCaptcha type={type} {...rest} />;

  throw new Error(`Captcha type is not supported`);
};
