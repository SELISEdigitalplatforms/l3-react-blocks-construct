/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';

import { BaseGridView } from '../basic-grid-view';
import { IFileDataWithSharing } from '../../utils/file-manager';
import { RegularFileDetailsSheet } from '../regular-file-details-sheet';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from 'hooks/use-mobile';
import { SharedFilesGridViewProps } from '../../types/file-manager.type';

const SharedFileGridView: React.FC<SharedFilesGridViewProps> = (props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<IFileDataWithSharing | null>(
    null
  );

  const handleViewDetails = useCallback(
    (file: IFileDataWithSharing) => {
      setSelectedFileForDetails(file);
      setIsDetailsOpen(true);
      props.onViewDetails?.(file);
    },
    [props.onViewDetails, props.fileSharedUsers]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFileForDetails(null);
  }, []);

  const queryBuilder = useCallback(
    (params: any) => ({
      page: params.page,
      pageSize: params.pageSize,
      filter: {
        name: params.filters.name ?? '',
        fileType: params.filters.fileType,
        sharedBy: params.filters.sharedBy,
        sharedDateFrom: params.filters.sharedDate?.from?.toISOString(),
        sharedDateTo: params.filters.sharedDate?.to?.toISOString(),
        modifiedDateFrom: params.filters.modifiedDate?.from?.toISOString(),
        modifiedDateTo: params.filters.modifiedDate?.to?.toISOString(),
      },
      folderId: props.currentFolderId,
    }),
    [props.currentFolderId]
  );

  const filterFiles = useCallback(
    (files: IFileDataWithSharing[], filters: any): IFileDataWithSharing[] => {
      return files.filter((file) => {
        if (filters.fileType && filters.fileType.length > 0) {
          if (!filters.fileType.includes(file.fileType)) return false;
        }

        if (filters.name && filters.name.trim()) {
          const searchTerm = filters.name.toLowerCase();
          if (!file.name.toLowerCase().includes(searchTerm)) return false;
        }

        if (filters.sharedBy && filters.sharedBy.trim()) {
          const sharedBy =
            file.sharedBy?.name?.toLowerCase() || file.sharedBy?.id?.toLowerCase() || '';
          if (!sharedBy.includes(filters.sharedBy.toLowerCase())) return false;
        }

        if (filters.sharedDate?.from || filters.sharedDate?.to) {
          const sharedDate = file.sharedDate ? new Date(file.sharedDate) : null;
          if (!sharedDate) return false;

          if (filters.sharedDate.from && sharedDate < new Date(filters.sharedDate.from)) {
            return false;
          }
          if (filters.sharedDate.to && sharedDate > new Date(filters.sharedDate.to)) {
            return false;
          }
        }

        if (filters.modifiedDate?.from || filters.modifiedDate?.to) {
          const modifiedDate = new Date(file.lastModified);

          if (filters.modifiedDate.from && modifiedDate < new Date(filters.modifiedDate.from)) {
            return false;
          }
          if (filters.modifiedDate.to && modifiedDate > new Date(filters.modifiedDate.to)) {
            return false;
          }
        }

        return true;
      });
    },
    []
  );

  const shouldHideMainContent = isMobile && isDetailsOpen;

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          <BaseGridView
            onNavigateToFolder={props.onNavigateToFolder}
            onFilePreview={props.onFilePreview}
            onViewDetails={handleViewDetails}
            filters={props.filters}
            newFiles={props.newFiles}
            newFolders={props.newFolders}
            renamedFiles={props.renamedFiles}
            fileSharedUsers={props.fileSharedUsers}
            filePermissions={props.filePermissions}
            currentFolderId={props.currentFolderId}
            onShare={props.onShare}
            onDelete={props.onDelete}
            onMove={props.onMove}
            onCopy={props.onCopy}
            onRename={props.onRename}
            queryBuilder={queryBuilder}
            filterFiles={filterFiles}
          />
        </div>
      )}

      <RegularFileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={
          selectedFileForDetails
            ? (() => {
                const sharedUsersFromProp =
                  props.fileSharedUsers?.[selectedFileForDetails.id] || [];
                const existingSharedWith = selectedFileForDetails.sharedWith || [];

                const combinedSharedUsers =
                  sharedUsersFromProp.length > 0 ? sharedUsersFromProp : existingSharedWith;

                return {
                  ...selectedFileForDetails,
                  lastModified:
                    typeof selectedFileForDetails.lastModified === 'string'
                      ? selectedFileForDetails.lastModified
                      : (selectedFileForDetails.lastModified?.toISOString?.() ?? ''),
                  isShared: combinedSharedUsers.length > 0,
                  sharedWith: combinedSharedUsers,
                };
              })()
            : null
        }
        t={t}
      />
    </div>
  );
};

export default SharedFileGridView;
