import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { X } from 'lucide-react';
import {
  FileDetailsSheetProps,
  getFileTypeDisplayName,
  getFileTypeIcon,
  getFileTypeInfo,
  getSharedUsers,
} from 'features/file-manager/utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';
import { CustomtDateFormat } from 'lib/custom-date-formatter';

const getCreationDate = (lastModified: Date): Date => {
  const creationDate = new Date(lastModified);
  const hoursBack = Math.floor(Math.random() * 720) + 24;
  creationDate.setHours(creationDate.getHours() - hoursBack);
  return creationDate;
};

const TrashDetailsSheet: React.FC<FileDetailsSheetProps> = ({ isOpen, onClose, file, t }) => {
  const isMobile = useIsMobile();

  if (!isOpen || !file) return null;

  const IconComponent = getFileTypeIcon(file.fileType);
  const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);
  const sharedUsers = getSharedUsers(file);
  const creationDate = getCreationDate(file.lastModified);
  const fileTypeDisplayName = getFileTypeDisplayName(file.fileType);

  const containerClasses = isMobile
    ? 'fixed inset-0 z-50 bg-white flex flex-col'
    : 'w-80 bg-white border-l border-gray-200 flex flex-col h-full rounded-lg shadow-lg ml-4';

  const headerClasses = isMobile
    ? 'p-4 pb-3 border-b border-gray-100 bg-white'
    : 'p-6 pb-4 border-b border-gray-100';

  const contentClasses = isMobile
    ? 'flex-1 overflow-y-auto p-4 space-y-6'
    : 'flex-1 overflow-y-auto p-6 space-y-6';

  return (
    <div className={containerClasses}>
      <div className={headerClasses}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t('DETAILS')}</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>

      <div className={contentClasses}>
        <div className="flex flex-col items-center space-y-3 py-4">
          <div
            className={`w-16 h-16 rounded-lg flex items-center justify-center ${backgroundColor}`}
          >
            <IconComponent className={`w-8 h-8 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center break-all">{file.name}</h3>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">{t('PROPERTIES')}</h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('TYPE')}</label>
              <div className="flex items-center gap-3">
                <div
                  className={`h-6 w-6 rounded flex items-center justify-center ${backgroundColor}`}
                >
                  <IconComponent className={`w-4 h-4 ${iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{fileTypeDisplayName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('SIZE')}</label>
              <div className="text-sm font-medium text-gray-900">{file.size}</div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('OWNER')}</label>
              <div className="text-sm font-medium text-gray-900">Luca Meier</div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('LAST_MODIFIED')}</label>
              <div className="text-sm font-medium text-gray-900">
                {CustomtDateFormat(file.lastModified)}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('DATE_CREATED')}</label>
              <div className="text-sm font-medium text-gray-900">
                {CustomtDateFormat(creationDate)}
              </div>
            </div>

            {file.fileType !== 'Folder' && (
              <div className="space-y-1">
                <label className="text-sm text-gray-600">{t('LOCATION')}</label>
                <div className="text-sm font-medium text-gray-900">/Documents/</div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm text-gray-600">{t('SHARING')}</label>
              <div className="text-sm font-medium text-gray-900">
                {file.isShared ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {t('SHARED')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    {t('PRIVATE')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {sharedUsers.length > 0 && (
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-base font-medium text-gray-900">
              {t('SHARED_WITH')} ({sharedUsers.length})
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
                  {user.role !== 'Owner' && <div className="text-xs text-gray-400"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashDetailsSheet;
