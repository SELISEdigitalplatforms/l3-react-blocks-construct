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
import { metricsData, monthsOfYear } from '../../services/finance-services';
import { FinanceOverviewMetricCard } from '../finance-overview-metric-card/finance-overview-metric-card';

const COMPONENT_CONSTANTS = {
  titleKey: 'OVERVIEW',
  placeholderKey: 'THIS_MONTH',
  cssClasses: {
    card: 'w-full border-none rounded-[8px] shadow-sm',
    headerContainer: 'flex items-center justify-between',
    title: 'text-xl text-high-emphasis',
    selectTrigger: 'w-[120px] h-[28px] px-2 py-1',
    metricsGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
  },
} as const;

const MonthSelector = ({ t }: { t: (key: string) => string }) => (
  <Select>
    <SelectTrigger className={COMPONENT_CONSTANTS.cssClasses.selectTrigger}>
      <SelectValue placeholder={t(COMPONENT_CONSTANTS.placeholderKey)} />
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
);

const OverviewHeader = ({ t }: { t: (key: string) => string }) => (
  <div className={COMPONENT_CONSTANTS.cssClasses.headerContainer}>
    <CardTitle className={COMPONENT_CONSTANTS.cssClasses.title}>
      {t(COMPONENT_CONSTANTS.titleKey)}
    </CardTitle>
    <MonthSelector t={t} />
  </div>
);

const MetricsGrid = ({ t }: { t: (key: string) => string }) => (
  <div className={COMPONENT_CONSTANTS.cssClasses.metricsGrid}>
    {metricsData.map((metric) => (
      <FinanceOverviewMetricCard key={metric.titleKey} metric={metric} t={t} />
    ))}
  </div>
);

export const FinanceOverview = () => {
  const { t } = useTranslation();

  return (
    <Card className={COMPONENT_CONSTANTS.cssClasses.card}>
      <CardHeader>
        <OverviewHeader t={t} />
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MetricsGrid t={t} />
      </CardContent>
    </Card>
  );
};
