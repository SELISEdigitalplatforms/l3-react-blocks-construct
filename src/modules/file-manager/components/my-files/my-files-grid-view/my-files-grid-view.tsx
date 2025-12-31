/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { BaseGridView } from '../../base-grid-view/base-grid-view';
import { RegularFileDetailsSheet } from '../../regular-file-details-sheet/regular-file-details-sheet';
import { useTranslation } from 'react-i18next';
import {
  createGridFilter,
  createGridQueryBuilder,
} from '@/modules/file-manager/utils/grid-view-helpers';
import { IFileData } from '@/modules/file-manager/types/file-manager.type';
import { useDetailsPane } from '@/modules/file-manager/hooks/use-details-pane';
import { ResponsiveMainPane } from '@/modules/file-manager/components/layout/responsive-main-pane';
import { normalizeDetailsFile } from '@/modules/file-manager/utils/normalize-details-file';

interface MyFileGridViewProps {
  onViewDetails?: (file: IFileData) => void;
  onFilePreview?: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  filters: any;
  newFiles?: IFileData[];
  newFolders?: IFileData[];
  renamedFiles?: Map<string, IFileData>;
  fileSharedUsers?: Record<string, any[]>;
  filePermissions?: Record<string, any>;
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
  onNavigateBack?: () => void;
}

export const MyFileGridView = (props: Readonly<MyFileGridViewProps>) => {
  const { t } = useTranslation();
  const {
    isDetailsOpen,
    selectedItem: selectedFileForDetails,
    handleOpenDetails: handleViewDetails,
    handleCloseDetails,
  } = useDetailsPane<IFileData>(props.onViewDetails);

  const queryBuilder = useCallback(createGridQueryBuilder(props.currentFolderId), [
    props.currentFolderId,
  ]);
  const filterFiles = useCallback(createGridFilter(), []);

  return (
    <ResponsiveMainPane isDetailsOpen={isDetailsOpen}>
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
        file={normalizeDetailsFile(selectedFileForDetails)}
        t={t}
      />
    </ResponsiveMainPane>
  );
};
