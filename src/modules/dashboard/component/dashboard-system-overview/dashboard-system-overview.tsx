import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { statsData, daysOfWeek } from '../../services/dashboard-service';
import { useTranslation } from 'react-i18next';
import { DashboardSystemOverviewStatisticItem } from '../dashboard-system-overview-statistic-item/dashboard-system-overview-statistic-item';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';

/**
 * DashboardSystemOverview component displays an overview of system usage with key statistics.
 * It includes a selector to filter by day and shows circular progress indicators for various system stats.
 */
export const DashboardSystemOverview = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t('SYSTEM_USAGE_OVERVIEW')}</CardTitle>
          <Select>
            <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
              <SelectValue placeholder={t('TODAY')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {t(day.label)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat) => (
            <DashboardSystemOverviewStatisticItem key={stat.title} stat={stat} t={t} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
