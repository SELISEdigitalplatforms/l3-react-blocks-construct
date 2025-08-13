import React, { useState, useCallback, useEffect } from 'react';
import { IFileTrashData } from 'features/file-manager/utils/file-manager';
import { TrashFilesListView } from 'features/file-manager/components/trash/trash-files-list-view';
import { TrashGridView } from 'features/file-manager/components/trash/trash-files-grid-view';
import { TrashFilters } from 'features/file-manager/types/header-toolbar.type';
import { TrashHeaderToolbar } from 'features/file-manager/components/trash/trash-files-header-toolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockTrashFilesQuery } from 'features/file-manager/hooks/use-mock-trash-files-query';

interface TrashProps {
  onRestoreFile?: (file: IFileTrashData) => void;
  readonly onPermanentDelete?: (file: IFileTrashData) => void;
  onClearTrash?: () => void;
}

interface TrashProps {
  onRestoreFile?: (file: IFileTrashData) => void;
  readonly onPermanentDelete?: (file: IFileTrashData) => void;
  onClearTrash?: () => void;
}

const Trash: React.FC<TrashProps> = ({ onRestoreFile, onPermanentDelete, onClearTrash }) => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId?: string }>();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const saved = sessionStorage.getItem('trash-view-mode');
      return (saved as 'grid' | 'list') || 'list';
    } catch {
      return 'list';
    }
  });

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

  const [showEmptyView, setShowEmptyView] = useState(false);

  const queryParams = {
    filter: {
      name: filters.name || searchQuery,
      fileType: filters.fileType,
      deletedDate: filters.trashedDate
        ? {
            from: filters.trashedDate.from,
            to: filters.trashedDate.to,
          }
        : undefined,
    },
    page: 0,
    pageSize: 50,
    folderId,
  };

  const { data, isLoading, error } = useMockTrashFilesQuery(queryParams);

  const handleRestoreFile = useCallback(
    (file: IFileTrashData) => {
      setRestoredItemIds((prev) => new Set([...Array.from(prev), file.id]));
      setSelectedItems((prev) => prev.filter((id) => id !== file.id));
      onRestoreFile?.(file);
      setShowEmptyView(false);
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
    if (selectedItems.length > 0) {
      setShowEmptyView(false);
    }
  }, [selectedItems]);

  const handleClearTrash = useCallback(async () => {
    try {
      await onClearTrash?.();
      setShowEmptyView(true);
      setSelectedItems([]);
      setDeletedItemIds(new Set());
      setRestoredItemIds(new Set());
    } catch (error) {
      console.error('Failed to clear trash:', error);
    }
  }, [onClearTrash]);

  const handleViewModeChange = useCallback((mode: string) => {
    const newViewMode = mode as 'grid' | 'list';
    setViewMode(newViewMode);

    try {
      sessionStorage.setItem('trash-view-mode', newViewMode);
    } catch (error) {
      console.warn('Failed to save view mode to sessionStorage:', error);
    }
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowEmptyView(false);
    }
  }, []);

  const handleFiltersChange = useCallback((newFilters: TrashFilters) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.name ?? '');

    const hasActiveFilters = newFilters.fileType || newFilters.deletedBy || newFilters.trashedDate;
    if (hasActiveFilters) {
      setShowEmptyView(false);
    }
  }, []);

  const handleNavigateToFolder = useCallback(
    (folderId: string) => {
      navigate(`/trash/${folderId}`);
      setSelectedItems([]);
      setShowEmptyView(false);
    },
    [navigate]
  );

  const handleNavigateBack = useCallback(() => {
    navigate('/trash');
    setSelectedItems([]);
    setShowEmptyView(false);
  }, [navigate]);

  useEffect(() => {
    setSelectedItems([]);
    setShowEmptyView(false);
  }, [folderId]);

  const commonViewProps = {
    onRestore: handleRestoreFile,
    onDelete: handlePermanentDelete,
    onPermanentDelete: handlePermanentDelete,
    filters,
    selectedItems,
    onSelectionChange: setSelectedItems,
    deletedItemIds,
    restoredItemIds,
    currentFolderId: folderId,
    onNavigateToFolder: handleNavigateToFolder,
    onNavigateBack: handleNavigateBack,
    data: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
  };

  const EmptyTrashView = () => (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
      <div className="text-6xl mb-6">🗑️</div>
      <h3 className="text-xl font-medium text-high-emphasis mb-2">Trash is empty</h3>
      <p className="text-medium-emphasis max-w-sm">All items have been permanently deleted</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full space-y-4">
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
        {showEmptyView ? (
          <EmptyTrashView />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="h-full overflow-y-auto">
                <TrashGridView {...commonViewProps} />
              </div>
            ) : (
              <div className="h-full">
                <TrashFilesListView {...commonViewProps} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Trash;
