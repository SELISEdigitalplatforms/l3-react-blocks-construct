/* eslint-disable @typescript-eslint/no-empty-function */
import { BaseHeaderToolbar } from '@/features/file-manager';
import {
  fileTypeFilterConfig,
  FilterConfig,
} from '@/features/file-manager/types/header-toolbar.type';
import { SharedWithMeHeaderToolbarProps } from '@/features/file-manager/utils/file-manager';

export const SharedWithMeHeaderToolbar = (props: Readonly<SharedWithMeHeaderToolbarProps>) => {
  const filterConfigs: FilterConfig[] = [
    fileTypeFilterConfig,
    {
      key: 'lastModified',
      type: 'dateRange',
      label: 'MODIFIED_DATE',
      showInMobile: true,
    },
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
