import { useTranslation } from 'react-i18next';
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface DashboardUserPlatformTooltipProps {
  data: {
    devices: string;
    users: number;
  };
}

export const DashboardUserPlatformTooltip = ({
  data,
}: Readonly<DashboardUserPlatformTooltipProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 bg-white p-2 shadow-md rounded-[4px]">
      <p className="text-sm text-high-emphasis">{t(data.devices.toUpperCase())}:</p>
      <p className="text-sm font-semibold text-medium-emphasis">
        {data.users.toLocaleString()} {t('USERS')}
      </p>
    </div>
  );
};

type ChartTooltipProps = TooltipProps<ValueType, NameType>;

export const ChartTooltipWrapper = ({ payload }: ChartTooltipProps) => {
  const data = payload?.[0]?.payload;
  return data ? <DashboardUserPlatformTooltip data={data} /> : null;
};
