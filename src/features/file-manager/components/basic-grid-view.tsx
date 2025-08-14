import { useTranslation } from 'react-i18next';
import { Folder } from 'lucide-react';
import { getFileTypeIcon, getFileTypeInfo, IFileDataWithSharing } from '../utils/file-manager';

import { CommonGridView } from './common-grid-view';
import { useFileProcessing } from '../hooks/use-file-processing';
import { useGridViewData } from '../hooks/use-grid-view-data';
import { useFileActions } from './common-grid-view-helpers';

export interface BaseGridViewProps {
  // Core file action props
  onViewDetails?: (file: IFileDataWithSharing) => void; // Only for dropdown
  onFilePreview?: (file: IFileDataWithSharing) => void; // NEW: For file preview
  onNavigateToFolder?: (folderId: string) => void; // For folder navigation
  onShare: (file: IFileDataWithSharing) => void;
  onDelete: (file: IFileDataWithSharing) => void;
  onMove: (file: IFileDataWithSharing) => void;
  onCopy: (file: IFileDataWithSharing) => void;
  onRename: (file: IFileDataWithSharing) => void;

  // Grid specific props
  filters: any;
  queryBuilder: (params: any) => any;
  filterFiles: (files: IFileDataWithSharing[], filters: any) => IFileDataWithSharing[];
  currentFolderId?: string;

  // File management props
  newFiles?: IFileDataWithSharing[];
  newFolders?: IFileDataWithSharing[];
  renamedFiles?: Map<string, IFileDataWithSharing>;
  fileSharedUsers?: Record<string, any[]>;
  filePermissions?: Record<string, any>;
}

// Updated BaseGridView component
export const BaseGridView: React.FC<BaseGridViewProps> = (props) => {
  const { t } = useTranslation();

  // ✅ Enhanced debugging to check if navigation props are received
  console.log('BaseGridView received props:', {
    hasNavigateToFolder: !!props.onNavigateToFolder,
    hasFilePreview: !!props.onFilePreview,
    hasViewDetails: !!props.onViewDetails,
    currentFolderId: props.currentFolderId,
    propsKeys: Object.keys(props), // Show all prop names
  });

  const { data, isLoading, error, handleLoadMore } = useGridViewData(
    props.filters,
    props.queryBuilder
  );

  const { processFiles } = useFileProcessing(props);
  const { renderActions } = useFileActions(props);

  // ✅ Enhanced debugging to see what we're passing to CommonGridView
  console.log('BaseGridView passing to CommonGridView:', {
    hasNavigateToFolder: !!props.onNavigateToFolder,
    hasFilePreview: !!props.onFilePreview,
    hasViewDetails: !!props.onViewDetails,
    currentFolderId: props.currentFolderId,
  });

  return (
    <CommonGridView<IFileDataWithSharing>
      onViewDetails={props.onViewDetails} // Only for dropdown actions
      onFilePreview={props.onFilePreview} // NEW: For file preview
      onNavigateToFolder={props.onNavigateToFolder} // For folder navigation
      filters={props.filters}
      data={data ?? undefined}
      isLoading={isLoading}
      error={error}
      onLoadMore={handleLoadMore}
      renderDetailsSheet={() => null} // Remove details sheet from CommonGridView
      renderPreviewSheet={() => null} // Remove preview sheet from CommonGridView (handled in parent)
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
