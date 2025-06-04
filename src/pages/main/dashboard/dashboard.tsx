import { Download, Loader2, RefreshCcw } from 'lucide-react';
import {
  DashboardOverview,
  DashboardSystemOverview,
  DashboardUserActivityGraph,
  DashboardUserPlatform,
} from 'features/dashboard';
import { Button } from 'components/ui/button';
import { useGetAccount } from 'features/profile/hooks/use-account';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const { isLoading } = useGetAccount();
  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex w-full flex-col">
          <div className="mb-[18px] flex items-center justify-between md:mb-[32px]">
            <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
              {t('DASHBOARD')}
            </h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="text-high-emphasis hover:text-high-emphasis  font-bold"
              >
                <RefreshCcw className="w-2.5 h-2.5" />
                <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {t('SYNC')}
                </span>
              </Button>
              <Button className="font-bold">
                <Download className="w-2.5 h-2.5" />
                <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {t('EXPORT')}
                </span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <DashboardOverview />
            <div className="flex flex-col md:flex-row gap-4">
              <DashboardUserPlatform />
              <DashboardUserActivityGraph />
            </div>
            <DashboardSystemOverview />
          </div>
        </div>
      )}
    </>
  );
}
