/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { X, ListFilter, AlignJustify, LayoutGrid } from 'lucide-react';

import { useIsMobile } from 'hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui/button';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import SharedFilesListView from 'features/file-manager/components/shared-with-me/shared-files-list-view';
import { DateRange } from 'features/file-manager/types/file-manager.type';

import { ShareWithMeModal } from 'features/file-manager/components/modals/shared-user-modal';
import AddDropdownMenu from 'features/file-manager/components/file-manager-add-new-dropdown';
import { RenameModal } from 'features/file-manager/components/modals/rename-modal';
import SharedFilesGridView from 'features/file-manager/components/shared-with-me/shared-files-grid-view';
import { useFileManager } from 'features/file-manager/hooks/use-file-manager';
import { useFileFilters } from 'features/file-manager/hooks/use-file-filters';
import { FileModals } from 'features/file-manager/components/modals/file-modals';
import { FileManagerLayout } from 'features/file-manager/file-manager-layout';
import { FileViewRenderer } from 'features/file-manager/components/file-view-renderer';
import {
  ActiveFilterBadge,
  ActiveFiltersContainer,
  countActiveFilters,
  DateRangeFilter,
  getDateRangeLabel,
  SearchInput,
  SelectFilter,
  User,
  UserFilter,
} from 'features/file-manager/components/common-filters';
import { fileTypeOptions, sharedUsers } from 'features/file-manager/utils/file-manager';

interface SharedFilters {
  name?: string;
  fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  sharedBy?: string;
  sharedDate?: DateRange;
  modifiedDate?: DateRange;
}

interface SharedWithMeHeaderToolbarProps {
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: SharedFilters;
  onFiltersChange: (filters: SharedFilters) => void;
  onFileUpload?: (files: File[]) => void;
  onFolderCreate?: (folderName: string) => void;
}

