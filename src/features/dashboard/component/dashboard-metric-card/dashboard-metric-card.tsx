import { TrendingUp } from 'lucide-react';

/**
 * MetricCard component displays a single metric with its value, trend, and icon.
 **/

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
}

export const DashboardMetricCard = ({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  bgColor,
}: Readonly<MetricCardProps>) => {
  return (
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
};
