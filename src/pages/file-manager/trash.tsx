/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';
import { AlignJustify, LayoutGrid, ListFilter, Recycle, RotateCcw, X } from 'lucide-react';
import { fileTypeOptions, IFileTrashData } from 'features/file-manager/utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { TrashFilesListView } from 'features/file-manager/components/trash/trash-files-list-view';
import { DateRange } from 'features/file-manager/types/file-manager.type';
import {
  ActiveFilterBadge,
  ActiveFiltersContainer,
  countActiveFilters,
  DateRangeFilter,
  getDateRangeLabel,
  SearchInput,
  SelectFilter,
} from 'features/file-manager/components/common-filters';
import { TrashGridView } from 'features/file-manager/components/trash/trash-files-grid-view';

interface TrashFilters {
  name: string;
  fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  deletedBy?: string;
  trashedDate?: DateRange;
}

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

const TrashHeaderToolbar: React.FC<TrashHeaderToolbarProps> = ({
  viewMode = 'list',
  handleViewMode,
  searchQuery = '',
  onSearchChange,
  filters,
  onFiltersChange,
  onClearTrash,
  onRestoreSelected,
  selectedItems = [],
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [openSheet, setOpenSheet] = useState(false);

  const handleSearchChange = (query: string) => {
    onSearchChange?.(query);
    onFiltersChange({
      ...filters,
      name: query,
    });
  };

  const handleSearchClear = () => {
    onSearchChange?.('');
    onFiltersChange({
      ...filters,
      name: '',
    });
  };

  const handleFileTypeChange = (value: string) => {
    const fileType = value === 'all' ? undefined : (value as TrashFilters['fileType']);
    onFiltersChange({
      ...filters,
      fileType,
    });
  };

  const handleTrashedDateChange = (dateRange?: DateRange) => {
    onFiltersChange({
      ...filters,
      trashedDate: dateRange,
    });
  };

  const handleResetFilters = () => {
    onSearchChange?.('');
    onFiltersChange({
      name: '',
      fileType: undefined,
      deletedBy: undefined,
      trashedDate: undefined,
    });
  };

  const activeFiltersCount = countActiveFilters(filters);
  const isFiltered = activeFiltersCount > 0;

  const FilterControls = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'space-y-4' : 'flex items-center gap-2'}`}>
      <div className={isMobile ? 'w-full' : ''}>
        <label className={`text-sm font-medium ${isMobile ? 'block mb-2' : 'sr-only'}`}>
          {t('FILE_TYPE')}
        </label>
        <SelectFilter
          value={filters.fileType}
          onValueChange={handleFileTypeChange}
          title="FILE_TYPE"
          options={fileTypeOptions}
          allValue="all"
          allLabel="ALL_TYPES"
          className={isMobile ? 'w-full' : 'w-[140px]'}
        />
      </div>

      {isMobile && (
        <div className="w-full">
          <label className="text-sm font-medium block mb-2">{t('TRASHED_DATE')}</label>
          <DateRangeFilter
            date={filters.trashedDate}
            onDateChange={handleTrashedDateChange}
            title="TRASHED_DATE"
          />
        </div>
      )}
    </div>
  );

  const ActiveFilters = () => {
    const activeFilters = [];

    if (filters.fileType) {
      activeFilters.push(
        <ActiveFilterBadge
          key="fileType"
          label={t(filters.fileType.toUpperCase())}
          onRemove={() => handleFileTypeChange('all')}
        />
      );
    }

    if (filters.trashedDate?.from || filters.trashedDate?.to) {
      const label = getDateRangeLabel(filters.trashedDate);
      if (label) {
        activeFilters.push(
          <ActiveFilterBadge
            key="trashedDate"
            label={`Trashed: ${label}`}
            onRemove={() => handleTrashedDateChange()}
          />
        );
      }
    }

    return activeFilters.length > 0 ? (
      <ActiveFiltersContainer onResetAll={handleResetFilters}>
        {activeFilters}
      </ActiveFiltersContainer>
    ) : null;
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between w-full">
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t('TRASH')}</h3>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <Button size="sm" variant="outline" className="h-8" onClick={onRestoreSelected}>
                <RotateCcw className="h-4 w-4 mr-1" />
                {t('RESTORE')}
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-8 bg-white" onClick={onClearTrash}>
              <Recycle className="h-4 w-4 mr-1" />
              {t('CLEAR_TRASH')}
            </Button>
          </div>
        </div>

        <div className="flex items-center w-full mt-2">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            placeholder="SEARCH_BY_FILE_FOLDER_NAME"
            className="flex-grow"
          />

          <div className="flex ml-2 gap-1">
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <ListFilter className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="w-full">
                <SheetHeader>
                  <SheetTitle>{t('FILTERS')}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <FilterControls isMobile={true} />
                </div>
                {isFiltered && (
                  <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 w-full">
                    {t('RESET')}
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </SheetContent>
            </Sheet>

            <Tabs value={viewMode} onValueChange={handleViewMode}>
              <TabsList className="border rounded-lg flex h-8">
                <TabsTrigger value="list" className="px-2">
                  <AlignJustify className="h-3 w-3" />
                </TabsTrigger>
                <TabsTrigger value="grid" className="px-2">
                  <LayoutGrid className="h-3 w-3" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <ActiveFilters />
      </div>
    );
  }

  // Desktop view
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t('TRASH')}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={handleViewMode}>
            <TabsList className="rounded-lg flex h-10">
              <TabsTrigger value="list" className="p-2">
                <AlignJustify className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="grid" className="p-2">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {selectedItems.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-10 text-sm font-bold"
              onClick={onRestoreSelected}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {t('RESTORE')} ({selectedItems.length})
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-10 text-sm font-bold"
            onClick={onClearTrash}
          >
            <Recycle className="h-4 w-4 mr-1" />
            {t('CLEAR_TRASH')}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="SEARCH_BY_FILE_FOLDER_NAME"
        />

        <div className="flex items-center gap-2">
          <SelectFilter
            value={filters.fileType}
            onValueChange={handleFileTypeChange}
            title="FILE_TYPE"
            options={fileTypeOptions}
            allValue="all"
            allLabel="ALL_TYPES"
          />

          <DateRangeFilter
            date={filters.trashedDate}
            onDateChange={handleTrashedDateChange}
            title="TRASHED_DATE"
          />
        </div>
      </div>

      {isFiltered && <ActiveFilters />}
    </div>
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
    setSearchQuery(newFilters.name);
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
