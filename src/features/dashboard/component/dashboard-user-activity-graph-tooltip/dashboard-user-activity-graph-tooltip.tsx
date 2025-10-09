import { useTranslation } from 'react-i18next';
import { Payload, ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface DashboardUserActivityGraphTooltipProps {
  payload: Payload<ValueType, NameType>[] | undefined;
  label: string;
}

export const DashboardUserActivityGraphTooltip = ({
  payload,
  label,
}: Readonly<DashboardUserActivityGraphTooltipProps>) => {
  const { t } = useTranslation();
  const data = payload?.[0]?.value;

  if (data === undefined || data === null) return null;

  return (
    <div className="flex flex-col gap-1 bg-white p-2 shadow-md rounded-[4px]">
      <p className="text-sm text-high-emphasis">{label}:</p>
      <p className="text-sm font-semibold text-medium-emphasis">
        {data.toLocaleString()} {t('ACTIONS')}
      </p>
    </div>
  );
};
