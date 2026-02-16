import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useViewMode } from '@/hooks/use-view-mode';
import { IFileTrashData } from '../../utils/file-manager';
import { TrashFilters } from '../../types/header-toolbar.type';
import { useMockTrashFilesQuery } from '../../hooks/use-mock-trash-files-query';
import { TrashHeaderToolbar } from '../../components/trash/trash-files-header-toolbar/trash-files-header-toolbar';
import { TrashGridView } from '../../components/trash/trash-files-grid-view/trash-files-grid-view';
import { TrashFilesListView } from '../../components/trash/trash-files-list-view/trash-files-list-view';

interface TrashPageProps {
  onRestoreFile?: (file: IFileTrashData) => void;
  readonly onPermanentDelete?: (file: IFileTrashData) => void;
  onClearTrash?: () => void;
}

const EmptyTrashView = () => (
  <div className="flex flex-col items-center justify-center h-full p-12 text-center">
    <div className="text-6xl mb-6">🗑️</div>
    <h3 className="text-xl font-medium text-high-emphasis mb-2">Trash is empty</h3>
    <p className="text-medium-emphasis max-w-sm">All items have been permanently deleted</p>
  </div>
);

export const TrashPage = ({
  onRestoreFile,
  onPermanentDelete,
  onClearTrash,
}: Readonly<TrashPageProps>) => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId?: string }>();

  const { viewMode, handleViewModeChange } = useViewMode({
    storageKey: 'trash-view-mode',
    defaultMode: 'list',
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
      name: filters.name ?? searchQuery,
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

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowEmptyView(false);
    }
  }, []);

  const handleFiltersChange = useCallback((newFilters: TrashFilters) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.name ?? '');

    const hasActiveFilters = newFilters.fileType ?? newFilters.deletedBy ?? newFilters.trashedDate;
    if (hasActiveFilters) {
      setShowEmptyView(false);
    }
  }, []);

  const handleNavigateToFolder = useCallback(
    (folderId: string) => {
      navigate(`/file-manager/trash/${folderId}`);
      setSelectedItems([]);
      setShowEmptyView(false);
    },
    [navigate]
  );

  const handleNavigateBack = useCallback(() => {
    navigate('/file-manager/trash');
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
    data: data?.data ?? [],
    totalCount: data?.totalCount ?? 0,
    isLoading,
    error,
  };

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
