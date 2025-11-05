import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui-kit/button';
import emailSentIcon from '@/assets/images/verification-failed.svg';

export const VerificationFailed = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center align-center">
        <div className="w-32 h-14 mb-20 ">
          <img src={emailSentIcon} alt="emailSentIcon" />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-high-emphasis mb-4">{t('VERIFICATION_FAILED')}</div>
        <div className="flex gap-1 mt-1">
          <div className="text-base font-normal text-medium-emphasis leading-6">
            {t('VERIFICATION_EMAIL_NO_LONGER_VALID')}
          </div>
        </div>
      </div>
      <Button className="font-extrabold" size="lg" type="submit">
        {t('RESEND_LINK')}
      </Button>
      <Button
        className="font-extrabold text-primary mt-[-10px]"
        size="lg"
        type="submit"
        variant="ghost"
      >
        {t('GO_TO_LOGIN')}
      </Button>
    </div>
  );
};
