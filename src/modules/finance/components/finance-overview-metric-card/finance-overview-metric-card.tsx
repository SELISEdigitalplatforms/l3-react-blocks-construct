import { MetricData } from '../../types/finance.type';

interface MetricCardProps {
  metric: MetricData;
  t: (key: string) => string;
}

const OUTSTANDING_INVOICES_KEY = 'OUTSTANDING_INVOICES';
const INVOICE_STATUS = {
  OVERDUE: { count: 2, textKey: 'OVERDUE', colorClass: 'text-error' },
  PENDING: { count: 3, textKey: 'PENDING', colorClass: 'text-warning' },
} as const;

const CSS_CLASSES = {
  container: 'flex flex-col hover:bg-primary-50 cursor-pointer gap-4 rounded-lg px-3 py-2',
  iconContainer: 'flex h-14 w-14 items-center justify-center',
  icon: 'h-7 w-7',
  title: 'text-sm font-normal text-high-emphasis',
  amount: 'text-[32px] font-semibold text-high-emphasis',
  footer: 'flex gap-1 items-center',
  trendIcon: 'h-4 w-4',
  trendValue: 'text-sm font-semibold',
  trendText: 'text-sm text-medium-emphasis',
  statusCount: 'text-sm font-semibold',
  statusText: 'text-sm text-medium-emphasis',
} as const;

const TrendDisplay = ({
  trend,
  t,
}: {
  trend: NonNullable<MetricData['trend']>;
  t: (key: string) => string;
}) => {
  const TrendIcon = trend.icon;
  return (
    <>
      <TrendIcon className={`${CSS_CLASSES.trendIcon} ${trend.color}`} />
      <span className={`${CSS_CLASSES.trendValue} ${trend.color}`}>{trend.value}</span>
      <span className={CSS_CLASSES.trendText}>{t(trend.textKey)}</span>
    </>
  );
};

const InvoiceStatusDisplay = ({ t }: { t: (key: string) => string }) => (
  <>
    <span className={`${CSS_CLASSES.statusCount} ${INVOICE_STATUS.OVERDUE.colorClass}`}>
      {INVOICE_STATUS.OVERDUE.count}
    </span>
    <span className={CSS_CLASSES.statusText}>{t(INVOICE_STATUS.OVERDUE.textKey)}</span>
    <span className={`${CSS_CLASSES.statusCount} ${INVOICE_STATUS.PENDING.colorClass}`}>
      {INVOICE_STATUS.PENDING.count}
    </span>
    <span className={CSS_CLASSES.statusText}>{t(INVOICE_STATUS.PENDING.textKey)}</span>
  </>
);

export const FinanceOverviewMetricCard = ({ metric, t }: Readonly<MetricCardProps>) => {
  const IconComponent = metric.icon;
  const isOutstandingInvoices = metric.titleKey === OUTSTANDING_INVOICES_KEY;

  return (
    <div data-testid="metric-card-container" className={CSS_CLASSES.container}>
      <div className={`${CSS_CLASSES.iconContainer} ${metric.iconBg ?? ''}`}>
        <IconComponent className={`${CSS_CLASSES.icon} ${metric.iconColor}`} />
      </div>
      <div>
        <h3 className={CSS_CLASSES.title}>{t(metric.titleKey)}</h3>
        <h1 className={CSS_CLASSES.amount}>
          {t('CHF')} {metric.amount}
        </h1>
        <div className={CSS_CLASSES.footer}>
          {metric.trend && <TrendDisplay trend={metric.trend} t={t} />}
          {isOutstandingInvoices && <InvoiceStatusDisplay t={t} />}
        </div>
      </div>
    </div>
  );
};
