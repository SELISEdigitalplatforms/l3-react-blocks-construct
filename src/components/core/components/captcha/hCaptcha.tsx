import CoreHCaptcha from "@hcaptcha/react-hcaptcha";
import { CaptchaRef, HCaptchaProps } from "./index.type";
import { forwardRef, useImperativeHandle, useRef } from "react";

export const HCaptcha = forwardRef<CaptchaRef, HCaptchaProps>(
  ({ siteKey, onVerify, onError, onExpired, theme = "light", size = "normal" }, ref) => {
    const captchaRef = useRef<CoreHCaptcha>(null);
    useImperativeHandle(ref, () => ({
      reset: () => {
        captchaRef.current?.resetCaptcha();
      },
    }));
    return (
      <CoreHCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={onVerify}
        onError={onError}
        onExpire={onExpired}
        size={size}
        theme={theme}
      />
    );
  },
);

HCaptcha.displayName = "hCaptcha";
