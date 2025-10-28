import { Loader2 } from 'lucide-react';
import {
  DashboardHeader,
  DashboardOverview,
  DashboardUserPlatform,
  DashboardUserActivityGraph,
  DashboardSystemOverview,
} from '@/modules/dashboard';
import { useGetAccount } from '@/modules/profile/hooks/use-account';

const DashboardLoader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
};

export const DashboardPage = () => {
  const { isLoading } = useGetAccount();

  return (
    <>
      {isLoading ? (
        <DashboardLoader />
      ) : (
        <main className="flex w-full flex-col" role="main" aria-label="Dashboard Content">
          <DashboardHeader />
          <div className="flex flex-col gap-4">
            <DashboardOverview />
            <div className="flex flex-col md:flex-row gap-4">
              <DashboardUserPlatform />
              <DashboardUserActivityGraph />
            </div>
            <DashboardSystemOverview />
          </div>
        </main>
      )}
    </>
  );
};
