/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { Recycle, RotateCcw } from 'lucide-react';
import { IFileTrashData } from 'features/file-manager/utils/file-manager';
import { TrashFilesListView } from 'features/file-manager/components/trash/trash-files-list-view';
import { TrashGridView } from 'features/file-manager/components/trash/trash-files-grid-view';
import {
  ActionConfig,
  FilterConfig,
  TrashFilters,
} from 'features/file-manager/types/header-toolbar.type';
import { BaseHeaderToolbar } from 'features/file-manager/components/header-toolbar/base-header-toolbar';

interface TrashHeaderToolbarProps {
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
      showWhen: (selectedItems) => selectedItems.length > 0,
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
      viewMode={props.viewMode || 'list'}
      searchQuery={props.searchQuery || ''}
      filters={props.filters}
      selectedItems={props.selectedItems}
      filterConfigs={filterConfigs}
      actions={actions}
      onViewModeChange={props.handleViewMode}
      onSearchChange={props.onSearchChange || (() => {})}
      onFiltersChange={props.onFiltersChange}
    />
  );
};

interface TrashProps {
  onRestoreFile?: (file: IFileTrashData) => void;
  readonly onPermanentDelete?: (file: IFileTrashData) => void;
  onClearTrash?: () => void;
}

const Trash: React.FC<TrashProps> = ({ onRestoreFile, onPermanentDelete, onClearTrash }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState<TrashFilters>({
    name: '',
    fileType: undefined,
    deletedBy: undefined,
    trashedDate: undefined,
  });

  const [deletedItemIds, setDeletedItemIds] = useState<Set<string>>(new Set());
  const [restoredItemIds, setRestoredItemIds] = useState<Set<string>>(new Set());

  const handleRestoreFile = useCallback(
    (file: IFileTrashData) => {
      setRestoredItemIds((prev) => new Set([...Array.from(prev), file.id]));

      setSelectedItems((prev) => prev.filter((id) => id !== file.id));

      onRestoreFile?.(file);
    },
    [onRestoreFile]
  );

  const handlePermanentDelete = useCallback(
    (file: IFileTrashData) => {
      setDeletedItemIds((prev) => new Set([...Array.from(prev), file.id]));

      setSelectedItems((prev) => prev.filter((id) => id !== file.id));

      onPermanentDelete?.(file);
    },
    [onPermanentDelete]
  );

  const handleRestoreSelected = useCallback(() => {
    setRestoredItemIds((prev) => new Set([...Array.from(prev), ...selectedItems]));
    setSelectedItems([]);
  }, [selectedItems]);

  const handleClearTrash = useCallback(() => {
    onClearTrash?.();

    setSelectedItems([]);
  }, [onClearTrash]);

  const handleViewModeChange = useCallback((mode: string) => {
    setViewMode(mode as 'grid' | 'list');
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFiltersChange = useCallback((newFilters: TrashFilters) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.name ?? '');
  }, []);

  const commonViewProps = {
    onRestore: handleRestoreFile,
    onDelete: handlePermanentDelete,
    onPermanentDelete: handlePermanentDelete,
    filters,
    selectedItems,
    onSelectionChange: setSelectedItems,
    deletedItemIds,
    restoredItemIds,
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4 p-4 md:p-6">
      <TrashHeaderToolbar
        viewMode={viewMode}
        handleViewMode={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearTrash={handleClearTrash}
        onRestoreSelected={handleRestoreSelected}
        selectedItems={selectedItems}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="h-full overflow-y-auto">
            <TrashGridView {...commonViewProps} />
          </div>
        ) : (
          <div className="h-full">
            <TrashFilesListView {...commonViewProps} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Trash;
