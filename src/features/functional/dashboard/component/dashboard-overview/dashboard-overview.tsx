import { TrendingUp, Users, UserCog, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { monthsOfYear } from '../../services/dashboard-service';
import { useTranslation } from 'react-i18next';

/**
 * MetricCard component displays a single metric with its value, trend, and icon.
 *
 * @param {Object} props - The component props
 * @param {string} props.title - The metric title
 * @param {string|number} props.value - The metric value
 * @param {string} props.trend - The trend percentage
 * @param {string} props.trendLabel - The trend label text
 * @param {React.ComponentType} props.icon - The icon component
 * @param {string} props.iconColor - The icon color class
 * @param {string} props.bgColor - The background color class for icon container
 * @returns {JSX.Element} - The rendered metric card
 */

type MetricCardProps = {
  title: string;
  value: string | number;
  trend: string;
  trendLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  bgColor,
}) => (
  <div className="flex justify-between hover:bg-primary-50 hover:rounded-[4px] cursor-pointer p-2">
    <div>
      <h3 className="text-sm font-normal text-high-emphasis">{title}</h3>
      <h1 className="text-[32px] font-semibold text-high-emphasis">{value}</h1>
      <div className="flex gap-1 items-center">
        <TrendingUp className="h-4 w-4 text-success" />
        <span className="text-sm text-success font-semibold">{trend}</span>
        <span className="text-sm text-medium-emphasis">{trendLabel}</span>
      </div>
    </div>
    <div className={`flex h-14 w-14 ${bgColor} rounded-[4px] items-center justify-center`}>
      <Icon className={`h-7 w-7 ${iconColor}`} />
    </div>
  </div>
);

/**
 * DashboardOverview component displays a high-level overview of key user statistics.
 * It shows the total number of users, total active users, and new sign-ups, along with trends compared to the previous month.
 * The data can be filtered by month using the dropdown selector.
 *
 * @component
 * @example
 * return (
 *   <DashboardOverview />
 * )
 *
 * @returns {JSX.Element} - The rendered JSX component displaying key user statistics with trend information and a month selector.
 */
export const DashboardOverview = () => {
  const { t } = useTranslation();

  const metricsConfig = [
    {
      id: 'total-users',
      title: t('TOTAL_USERS'),
      value: '10,000',
      trend: '+2.5%',
      icon: Users,
      iconColor: 'text-chart-500',
      bgColor: 'bg-surface',
    },
    {
      id: 'active-users',
      title: t('TOTAL_ACTIVE_USERS'),
      value: '7,000',
      trend: '+5%',
      icon: UserCog,
      iconColor: 'text-secondary',
      bgColor: 'bg-surface',
    },
    {
      id: 'new-signups',
      title: t('NEW_SIGN_UPS'),
      value: '1,200',
      trend: '+8%',
      icon: UserPlus,
      iconColor: 'text-green',
      bgColor: 'bg-surface',
    },
  ];

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
          {metricsConfig.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
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
