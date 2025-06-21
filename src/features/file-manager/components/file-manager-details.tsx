import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { X } from 'lucide-react';
import { IFileData } from 'features/file-manager/hooks/use-mock-files-query';
import { getFileTypeIcon, getFileTypeInfo } from 'features/file-manager/utils/file-manager';

interface FileDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  file: IFileData | null;
  t: (key: string) => string;
}

interface SharedUser {
  id: string;
  name: string;
  role: 'Viewer' | 'Editor' | 'Owner';
  avatar?: string;
}

// Mock shared users data - replace with actual data from your file object
const getSharedUsers = (file: IFileData | null): SharedUser[] => {
  if (!file) return [];

  // This should come from your actual file data
  return [
    {
      id: '1',
      name: 'Me',
      role: 'Owner',
      avatar: '/avatars/me.jpg',
    },
    {
      id: '2',
      name: 'Aaron Green',
      role: 'Viewer',
      avatar: '/avatars/aaron.jpg',
    },
    {
      id: '3',
      name: 'Sarah Pavan',
      role: 'Viewer',
      avatar: '/avatars/sarah.jpg',
    },
  ];
};

const formatDate = (date: Date): string => {
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', ',');
};

const FileDetailsSheet: React.FC<FileDetailsSheetProps> = ({ isOpen, onClose, file, t }) => {
  if (!isOpen || !file) return null;

  const IconComponent = getFileTypeIcon(file.fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);
  const sharedUsers = getSharedUsers(file);

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full rounded-lg shadow-lg mx-4">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t('DETAILS') || 'Details'}</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">{t('PROPERTIES') || 'Properties'}</h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('TYPE') || 'Type'}</label>
              <div className="flex items-center gap-2">
                <div
                  className={`h-5 w-5 rounded flex items-center justify-center ${backgroundColor}`}
                >
                  <IconComponent className={`w-3 h-3 ${iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{file.name}</span>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('SIZE') || 'Size'}</label>
              <div className="text-sm font-medium text-gray-900">{file.size}</div>
            </div>

            {/* Owner */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('OWNER') || 'Owner'}</label>
              <div className="text-sm font-medium text-gray-900">Luca Meier</div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">
                {t('LAST_MODIFIED') || 'Last modified'}
              </label>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(file.lastModified)}
              </div>
            </div>

            {/* Date Created */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('DATE_CREATED') || 'Date created'}</label>
              <div className="text-sm font-medium text-gray-900">20.01.2025, 14:32</div>
            </div>
          </div>
        </div>

        {/* Shared With Section */}
        {sharedUsers.length > 0 && (
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-base font-medium text-gray-900">
              {t('SHARED_WITH') || 'Shared with'}
            </h3>

            <div className="space-y-3">
              {sharedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDetailsSheet;
