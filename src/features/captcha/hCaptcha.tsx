import CoreHCaptcha from "@hcaptcha/react-hcaptcha";
import { HCaptchaProps } from "./index.type";

export const HCaptcha = ({
  siteKey,
  onVerify,
  onError,
  onExpired,
  theme = "light",
  size = "normal",
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
