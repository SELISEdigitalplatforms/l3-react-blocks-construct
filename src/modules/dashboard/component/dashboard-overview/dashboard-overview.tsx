import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-kit/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import { metricsConfigData, monthsOfYear } from '../../services/dashboard-service';
import { DashboardMetricCard } from '../dashboard-metric-card/dashboard-metric-card';

/**
 * DashboardOverview component displays a high-level overview of key user statistics.
 * It shows the total number of users, total active users, and new sign-ups, along with trends compared to the previous month.
 * The data can be filtered by month using the dropdown selector.
 */
export const DashboardOverview = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t('OVERVIEW')}</CardTitle>
          <Select>
            <SelectTrigger className="w-[120px] h-[28px] px-2 py-1">
              <SelectValue placeholder={t('THIS_MONTH')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {monthsOfYear.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {t(month.label)}
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
          {metricsConfigData.map((metric) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
