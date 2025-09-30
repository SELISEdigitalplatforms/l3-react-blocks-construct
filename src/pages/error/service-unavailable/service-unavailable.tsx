import { RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import temporaryUnavailable from '@/assets/images/unavailable.svg';

export default function ServiceUnavailable() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-12">
        <img src={temporaryUnavailable} alt="temp unavailable" />
        <div className="flex flex-col items-center">
          <h1 className="text-high-emphasis font-bold text-[32px] leading-[48px]">
            {t('PAGE_TEMPORARILY_UNAVAILABLE')}
          </h1>
          <p className="mt-3 mb-6 text-medium-emphasis font-semibold text-2xl">
            {t('SCHEDULED_MAINTENANCE_IN_PROGRESS')}
          </p>
          <Button className="font-bold text-sm">
            {t('RELOAD_PAGE')}
            <RefreshCcw />
          </Button>
        </div>
      </div>
    </div>
  );
}
