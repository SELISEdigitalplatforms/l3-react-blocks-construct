/* eslint-disable @typescript-eslint/no-empty-function */
import { fileTypeFilterConfig, FilterConfig } from '../../types/header-toolbar.type';
import { SharedWithMeHeaderToolbarProps } from '../../utils/file-manager';
import { BaseHeaderToolbar } from '../header-toolbar/base-header-toolbar';

export const SharedWithMeHeaderToolbar: React.FC<SharedWithMeHeaderToolbarProps> = (props) => {
  const filterConfigs: FilterConfig[] = [
    {
      key: 'sharedBy',
      type: 'user',
      label: 'SHARED_BY',
      users: props.sharedUsers,
    },
    {
      key: 'sharedDate',
      type: 'dateRange',
      label: 'SHARED_DATE',
    },
    {
      key: 'modifiedDate',
      type: 'dateRange',
      label: 'MODIFIED_DATE',
    },
    fileTypeFilterConfig,
  ];

  return (
    <BaseHeaderToolbar
      title="SHARED_WITH_ME"
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
