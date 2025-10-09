import { CircularProgress } from '../circular-progress/circular-progress';

/**
 * Type definition for statistic data
 */
export type Statistic = {
  title: string;
  value: number | string;
  max: number | string;
  percentage: number;
  strokeColor: string;
};

/**
 * Props for StatisticItem component
 */
interface StatisticItemProps {
  stat: Statistic;
  t: (key: string) => string;
}

/**
 * Renders a single statistic item with circular progress and details
 * @param {StatisticItemProps} props - The component props
 * @param {Statistic} props.stat - The statistic data
 * @param {Function} props.t - Translation function
 * @returns {JSX.Element} - Rendered statistic item
 */
export function DashboardSystemOverviewStatisticItem({ stat, t }: Readonly<StatisticItemProps>) {
  const maxValue = stat.title === 'BANDWIDTH' ? t(stat.max as string) : stat.max;

  return (
    <div className="flex items-center gap-6 sm:gap-4">
      <CircularProgress percentage={stat.percentage} strokeColor={stat.strokeColor} />
      <div>
        <h3 className="text-sm font-normal text-high-emphasis">{t(stat.title)}</h3>
        <span>
          <span className="text-[24px] font-semibold text-high-emphasis">{stat.value}</span>
          <span className="text-sm text-medium-emphasis"> /{maxValue}</span>
        </span>
      </div>
    </div>
  );
}
