/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Button } from 'components/ui/button';
import {
  AlignJustify,
  LayoutGrid,
  ListFilter,
  PlusCircle,
  Recycle,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { Calendar } from 'components/ui/calendar';
import { IFileTrashData } from 'features/file-manager/utils/file-manager';
import { useIsMobile } from 'hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Badge } from 'components/ui/badge';
import { Input } from 'components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import TrashFilesListView from 'features/file-manager/components/trash/trash-files-list-view';
import TrashGridView from 'features/file-manager/components/trash/trash-files-grid-view';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface TrashFilters {
  name: string;
  fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  deletedBy?: string;
  trashedDate?: DateRange;
}

const DateRangeFilter: React.FC<{
  date?: DateRange;
  onDateChange: (date?: DateRange) => void;
  title: string;
}> = ({ date, onDateChange, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleDateSelect = (selectedDate: Date | undefined, type: 'from' | 'to') => {
    if (!selectedDate) return;

    const newRange = {
      from: type === 'from' ? selectedDate : date?.from,
      to: type === 'to' ? selectedDate : date?.to,
    };

    onDateChange(newRange);
  };

  const clearDateRange = () => {
    onDateChange(undefined);
  };

  const formatDateRange = (range?: DateRange) => {
    if (!range?.from && !range?.to) return t(title);
    if (range.from && !range.to) return `From ${range.from.toLocaleDateString()}`;
    if (!range.from && range.to) return `Until ${range.to?.toLocaleDateString()}`;
    return `${range.from?.toLocaleDateString()} - ${range.to?.toLocaleDateString()}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 px-3 justify-start">
          <PlusCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">{formatDateRange(date)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">{t(title)}</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearDateRange}>
                Clear filter
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-x-4 flex">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">From</label>
              <Calendar
                mode="single"
                selected={date?.from}
                onSelect={(date) => handleDateSelect(date, 'from')}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">To</label>
              <Calendar
                mode="single"
                selected={date?.to}
                onSelect={(date) => handleDateSelect(date, 'to')}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <Button variant="outline" onClick={clearDateRange} className="w-full">
              Clear filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    onSearchChange?.(newQuery);
    onFiltersChange({
      ...filters,
      name: newQuery,
    });
  };

  const clearSearch = () => {
    onSearchChange?.('');
    onFiltersChange({
      ...filters,
      name: '',
    });
  };

  const handleFileTypeChange = (value: string) => {
    const fileType =
      value === 'all' ? undefined : (value as 'Folder' | 'File' | 'Image' | 'Audio' | 'Video');
    onFiltersChange({
      ...filters,
      fileType,
    });
  };

  const handleTrashedDateRangeChange = (dateRange?: DateRange) => {
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

  const isFiltered = filters.name || filters.fileType || filters.deletedBy || filters.trashedDate;
  const activeFiltersCount =
    (filters.name ? 1 : 0) +
    (filters.fileType ? 1 : 0) +
    (filters.deletedBy ? 1 : 0) +
    (filters.trashedDate?.from || filters.trashedDate?.to ? 1 : 0);

  const fileTypeOptions = [
    { value: 'Folder', label: t('FOLDER') },
    { value: 'File', label: t('FILE') },
    { value: 'Image', label: t('IMAGE') },
    { value: 'Audio', label: t('AUDIO') },
    { value: 'Video', label: t('VIDEO') },
  ];

  const FilterControls = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'space-y-4' : 'flex items-center gap-2'}`}>
      <div className={isMobile ? 'w-full' : ''}>
        <label className={`text-sm font-medium ${isMobile ? 'block mb-2' : 'sr-only'}`}>
          {t('FILE_TYPE')}
        </label>
        <Select value={filters.fileType || 'all'} onValueChange={handleFileTypeChange}>
          <SelectTrigger className={`h-8 ${isMobile ? 'w-full' : 'w-[140px]'}`}>
            <SelectValue placeholder={t('FILE_TYPE')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('ALL_TYPES')}</SelectItem>
            {fileTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isMobile && (
        <>
          <div className="w-full">
            <label className="text-sm font-medium block mb-2">{t('TRASHED_DATE')}</label>
            <DateRangeFilter
              date={filters.trashedDate}
              onDateChange={handleTrashedDateRangeChange}
              title="TRASHED_DATE"
            />
          </div>
        </>
      )}
    </div>
  );

  const ActiveFilters = () => {
    const activeFilters = [];

    if (filters.fileType) {
      activeFilters.push(
        <Badge key="fileType" variant="secondary" className="h-6 text-foreground">
          {t(filters.fileType.toUpperCase())}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => handleFileTypeChange('all')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.trashedDate?.from || filters.trashedDate?.to) {
      const dateRange = filters.trashedDate;
      const label =
        dateRange.from && dateRange.to
          ? `Trashed: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
          : dateRange.from
            ? `Trashed from ${dateRange.from.toLocaleDateString()}`
            : `Trashed until ${dateRange.to?.toLocaleDateString()}`;

      activeFilters.push(
        <Badge key="trashedDate" variant="secondary" className="h-6">
          {label}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => handleTrashedDateRangeChange(undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    return activeFilters.length > 0 ? (
      <div className="flex flex-wrap gap-2 mt-2">{activeFilters}</div>
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
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('SEARCH_BY_FILE_FOLDER_NAME')}
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="h-8 w-full rounded-lg bg-background pl-8 pr-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t('SEARCH_BY_FILE_FOLDER_NAME')}
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="h-8 w-full rounded-lg bg-background pl-9 pr-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DateRangeFilter
            date={filters.trashedDate}
            onDateChange={handleTrashedDateRangeChange}
            title="TRASHED_DATE"
          />
        </div>
      </div>

      {isFiltered && (
        <div className="flex items-center gap-2">
          <ActiveFilters />
          <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2">
            {t('RESET')}
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

interface TrashProps {
  onRestoreFile?: (file: IFileTrashData) => void;
  onPermanentDelete?: (file: IFileTrashData) => void;
  onClearTrash?: () => void;
}

export const Trash: React.FC<TrashProps> = ({ onRestoreFile, onPermanentDelete, onClearTrash }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState<TrashFilters>({
    name: '',
    fileType: undefined,
    deletedBy: undefined,
    trashedDate: undefined,
  });

  const handleRestoreFile = useCallback(
    (file: IFileTrashData) => {
      console.log('Restore file:', file);
      onRestoreFile?.(file);
    },
    [onRestoreFile]
  );

  const handlePermanentDelete = useCallback(
    (file: IFileTrashData) => {
      console.log('Permanently delete:', file);
      onPermanentDelete?.(file);
    },
    [onPermanentDelete]
  );

  const handleRestoreSelected = useCallback(() => {
    console.log('Restore selected items:', selectedItems);
  }, [selectedItems]);

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
        onClearTrash={onClearTrash}
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
