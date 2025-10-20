/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedFilesGridViewProps } from '@/features/file-manager/types/file-manager.type';
import { IFileDataWithSharing } from '@/features/file-manager/utils/file-manager';
import {
  matchesFileType,
  matchesModifiedDate,
  matchesName,
  matchesSharedDate,
} from '@/features/file-manager/utils/grid-view-filter-files';
import { BaseGridView } from '../../base-grid-view/base-grid-view';
import { RegularFileDetailsSheet } from '../../regular-file-details-sheet/regular-file-details-sheet';

export const SharedFilesGridView = (props: Readonly<SharedFilesGridViewProps>) => {
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
        return (
          matchesFileType(file, filters.fileType) &&
          matchesName(file, filters.name) &&
          matchesSharedDate(file, filters.sharedDate) &&
          matchesModifiedDate(file, filters.modifiedDate)
        );
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
