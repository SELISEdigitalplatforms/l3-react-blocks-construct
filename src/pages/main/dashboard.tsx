import { Download, RefreshCcw } from 'lucide-react';
import { Button } from 'components/ui/button';
import {
  DashboardOverview,
  DashboardSystemOverview,
  DashboardUserActivityGraph,
  DashboardUserPlatform,
} from 'features/dashboard';

export function Dashboard() {
  return (
    <div className="flex w-full flex-col">
      <div className="mb-[18px] flex items-center justify-between md:mb-[32px]">
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
          Dashboard (Design Only)
        </h3>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-high-emphasis hover:text-high-emphasis  font-bold"
          >
            <RefreshCcw className="w-2.5 h-2.5" />
            <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
              Sync
            </span>
          </Button>
          <Button className="font-bold">
            <Download className="w-2.5 h-2.5" />
            <span className="text-sm font-bold sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
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
  );
}
