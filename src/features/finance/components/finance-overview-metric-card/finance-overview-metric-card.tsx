import { MetricData } from '../../types/finance.type';

interface MetricCardProps {
  metric: MetricData;
  t: (key: string) => string;
}

export const FinanceOverviewMetricCard = ({ metric, t }: Readonly<MetricCardProps>) => {
  const IconComponent = metric.icon;
  const TrendIcon = metric.trend?.icon;

  return (
    <div
      data-testid="metric-card-container"
      className="flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2"
    >
      <div className={`flex h-14 w-14 items-center justify-center ${metric.iconBg || ''}`}>
        <IconComponent className={`h-7 w-7 ${metric.iconColor}`} />
      </div>
      <div>
        <h3 className="text-sm font-normal text-high-emphasis">{t(metric.titleKey)}</h3>
        <h1 className="text-[32px] font-semibold text-high-emphasis">
          {t('CHF')} {metric.amount}
        </h1>
        <div className="flex gap-1 items-center">
          {metric.trend && TrendIcon && (
            <>
              <TrendIcon className={`h-4 w-4 ${metric.trend.color}`} />
              <span className={`text-sm ${metric.trend.color} font-semibold`}>
                {metric.trend.value}
              </span>
              <span className="text-sm text-medium-emphasis">{t(metric.trend.textKey)}</span>
            </>
          )}
          {metric.titleKey === 'OUTSTANDING_INVOICES' && (
            <>
              <span className="text-sm text-error font-semibold">2</span>
              <span className="text-sm text-medium-emphasis">{t('OVERDUE')}</span>
              <span className="text-sm text-warning font-semibold">3</span>
              <span className="text-sm text-medium-emphasis">{t('PENDING')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
