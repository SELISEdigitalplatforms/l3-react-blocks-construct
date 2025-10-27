"use client";

import { ReCaptcha } from "./reCaptcha";
import { HCaptcha } from "./hCaptcha";
import { CaptchaProps, CaptchaRef } from "./index.type";
import { forwardRef } from "react";

export const Captcha = forwardRef<CaptchaRef, CaptchaProps>((props: CaptchaProps, ref) => {
  const { type, ...rest } = props;
  if (!type) {
    throw new Error(`Captcha type is not passed`);
  }
  if (type === "reCaptcha-v2-checkbox") return <ReCaptcha type={type} {...rest} ref={ref} />;
  if (type === "hCaptcha") return <HCaptcha type={type} {...rest} ref={ref} />;

  throw new Error(`Captcha type is not supported`);
});

Captcha.displayName = "Captcha";
