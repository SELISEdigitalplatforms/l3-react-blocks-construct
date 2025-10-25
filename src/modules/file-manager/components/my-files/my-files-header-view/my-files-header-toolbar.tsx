/* eslint-disable @typescript-eslint/no-empty-function */
import { BaseHeaderToolbar } from '../../header-toolbar/base-header-toolbar/base-header-toolbar';
import {
  FilterConfig,
  FileManagerFilters,
  fileTypeFilterConfig,
} from '../../../types/header-toolbar.type';

export interface FileManagerHeaderToolbarProps {
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: FileManagerFilters;
  onFiltersChange: (filters: FileManagerFilters) => void;
  onFileUpload?: (files: File[]) => void;
  onFolderCreate?: (folderName: string) => void;
  sharedUsers?: Array<{ id: string; name: string }>;
}

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
