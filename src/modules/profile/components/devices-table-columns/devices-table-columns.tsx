import { useTranslation } from 'react-i18next';
import { Monitor, Smartphone, Trash } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import { ColumnDef } from '@tanstack/react-table';
import { CustomtDateFormat } from '@/lib/custom-date-formatter';
import { DeviceSession } from '../../types/device.type';

/**
 * Custom hook that defines and returns the columns for the device session table.
 * It defines column properties such as headers, cell rendering logic, and formatting.
 *
 */

interface IBrowserCellProps {
  deviceInfo?: {
    Browser?: string;
  };
}

export const useDeviceTableColumns = () => {
  const { t } = useTranslation();
  const getDeviceIcon = (deviceInfo: DeviceSession['DeviceInformation']) => {
    if (!deviceInfo?.Device) return <Monitor className="w-5 h-5 text-secondary" />;

    const deviceType = deviceInfo.Device.toLowerCase();
    if (
      deviceType.includes('mobile') ||
      deviceType.includes('iphone') ||
      deviceType.includes('android') ||
      deviceType.includes('smartphone')
    ) {
      return <Smartphone className="w-5 h-5 text-secondary" />;
    }
    return <Monitor className="w-5 h-5 text-secondary" />;
  };

  const BrowserCell = ({ deviceInfo }: Readonly<IBrowserCellProps>) => {
    return <span>{deviceInfo?.Browser ?? t('UNKNOWN_BROWSER')}</span>;
  };

  const columns: ColumnDef<DeviceSession>[] = [
    {
      id: 'device',
      header: () => <span className="flex w-[150px] items-center md:w-[200px]">{t('DEVICE')}</span>,
      cell: ({ row }) => (
        <div className="flex w-[150px] items-center md:w-[200px]">
          {getDeviceIcon(row.original.DeviceInformation)}
          <span className="ml-2">
            {(row.original.DeviceInformation?.Brand || row.original.DeviceInformation?.Device) ??
              t('UNKNOWN_DEVICE')}
          </span>
        </div>
      ),
    },
    {
      id: 'browser',
      header: () => (
        <span className="flex w-[150px] items-center md:w-[200px]">{t('BROWSER')}</span>
      ),
      cell: ({ row }) => <BrowserCell deviceInfo={row.original.DeviceInformation} />,
    },
    {
      id: 'lastAccessed',
      header: () => (
        <span className="flex w-[150px] items-center md:w-[200px]">{t('LAST_ACCESSED')}</span>
      ),
      cell: ({ row }) => <span>{CustomtDateFormat(row.original.UpdateDate)}</span>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => (
        <Button
          size="icon"
          disabled
          variant="ghost"
          className="group rounded-full disabled:text-gray-400"
        >
          <Trash className="h-4 w-4 text-destructive group-disabled:text-gray-400" />
        </Button>
      ),
    },
  ];

  return columns;
};
