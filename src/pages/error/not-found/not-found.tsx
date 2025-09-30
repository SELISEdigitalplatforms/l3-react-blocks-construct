import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import notFound from '@/assets/images/not_found.svg';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-12">
        <img src={notFound} alt="not found" />
        <div className="flex flex-col items-center">
          <h1 className="text-high-emphasis font-bold text-[32px] leading-[48px]">
            {t('COULDNT_FIND_WHAT_YOU_LOOKING_FOR')}
          </h1>
          <p className="mt-3 mb-6 text-medium-emphasis font-semibold text-2xl">
            {t('PAGE_MAY_MOVED_NO_LONGER_EXISTS')}
          </p>
          <Button className="font-bold text-sm">
            {t('TAKE_ME_BACK')}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