export const SharedWithMeHeaderToolbar: React.FC<SharedWithMeHeaderToolbarProps> = ({
  viewMode = 'grid',
  handleViewMode,
  searchQuery = '',
  onSearchChange,
  filters,
  onFiltersChange,
  onFileUpload,
  onFolderCreate,
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [openSheet, setOpenSheet] = useState(false);

  // Filter handlers
  const handleSharedByChange = (value?: string) => {
    onFiltersChange({
      ...filters,
      sharedBy: value,
    });
  };

  const handleSearchChange = (query: string) => {
    onSearchChange?.(query);
    onFiltersChange({
      ...filters,
      name: query,
    });
  };

  const handleFileTypeChange = (value: string) => {
    const fileType = value === 'all' ? undefined : (value as SharedFilters['fileType']);
    onFiltersChange({
      ...filters,
      fileType,
    });
  };

  const handleSharedDateRangeChange = (dateRange?: DateRange) => {
    onFiltersChange({
      ...filters,
      sharedDate: dateRange,
    });
  };

  const handleModifiedDateRangeChange = (dateRange?: DateRange) => {
    onFiltersChange({
      ...filters,
      modifiedDate: dateRange,
    });
  };

  const handleResetFilters = () => {
    onSearchChange?.('');
    onFiltersChange({
      name: '',
      fileType: undefined,
      sharedBy: undefined,
      sharedDate: undefined,
      modifiedDate: undefined,
    });
  };

  // Helper functions
  const isFiltered = Object.values(filters).some((value) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'object' && 'from' in value && 'to' in value) {
      return value.from || value.to;
    }
    return true;
  });

  const activeFiltersCount = countActiveFilters(filters);

  // Filter Controls Component
  const FilterControls = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'space-y-4' : 'flex items-center gap-2'}`}>
      <div className={isMobile ? 'w-full' : ''}>
        {isMobile && <label className="text-sm font-medium block mb-2">{t('FILE_TYPE')}</label>}
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
        <>
          <div className="w-full">
            <label className="text-sm font-medium block mb-2">{t('SHARED_BY')}</label>
            <UserFilter
              value={filters.sharedBy}
              onValueChange={handleSharedByChange}
              title="SHARED_BY"
              users={sharedUsers}
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium block mb-2">{t('SHARED_DATE')}</label>
            <DateRangeFilter
              date={filters.sharedDate}
              onDateChange={handleSharedDateRangeChange}
              title="SHARED_DATE"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium block mb-2">{t('MODIFIED_DATE')}</label>
            <DateRangeFilter
              date={filters.modifiedDate}
              onDateChange={handleModifiedDateRangeChange}
              title="MODIFIED_DATE"
            />
          </div>
        </>
      )}
    </div>
  );

  // Active Filters Component
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

    if (filters.sharedBy) {
      const selectedUser = sharedUsers.find((user) => user.id === filters.sharedBy);
      if (selectedUser) {
        activeFilters.push(
          <ActiveFilterBadge
            key="sharedBy"
            label={`Shared by ${selectedUser.name}`}
            onRemove={() => handleSharedByChange(undefined)}
          />
        );
      }
    }

    if (filters.sharedDate?.from || filters.sharedDate?.to) {
      const label = getDateRangeLabel(filters.sharedDate);
      if (label) {
        activeFilters.push(
          <ActiveFilterBadge
            key="sharedDate"
            label={`Shared: ${label}`}
            onRemove={() => handleSharedDateRangeChange(undefined)}
          />
        );
      }
    }

    if (filters.modifiedDate?.from || filters.modifiedDate?.to) {
      const label = getDateRangeLabel(filters.modifiedDate);
      if (label) {
        activeFilters.push(
          <ActiveFilterBadge
            key="modifiedDate"
            label={`Modified: ${label}`}
            onRemove={() => handleModifiedDateRangeChange(undefined)}
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
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
            {t('SHARED_WITH_ME')}
          </h3>
          <AddDropdownMenu onFileUpload={onFileUpload} onFolderCreate={onFolderCreate} />
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
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
            {t('SHARED_WITH_ME')}
          </h3>
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
          <AddDropdownMenu onFileUpload={onFileUpload} onFolderCreate={onFolderCreate} />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="SEARCH_BY_FILE_FOLDER_NAME"
          className="flex-1 max-w-md"
        />

        <div className="flex items-center gap-2">
          <UserFilter
            value={filters.sharedBy}
            onValueChange={handleSharedByChange}
            title="SHARED_BY"
            users={sharedUsers}
          />
          <DateRangeFilter
            date={filters.sharedDate}
            onDateChange={handleSharedDateRangeChange}
            title="SHARED_DATE"
          />
          <DateRangeFilter
            date={filters.modifiedDate}
            onDateChange={handleModifiedDateRangeChange}
            title="MODIFIED_DATE"
          />
          <SelectFilter
            value={filters.fileType}
            onValueChange={handleFileTypeChange}
            title="FILE_TYPE"
            options={fileTypeOptions}
            allValue="all"
            allLabel="ALL_TYPES"
            className="w-[140px]"
          />
        </div>
      </div>

      {isFiltered && <ActiveFilters />}
    </div>
  );
};

interface SharedWithMeProps {
  onCreateFile?: () => void;
}

export const SharedWithMe: React.FC<SharedWithMeProps> = ({ onCreateFile }) => {
  const fileManager = useFileManager({ onCreateFile });
  const { filters, handleFiltersChange } = useFileFilters<SharedFilters>({
    name: '',
    fileType: undefined,
    sharedBy: undefined,
    sharedDate: undefined,
    modifiedDate: undefined,
  });

  const handleSearchChange = useCallback(
    (query: string) => {
      fileManager.handleSearchChange(query);
      handleFiltersChange({
        ...filters,
        name: query,
      });
    },
    [fileManager, handleFiltersChange, filters]
  );

  const commonViewProps = {
    onViewDetails: fileManager.handleViewDetails,
    onDownload: fileManager.handleDownload,
    onShare: fileManager.handleShare,
    onDelete: fileManager.handleDelete,
    onMove: fileManager.handleMove,
    onCopy: fileManager.handleCopy,
    onOpen: fileManager.handleOpen,
    onRename: fileManager.handleRename,
    onRenameUpdate: fileManager.handleRenameUpdate,
    filters,
    newFiles: fileManager.newFiles,
    newFolders: fileManager.newFolders,
    renamedFiles: fileManager.renamedFiles,
    fileSharedUsers: fileManager.fileSharedUsers,
    filePermissions: fileManager.filePermissions,
  };

  const headerToolbar = (
    <SharedWithMeHeaderToolbar
      viewMode={fileManager.viewMode}
      handleViewMode={fileManager.handleViewModeChange}
      searchQuery={fileManager.searchQuery}
      onSearchChange={handleSearchChange}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onFileUpload={(files) => fileManager.handleFileUpload(files, true)}
      onFolderCreate={(name) => fileManager.handleFolderCreate(name, true)}
    />
  );

  const modals = (
    <FileModals
      isRenameModalOpen={fileManager.isRenameModalOpen}
      onRenameModalClose={fileManager.handleRenameModalClose}
      onRenameConfirm={fileManager.handleRenameConfirm}
      fileToRename={
        fileManager.fileToRename
          ? { ...fileManager.fileToRename, isShared: !!fileManager.fileToRename.isShared }
          : null
      }
      isShareModalOpen={fileManager.isShareModalOpen}
      onShareModalClose={fileManager.handleShareModalClose}
      onShareConfirm={fileManager.handleShareConfirm}
      fileToShare={
        fileManager.fileToShare
          ? { ...fileManager.fileToShare, isShared: !!fileManager.fileToShare.isShared }
          : null
      }
      RenameModalComponent={RenameModal}
      ShareModalComponent={ShareWithMeModal}
    />
  );

  return (
    <FileManagerLayout headerToolbar={headerToolbar} modals={modals}>
      <FileViewRenderer
        viewMode={fileManager.viewMode}
        GridComponent={SharedFilesGridView}
        ListComponent={SharedFilesListView}
        commonViewProps={commonViewProps}
      />
    </FileManagerLayout>
  );
};

export default SharedWithMe;
