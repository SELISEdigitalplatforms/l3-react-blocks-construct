/* eslint-disable @typescript-eslint/no-empty-function */
import { FilterConfig } from '../../types/header-toolbar.type';
import { FileManagerHeaderToolbarProps } from '../../utils/file-manager';
import { BaseHeaderToolbar } from '../header-toolbar/base-header-toolbar';

export const FileManagerHeaderToolbar: React.FC<FileManagerHeaderToolbarProps> = (props) => {
  const filterConfigs: FilterConfig[] = [
    {
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
    },
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
