/* eslint-disable @typescript-eslint/no-empty-function */
import { BaseHeaderToolbar } from '@/features/file-manager';
import {
  ActionConfig,
  fileTypeFilterConfig,
  FilterConfig,
} from '@/features/file-manager/types/header-toolbar.type';
import { TrashHeaderToolbarProps } from '@/features/file-manager/utils/file-manager';
import { Recycle, RotateCcw } from 'lucide-react';

export const TrashHeaderToolbar = (props: Readonly<TrashHeaderToolbarProps>) => {
  const filterConfigs: FilterConfig[] = [
    fileTypeFilterConfig,
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
