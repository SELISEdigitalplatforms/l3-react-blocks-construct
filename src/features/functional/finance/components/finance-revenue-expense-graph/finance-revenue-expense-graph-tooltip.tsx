import { useTranslation } from 'react-i18next';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';

const chartConfig = {
  revenue: {
    label: 'REVENUE',
    color: 'hsl(var(--secondary-600))',
  },
  expenses: {
    label: 'EXPENSES',
    color: 'hsl(var(--burgundy-100))',
  },
};

interface TooltipContentProps extends TooltipProps<ValueType, NameType> {
  hoveredKey: keyof typeof chartConfig | null;
}

export const TooltipContent = ({ payload, label, hoveredKey }: TooltipContentProps) => {
  const { t } = useTranslation();

  if (!payload || !hoveredKey) return null;

  const data = payload.find((item) => item.dataKey === hoveredKey);
  if (!data) return null;

  const { color, label: seriesLabel } = chartConfig[hoveredKey];

  return (
    <div className="rounded-md bg-neutral-700 p-3 shadow-lg">
      <p className="text-sm text-white mb-2">
        {t(seriesLabel)} ({label}):
      </p>
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: color }} />
        <span className="text-sm text-white font-semibold">
          CHF {data.value?.toLocaleString() ?? '0'}
        </span>
      </div>
    </div>
  );
};
