import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { X } from 'lucide-react';
import { IFileData } from 'features/file-manager/hooks/use-mock-files-query';
import { getFileTypeIcon, getFileTypeInfo } from 'features/file-manager/utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';

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

// Get shared users based on file's isShared property and generate realistic data
const getSharedUsers = (file: IFileData | null): SharedUser[] => {
  if (!file) return [];

  // Always include the owner
  const users: SharedUser[] = [
    {
      id: 'owner',
      name: 'Luca Meier',
      role: 'Owner',
      avatar: '/avatars/luca.jpg',
    },
  ];

  // Add shared users only if the file is marked as shared
  if (file.isShared) {
    users.push(
      {
        id: '2',
        name: 'Aaron Green',
        role: 'Editor',
        avatar: '/avatars/aaron.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        role: 'Viewer',
        avatar: '/avatars/sarah.jpg',
      },
      {
        id: '4',
        name: 'Michael Chen',
        role: 'Viewer',
        avatar: '/avatars/michael.jpg',
      }
    );
  }

  return users;
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
    .replace(',', ' at');
};

// Generate a realistic creation date (slightly before last modified)
const getCreationDate = (lastModified: Date): Date => {
  const creationDate = new Date(lastModified);
  // Subtract random hours/days to make it earlier than last modified
  const hoursBack = Math.floor(Math.random() * 720) + 24; // 1-30 days ago
  creationDate.setHours(creationDate.getHours() - hoursBack);
  return creationDate;
};

// Get file type display name
const getFileTypeDisplayName = (fileType: string): string => {
  switch (fileType) {
    case 'Folder':
      return 'Folder';
    case 'File':
      return 'Document';
    case 'Image':
      return 'Image';
    case 'Audio':
      return 'Audio File';
    case 'Video':
      return 'Video File';
    default:
      return 'Unknown';
  }
};

const FileDetailsSheet: React.FC<FileDetailsSheetProps> = ({ isOpen, onClose, file, t }) => {
  const isMobile = useIsMobile();

  if (!isOpen || !file) return null;

  const IconComponent = getFileTypeIcon(file.fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);
  const sharedUsers = getSharedUsers(file);
  const creationDate = getCreationDate(file.lastModified);
  const fileTypeDisplayName = getFileTypeDisplayName(file.fileType);

  // Mobile: Full-screen overlay, Desktop: Side panel
  const containerClasses = isMobile
    ? 'fixed inset-0 z-50 bg-white flex flex-col'
    : 'w-80 bg-white border-l border-gray-200 flex flex-col h-full rounded-lg shadow-lg mx-4';

  const headerClasses = isMobile
    ? 'p-4 pb-3 border-b border-gray-100 bg-white'
    : 'p-6 pb-4 border-b border-gray-100';

  const contentClasses = isMobile
    ? 'flex-1 overflow-y-auto p-4 space-y-6'
    : 'flex-1 overflow-y-auto p-6 space-y-6';

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t('DETAILS') || 'Details'}</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={contentClasses}>
        {/* File Preview/Icon */}
        <div className="flex flex-col items-center space-y-3 py-4">
          <div
            className={`w-16 h-16 rounded-lg flex items-center justify-center ${backgroundColor}`}
          >
            <IconComponent className={`w-8 h-8 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center break-all">{file.name}</h3>
        </div>

        {/* Properties Section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">{t('PROPERTIES') || 'Properties'}</h3>

          <div className="space-y-4">
            {/* Type */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('TYPE') || 'Type'}</label>
              <div className="flex items-center gap-3">
                <div
                  className={`h-6 w-6 rounded flex items-center justify-center ${backgroundColor}`}
                >
                  <IconComponent className={`w-4 h-4 ${iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{fileTypeDisplayName}</span>
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

            {/* Last Modified */}
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
              <div className="text-sm font-medium text-gray-900">{formatDate(creationDate)}</div>
            </div>

            {/* File Path (for non-folders) */}
            {file.fileType !== 'Folder' && (
              <div className="space-y-1">
                <label className="text-sm text-gray-600">{t('LOCATION') || 'Location'}</label>
                <div className="text-sm font-medium text-gray-900">/Documents/</div>
              </div>
            )}

            {/* Sharing Status */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('SHARING') || 'Sharing'}</label>
              <div className="text-sm font-medium text-gray-900">
                {file.isShared ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {t('SHARED') || 'Shared'}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    {t('PRIVATE') || 'Private'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shared With Section */}
        {sharedUsers.length > 0 && (
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-base font-medium text-gray-900">
              {t('SHARED_WITH') || 'Shared with'} ({sharedUsers.length})
            </h3>

            <div className="space-y-3">
              {sharedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs bg-gray-100">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                      {user.role === 'Owner' && (
                        <span className="text-gray-500 font-normal"> (you)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role.toLowerCase()}
                    </div>
                  </div>
                  {user.role !== 'Owner' && (
                    <div className="text-xs text-gray-400">
                      {/* Could add permission change dropdown here */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Section (optional) */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <h3 className="text-base font-medium text-gray-900">
            {t('ACTIVITY') || 'Recent Activity'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">File was last modified</div>
                <div className="text-xs text-gray-500">{formatDate(file.lastModified)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">File was created</div>
                <div className="text-xs text-gray-500">{formatDate(creationDate)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsSheet;
