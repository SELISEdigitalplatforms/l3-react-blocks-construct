import { useTranslation } from 'react-i18next';
import { Folder } from 'lucide-react';
import { getFileTypeIcon, getFileTypeInfo, IFileDataWithSharing } from '../../utils/file-manager';
import { CommonGridView } from '../common-grid-view/common-grid-view';
import { useFileProcessing } from '../../hooks/use-file-processing';
import { useGridViewData } from '../../hooks/use-grid-view-data';
import { useFileActions } from '../common-grid-view-helpers/common-grid-view-helpers';

export interface BaseGridViewProps {
  onViewDetails?: (file: IFileDataWithSharing) => void;
  onFilePreview?: (file: IFileDataWithSharing) => void;
  onNavigateToFolder?: (folderId: string) => void;
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;
  filters: any;
  queryBuilder: (params: any) => any;
  filterFiles: (files: IFileDataWithSharing[], filters: any) => IFileDataWithSharing[];
  currentFolderId?: string;
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: Record<string, any[]>;
  filePermissions?: Record<string, any>;
}

export const BaseGridView = (props: Readonly<BaseGridViewProps>) => {
  const { t } = useTranslation();

  const { data, isLoading, error, handleLoadMore } = useGridViewData(
    props.filters,
    props.queryBuilder
  );

  const { processFiles } = useFileProcessing(props);
  const { renderActions } = useFileActions(props);

  return (
    <CommonGridView<IFileDataWithSharing>
      onViewDetails={props.onViewDetails}
      onFilePreview={props.onFilePreview}
      onNavigateToFolder={props.onNavigateToFolder}
      filters={props.filters}
      data={data ?? undefined}
      isLoading={isLoading}
      error={error}
      onLoadMore={handleLoadMore}
      renderDetailsSheet={() => null}
      renderPreviewSheet={() => null}
      getFileTypeIcon={getFileTypeIcon}
      getFileTypeInfo={getFileTypeInfo}
      renderActions={renderActions}
      emptyStateConfig={{
        icon: Folder,
        title: t('NO_FILES_FOUND'),
        description: t('NO_FILES_UPLOADED_YET'),
      }}
      sectionLabels={{
        folder: t('FOLDER'),
        file: t('FILE'),
      }}
      errorMessage={t('ERROR_LOADING_FILES')}
      loadingMessage={t('LOADING')}
      loadMoreLabel={t('LOAD_MORE')}
      processFiles={processFiles}
      filterFiles={props.filterFiles}
      currentFolderId={props.currentFolderId}
    />
  );
};
