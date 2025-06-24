import { useTranslation } from 'react-i18next';
import { Folder } from 'lucide-react';
import { getFileTypeIcon, getFileTypeInfo, IFileDataWithSharing } from '../utils/file-manager';

import { CommonGridView } from './common-grid-view';
import { FileProcessingProps, useFileProcessing } from '../hooks/use-file-processing';
import { useGridViewData } from '../hooks/use-grid-view-data';
import { FileActionProps, useFileActions, useFileDetailsSheet } from './common-grid-view-helpers';

export interface BaseGridViewProps extends FileActionProps, FileProcessingProps {
  filters: any;
  onViewDetails?: (file: IFileDataWithSharing) => void;
  queryBuilder: (params: any) => any;
  filterFiles: (files: IFileDataWithSharing[], filters: any) => IFileDataWithSharing[];
}

export const BaseGridView: React.FC<BaseGridViewProps> = (props) => {
  const { t } = useTranslation();

  const { data, isLoading, error, handleLoadMore } = useGridViewData(
    props.filters,
    props.queryBuilder
  );

  const { processFiles } = useFileProcessing(props);
  const { renderActions } = useFileActions(props);
  const { renderDetailsSheet } = useFileDetailsSheet(t);

  return (
    <CommonGridView
      onViewDetails={props.onViewDetails}
      filters={props.filters}
      data={data ?? undefined}
      isLoading={isLoading}
      error={error}
      onLoadMore={handleLoadMore}
      renderDetailsSheet={renderDetailsSheet}
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
    />
  );
};
