/* eslint-disable @typescript-eslint/no-empty-function */
import {
  fileTypeFilterConfig,
  FilterConfig,
  SharedFilters,
} from '../../../types/header-toolbar.type';
import { BaseHeaderToolbar } from '../../header-toolbar/base-header-toolbar/base-header-toolbar';

export interface SharedWithMeHeaderToolbarProps {
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: SharedFilters;
  onFiltersChange: (filters: SharedFilters) => void;
  onFileUpload?: (files: File[]) => void;
  onFolderCreate?: (folderName: string) => void;
  sharedUsers?: Array<{ id: string; name: string }>;
}

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
