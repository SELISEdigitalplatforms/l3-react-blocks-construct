/* eslint-disable @typescript-eslint/no-empty-function */
import { Recycle, RotateCcw } from 'lucide-react';
import {
  ActionConfig,
  fileTypeFilterConfig,
  FilterConfig,
  TrashFilters,
} from '../../../types/header-toolbar.type';
import { BaseHeaderToolbar } from '../../header-toolbar/base-header-toolbar/base-header-toolbar';

export interface TrashHeaderToolbarProps {
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: TrashFilters;
  onFiltersChange: (filters: TrashFilters) => void;
  onClearTrash?: () => void;
  onRestoreSelected?: () => void;
  selectedItems?: string[];
}

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
