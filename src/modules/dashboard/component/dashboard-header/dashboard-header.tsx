import { Download, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import { useTranslation } from 'react-i18next';

export const DashboardHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-[18px] flex items-center justify-between md:mb-[32px]">
      <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t('DASHBOARD')}</h3>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="text-high-emphasis hover:text-high-emphasis  font-bold"
          aria-label={t('SYNC_DASHBOARD_DATA')}
        >
          <RefreshCcw className="w-2.5 h-2.5" />
          <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t('SYNC')}
          </span>
        </Button>
        <Button className="font-bold" aria-label={t('EXPORT_DASHBOARD_DATA')}>
          <Download className="w-2.5 h-2.5" />
          <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t('EXPORT')}
          </span>
        </Button>
      </div>
    </div>
  );
};
