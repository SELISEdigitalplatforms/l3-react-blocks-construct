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
            <div key={stat.title} className="flex items-center gap-6 sm:gap-4">
              <CircularProgress percentage={stat.percentage} strokeColor={stat.strokeColor} />
              <div>
                <h3 className="text-sm font-normal text-high-emphasis">{t(stat.title)}</h3>
                <span>
                  <span className="text-[24px] font-semibold text-high-emphasis">{stat.value}</span>
                  <span className="text-sm text-medium-emphasis">
                    {' '}
                    /{stat.title === 'BANDWIDTH' ? t(stat.max) : stat.max}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
