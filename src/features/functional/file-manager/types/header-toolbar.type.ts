import { DateRange } from '../components/common-filters';

export interface BaseFilters {
  name?: string;
  fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
}

export interface FileManagerFilters extends BaseFilters {
  lastModified?: DateRange;
  sharedBy?: string;
}

export interface SharedFilters extends BaseFilters {
  sharedBy?: string;
  sharedDate?: DateRange;
  modifiedDate?: DateRange;
}

export interface TrashFilters extends BaseFilters {
  deletedBy?: string;
  trashedDate?: DateRange;
}

export type FilterType = FileManagerFilters | SharedFilters | TrashFilters;

export interface FilterConfig {
  key: string;
  type: 'select' | 'dateRange' | 'user';
  label: string;
  options?: Array<{ value: string; label: string }>;
  users?: Array<{ id: string; name: string }>;
  showInMobile?: boolean;
  showInDesktop?: boolean;
  width?: string;
}

export interface ActionConfig {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  variant?: 'default' | 'outline' | 'ghost';
  onClick: () => void;
  showWhen?: (selectedItems: string[]) => boolean;
  size?: 'sm' | 'default';
}

export interface HeaderToolbarConfig<T extends FilterType> {
  title: string;
  viewMode: string;
  searchQuery: string;
  filters: T;
  selectedItems?: string[];
  showFileUpload?: boolean;
  showFolderCreate?: boolean;
  filterConfigs: FilterConfig[];
  actions?: ActionConfig[];
  onViewModeChange: (mode: string) => void;
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: T) => void;
  onFileUpload?: (files: File[]) => void;
  onFolderCreate?: (name: string) => void;
}

export const fileTypeFilter = {
  key: 'fileType',
  type: 'select',
  label: 'FILE_TYPE',
  options: [
    { value: 'Folder', label: 'FOLDER' },
    { value: 'File', label: 'FILE' },
    { value: 'Image', label: 'IMAGE' },
    { value: 'Audio', label: 'AUDIO' },
    { value: 'Video', label: 'VIDEO' },
  ],
  width: 'w-[140px]',
};

export const fileTypeFilterConfig: FilterConfig = {
  key: 'fileType',
  type: 'select',
  label: 'FILE_TYPE',
  options: [
    { value: 'Folder', label: 'FOLDER' },
    { value: 'File', label: 'FILE' },
    { value: 'Image', label: 'IMAGE' },
    { value: 'Audio', label: 'AUDIO' },
    { value: 'Video', label: 'VIDEO' },
  ],
  width: 'w-[140px]',
};
