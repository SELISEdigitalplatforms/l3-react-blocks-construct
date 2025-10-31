import { Users } from 'lucide-react';
import { getFileTypeIcon, getFileTypeInfo } from '@/modules/file-manager/utils/file-manager';
import { FileType } from '@/modules/file-manager/types/file-manager.type';

interface NameCellProps {
  name: string;
  fileType: FileType;
  isShared?: boolean;
  t: (key: string) => string;
}

export const NameCell = ({ name, fileType, isShared = false, t }: Readonly<NameCellProps>) => {
  const IconComponent = getFileTypeIcon(fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(fileType);

  return (
    <div className="flex items-center gap-2">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${backgroundColor}`}>
        <IconComponent className={`w-4 h-4 ${iconColor}`} />
      </div>
      <span className="max-w-[300px] truncate font-medium">{name}</span>
      {isShared && (
        <span title={t('SHARED')}>
          <Users className="h-4 w-4 text-low-emphasis" />
        </span>
      )}
    </div>
  );
};
