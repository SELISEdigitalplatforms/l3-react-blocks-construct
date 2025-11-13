import { useTranslation } from 'react-i18next';
import { DashboardCard } from '../dashboard-card/dashboard-card';
import { DashboardMetricCard } from '../dashboard-metric-card/dashboard-metric-card';
import { metricsConfigData, monthsOfYear } from '../../services/dashboard-service';

export const DashboardOverview = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard
      titleKey="OVERVIEW"
      placeholderKey="THIS_MONTH"
      dropdownItems={monthsOfYear}
      data={metricsConfigData}
      renderItem={(metric) => (
        <DashboardMetricCard
          key={metric.id}
          title={t(metric.title)}
          value={metric.value}
          trend={metric.trend}
          trendLabel={t('FROM_LAST_MONTH')}
          icon={metric.icon}
          iconColor={metric.iconColor}
          bgColor={metric.bgColor}
        />
      )}
    />
  );
};
