import { useTranslation } from 'react-i18next';
import { DashboardCard } from '../dashboard-card/dashboard-card';
import { DashboardSystemOverviewStatisticItem } from '../dashboard-system-overview-statistic-item/dashboard-system-overview-statistic-item';
import { statsData, daysOfWeek } from '../../services/dashboard-service';

export const DashboardSystemOverview = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard
      titleKey="SYSTEM_USAGE_OVERVIEW"
      placeholderKey="TODAY"
      dropdownItems={daysOfWeek}
      data={statsData}
      renderItem={(stat) => (
        <DashboardSystemOverviewStatisticItem key={stat.title} stat={stat} t={t} />
      )}
    />
  );
};
