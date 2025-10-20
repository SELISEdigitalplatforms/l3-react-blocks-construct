/* eslint-disable @typescript-eslint/no-empty-function */
import { BaseHeaderToolbar } from '@/features/file-manager';
import {
  fileTypeFilterConfig,
  FilterConfig,
  SharedFilters,
} from '@/features/file-manager/types/header-toolbar.type';

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
