import { Monitor, Smartphone, Trash } from 'lucide-react';
import { Button } from 'components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { IDeviceSession } from '../../../services/device.service';

/**
 * Custom hook that defines and returns the columns for the device session table.
 * It defines column properties such as headers, cell rendering logic, and formatting.
 *
 * @returns {ColumnDef<IDeviceSession>[]} The columns configuration for the device table.
 */

interface IBrowserCellProps {
  deviceInfo?: {
    Browser?: string;
  };
}

export const useDeviceTableColumns = () => {
  const getDeviceIcon = (deviceInfo: IDeviceSession['DeviceInformation']) => {
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

  const formatDate = (date: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  const BrowserCell = ({ deviceInfo }: IBrowserCellProps) => {
    return <span>{deviceInfo?.Browser ?? 'Unknown Browser'}</span>;
  };

  const columns: ColumnDef<IDeviceSession>[] = [
    {
      id: 'device',
      header: () => <span className="flex w-[150px] items-center md:w-[200px]">Device</span>,
      cell: ({ row }) => (
        <div className="flex w-[150px] items-center md:w-[200px]">
          {getDeviceIcon(row.original.DeviceInformation)}
          <span className="ml-2">
            {(row.original.DeviceInformation?.Brand || row.original.DeviceInformation?.Device) ??
              'Unknown Device'}
          </span>
        </div>
      ),
    },
    {
      id: 'browser',
      header: () => <span className="flex w-[150px] items-center md:w-[200px]">Browser</span>,
      cell: ({ row }) => <BrowserCell deviceInfo={row.original.DeviceInformation} />,
    },
    {
      id: 'lastAccessed',
      header: () => <span className="flex w-[150px] items-center md:w-[200px]">Last Accessed</span>,
      cell: ({ row }) => <span>{formatDate(row.original.UpdateDate)}</span>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => (
        <Button size="icon" variant="ghost" className="rounded-full opacity-50 cursor-not-allowed">
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return columns;
};
