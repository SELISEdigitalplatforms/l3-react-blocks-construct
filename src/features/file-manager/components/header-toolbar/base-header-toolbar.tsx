import { useState } from 'react';

import { ListFilter, X } from 'lucide-react';
import { FilterType, HeaderToolbarConfig } from '../../types/header-toolbar.type';
import { useIsMobile } from 'hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import { countActiveFilters, SearchInput } from '../common-filters';
import { HeaderActions } from './header-actions';
import AddDropdownMenu from '../file-manager-add-new-dropdown';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import { Button } from 'components/ui/button';
import { FilterControls } from './filter-controls';
import { ActiveFilters } from './active-filters';
import { ViewToggle } from './view-toggle';

export const BaseHeaderToolbar = <T extends FilterType>({
  title,
  viewMode,
  searchQuery,
  filters,
  selectedItems = [],
  showFileUpload = false,
  showFolderCreate = false,
  filterConfigs,
  actions = [],
  onViewModeChange,
  onSearchChange,
  onFiltersChange,
  onFileUpload,
  onFolderCreate,
}: HeaderToolbarConfig<T>) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [openSheet, setOpenSheet] = useState(false);

  const handleSearchChange = (query: string) => {
    onSearchChange(query);
    onFiltersChange({
      ...filters,
      name: query,
    } as T);
  };

  const handleResetFilters = () => {
    const resetFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = key === 'name' ? '' : undefined;
      return acc;
    }, {} as any);

    onSearchChange('');
    onFiltersChange(resetFilters as T);
  };

  const activeFiltersCount = countActiveFilters(filters);
  const hasActiveFilters = activeFiltersCount > 0;

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between w-full">
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t(title)}</h3>
          <div className="flex gap-2">
            <HeaderActions actions={actions} selectedItems={selectedItems} isMobile={true} />
            {(showFileUpload || showFolderCreate) && (
              <AddDropdownMenu onFileUpload={onFileUpload} onFolderCreate={onFolderCreate} />
            )}
          </div>
        </div>

        <div className="flex items-center w-full mt-2">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
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
                  <FilterControls
                    filters={filters}
                    filterConfigs={filterConfigs}
                    onFiltersChange={onFiltersChange}
                    isMobile={true}
                  />
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 w-full">
                    {t('RESET')}
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </SheetContent>
            </Sheet>

            <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} className="h-8" />
          </div>
        </div>

        <ActiveFilters
          filters={filters}
          filterConfigs={filterConfigs}
          onFiltersChange={onFiltersChange}
          onResetAll={handleResetFilters}
        />
      </div>
    );
  }

  // Desktop view
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t(title)}</h3>
        <div className="flex items-center gap-2">
          <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} className="h-10" />
          <HeaderActions actions={actions} selectedItems={selectedItems} isMobile={false} />
          {(showFileUpload || showFolderCreate) && (
            <AddDropdownMenu onFileUpload={onFileUpload} onFolderCreate={onFolderCreate} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="SEARCH_BY_FILE_FOLDER_NAME"
          className="flex-1 max-w-md"
        />

        <FilterControls
          filters={filters}
          filterConfigs={filterConfigs}
          onFiltersChange={onFiltersChange}
          isMobile={false}
        />
      </div>

      <ActiveFilters
        filters={filters}
        filterConfigs={filterConfigs}
        onFiltersChange={onFiltersChange}
        onResetAll={handleResetFilters}
      />
    </div>
  );
};
