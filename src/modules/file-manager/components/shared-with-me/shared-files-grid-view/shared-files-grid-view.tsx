/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { IFileDataWithSharing, SharedUser } from '@/modules/file-manager/utils/file-manager';
import {
  matchesFileType,
  matchesModifiedDate,
  matchesName,
  matchesSharedDate,
} from '@/modules/file-manager/utils/grid-view-filter-files';
import { BaseGridView } from '../../base-grid-view/base-grid-view';
import { RegularFileDetailsSheet } from '../../regular-file-details-sheet/regular-file-details-sheet';
import { useDetailsPane } from '@/modules/file-manager/hooks/use-details-pane';
import { ResponsiveMainPane } from '@/modules/file-manager/components/layout/responsive-main-pane';

export interface SharedFilesGridViewProps {
  onViewDetails?: (file: IFileDataWithSharing) => void;
  onFilePreview?: (file: IFileDataWithSharing) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: any;
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: { [key: string]: SharedUser[] };
  filePermissions?: { [key: string]: { [key: string]: string } };
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
  onNavigateBack?: () => void;
}

export const SharedFilesGridView = (props: Readonly<SharedFilesGridViewProps>) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const {
    isDetailsOpen,
    selectedItem: selectedFileForDetails,
    handleOpenDetails: handleViewDetails,
    handleCloseDetails,
  } = useDetailsPane<IFileDataWithSharing>(isMobile, props.onViewDetails);

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

  return (
    <ResponsiveMainPane isMobile={isMobile} isDetailsOpen={isDetailsOpen}>
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
    </ResponsiveMainPane>
  );
};
