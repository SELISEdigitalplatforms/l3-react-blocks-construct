import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { CircularProgress } from '../circular-progress/circular-progress';
import { daysOfWeek, statsData } from '../../services/dashboard-service';
import { useTranslation } from 'react-i18next';

const GRID_CLASSES = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
const STAT_CONTAINER_CLASSES = 'flex items-center gap-6 sm:gap-4';
const TITLE_CLASSES = 'text-sm font-normal text-high-emphasis';
const VALUE_CLASSES = 'text-[24px] font-semibold text-high-emphasis';
const MAX_VALUE_CLASSES = 'text-sm text-medium-emphasis';
const SELECT_TRIGGER_CLASSES = 'w-[120px] h-[28px] px-2 py-1';

/**
 * Renders a single statistic item with circular progress and details
 * @param {Object} stat - The statistic data
 * @param {Function} t - Translation function
 * @returns {JSX.Element} - Rendered statistic item
 */
type Statistic = {
  title: string;
  value: number | string;
  max: number | string;
  percentage: number;
  strokeColor: string;
};

const StatisticItem: React.FC<{ stat: Statistic; t: (key: string) => string }> = ({ stat, t }) => {
  const maxValue = stat.title === 'BANDWIDTH' ? t(stat.max as string) : stat.max;

  return (
    <div className={STAT_CONTAINER_CLASSES}>
      <CircularProgress percentage={stat.percentage} strokeColor={stat.strokeColor} />
      <div>
        <h3 className={TITLE_CLASSES}>{t(stat.title)}</h3>
        <span>
          <span className={VALUE_CLASSES}>{stat.value}</span>
          <span className={MAX_VALUE_CLASSES}> /{maxValue}</span>
        </span>
      </div>
    </div>
  );
};

/**
 * Renders the day selector dropdown
 * @param {Function} t - Translation function
 * @returns {JSX.Element} - Rendered day selector
 */
const DaySelector: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <Select>
    <SelectTrigger className={SELECT_TRIGGER_CLASSES}>
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
);

/**
 * DashboardSystemOverview component displays an overview of system usage with key statistics.
 * It includes a selector to filter by day and shows circular progress indicators for various system stats.
 *
 * @component
 * @example
 * return (
 *   <DashboardSystemOverview />
 * )
 *
 * @returns {JSX.Element} - The rendered JSX component showing system usage statistics with circular progress indicators and a day selector.
 */
export const DashboardSystemOverview = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-none rounded-[8px] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-high-emphasis">{t('SYSTEM_USAGE_OVERVIEW')}</CardTitle>
          <DaySelector t={t} />
        </div>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <div className={GRID_CLASSES}>
          {statsData.map((stat) => (
            <StatisticItem key={stat.title} stat={stat} t={t} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
