/* eslint-disable @typescript-eslint/no-empty-function */
import { fileTypeFilterConfig, FilterConfig } from '../../types/header-toolbar.type';
import { FileManagerHeaderToolbarProps } from '../../utils/file-manager';
import { BaseHeaderToolbar } from '../header-toolbar/base-header-toolbar';

export const FileManagerHeaderToolbar: React.FC<FileManagerHeaderToolbarProps> = (props) => {
  const filterConfigs: FilterConfig[] = [
    fileTypeFilterConfig,
    {
      key: 'lastModified',
      type: 'dateRange',
      label: 'LAST_MODIFIED',
      showInMobile: true,
    },
  ];

  return (
    <BaseHeaderToolbar
      title="MY_FILES"
      viewMode={props.viewMode ?? 'grid'}
      searchQuery={props.searchQuery ?? ''}
      filters={props.filters}
      filterConfigs={filterConfigs}
      showFileUpload={true}
      showFolderCreate={true}
      onViewModeChange={props.handleViewMode}
      onSearchChange={props.onSearchChange ?? (() => {})}
      onFiltersChange={props.onFiltersChange}
      onFileUpload={props.onFileUpload}
      onFolderCreate={props.onFolderCreate}
    />
  );
};
