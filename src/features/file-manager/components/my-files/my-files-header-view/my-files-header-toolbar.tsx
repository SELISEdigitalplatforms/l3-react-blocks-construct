/* eslint-disable @typescript-eslint/no-empty-function */
import {
  fileTypeFilterConfig,
  FilterConfig,
} from '@/features/file-manager/types/header-toolbar.type';
import { FileManagerHeaderToolbarProps } from '@/features/file-manager/utils/file-manager';
import { BaseHeaderToolbar } from '@/features/file-manager';

export const FileManagerHeaderToolbar = (props: Readonly<FileManagerHeaderToolbarProps>) => {
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
