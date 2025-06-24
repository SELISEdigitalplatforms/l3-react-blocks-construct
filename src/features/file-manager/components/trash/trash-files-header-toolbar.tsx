/* eslint-disable @typescript-eslint/no-empty-function */
import { Recycle, RotateCcw } from 'lucide-react';
import { BaseHeaderToolbar } from '../header-toolbar/base-header-toolbar';
import { ActionConfig, FilterConfig } from '../../types/header-toolbar.type';
import { TrashHeaderToolbarProps } from '../../utils/file-manager';

export const TrashHeaderToolbar: React.FC<TrashHeaderToolbarProps> = (props) => {
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
      key: 'trashedDate',
      type: 'dateRange',
      label: 'TRASHED_DATE',
      showInMobile: true,
    },
  ];

  const actions: ActionConfig[] = [
    {
      key: 'restore-selected',
      label: 'RESTORE',
      icon: RotateCcw,
      variant: 'outline',
      onClick: props.onRestoreSelected || (() => {}),
      showWhen: (selectedItems: string[]) => selectedItems.length > 0,
    },
    {
      key: 'clear-trash',
      label: 'CLEAR_TRASH',
      icon: Recycle,
      variant: 'outline',
      onClick: props.onClearTrash || (() => {}),
    },
  ];

  return (
    <BaseHeaderToolbar
      title="TRASH"
      viewMode={props.viewMode ?? 'list'}
      searchQuery={props.searchQuery ?? ''}
      filters={props.filters}
      selectedItems={props.selectedItems}
      filterConfigs={filterConfigs}
      actions={actions}
      onViewModeChange={props.handleViewMode}
      onSearchChange={props.onSearchChange ?? (() => {})}
      onFiltersChange={props.onFiltersChange}
    />
  );
};
