/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-console */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from 'hooks/use-mobile';
import { ListFilter, AlignJustify, LayoutGrid, X } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';

import AddDropdownMenu from 'features/file-manager/components/file-manager-add-new-dropdown';
import MyFilesListView from '../../features/file-manager/components/my-files/my-files-list-view';
import { ShareWithMeModal } from 'features/file-manager/components/modals/shared-user-modal';
import {
  FileManagerHeaderToolbarProps,
  fileTypeOptions,
} from 'features/file-manager/utils/file-manager';
import { DateRange } from 'features/file-manager/types/file-manager.type';
import { RenameModal } from 'features/file-manager/components/modals/rename-modal';
import MyFileGridView from 'features/file-manager/components/my-files/my-files-grid-view';
import { FileManagerLayout } from 'features/file-manager/file-manager-layout';
import { FileViewRenderer } from 'features/file-manager/components/file-view-renderer';
import { useFileManager } from 'features/file-manager/hooks/use-file-manager';
import { useFileFilters } from 'features/file-manager/hooks/use-file-filters';
import { FileModals } from 'features/file-manager/components/modals/file-modals';
import {
  ActiveFilterBadge,
  ActiveFiltersContainer,
  countActiveFilters,
  DateRangeFilter,
  FileFilters,
  getDateRangeLabel,
  SearchInput,
  SelectFilter,
  UserFilter,
} from 'features/file-manager/components/common-filters';

const FileManagerHeaderToolbar: React.FC<FileManagerHeaderToolbarProps> = ({
  viewMode = 'grid',
  handleViewMode,
  searchQuery = '',
  onSearchChange,
  filters,
  onFiltersChange,
  onFileUpload,
  onFolderCreate,
  sharedUsers = [],
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

  const handleFileTypeChange = (value: string) => {
    const fileType =
      value === 'all' ? undefined : (value as 'Folder' | 'File' | 'Image' | 'Audio' | 'Video');
    onFiltersChange({
      ...filters,
      fileType,
    });
  };

  const handleDateRangeChange = (dateRange?: DateRange) => {
    onFiltersChange({
      ...filters,
      lastModified: dateRange,
    });
  };

  const handleSharedByChange = (userId?: string) => {
    onFiltersChange({
      ...filters,
      sharedBy: userId,
    });
  };

  const handleResetFilters = () => {
    onSearchChange?.('');
    onFiltersChange({
      name: '',
      fileType: undefined,
      lastModified: undefined,
      sharedBy: undefined,
    });
  };

  const activeFiltersCount = countActiveFilters(filters);
  const hasActiveFilters = activeFiltersCount > 0;

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
          allLabel="ALL_TYPES"
          className={isMobile ? 'w-full' : 'w-[140px]'}
        />
      </div>

      {isMobile && (
        <>
          <div className="w-full">
            <label className="text-sm font-medium block mb-2">{t('LAST_MODIFIED')}</label>
            <DateRangeFilter
              date={filters.lastModified}
              onDateChange={handleDateRangeChange}
              title="LAST_MODIFIED"
            />
          </div>

          {sharedUsers.length > 0 && (
            <div className="w-full">
              <label className="text-sm font-medium block mb-2">{t('SHARED_BY')}</label>
              <UserFilter
                value={filters.sharedBy}
                onValueChange={handleSharedByChange}
                title="SHARED_BY"
                users={sharedUsers}
              />
            </div>
          )}
        </>
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

    const dateRangeLabel = getDateRangeLabel(filters.lastModified);
    if (dateRangeLabel) {
      activeFilters.push(
        <ActiveFilterBadge
          key="lastModified"
          label={dateRangeLabel}
          onRemove={() => handleDateRangeChange()}
        />
      );
    }

    if (filters.sharedBy) {
      const selectedUser = sharedUsers.find(
        (user: { id: string; name: string }) => user.id === filters.sharedBy
      );
      if (selectedUser) {
        activeFilters.push(
          <ActiveFilterBadge
            key="sharedBy"
            label={selectedUser.name}
            onRemove={() => handleSharedByChange()}
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

  const ViewToggle = ({ className = '' }: { className?: string }) => (
    <Tabs value={viewMode} onValueChange={handleViewMode}>
      <TabsList className={`border rounded-lg flex ${className}`}>
        <TabsTrigger value="list" className="px-2">
          <AlignJustify className="h-3 w-3" />
        </TabsTrigger>
        <TabsTrigger value="grid" className="px-2">
          <LayoutGrid className="h-3 w-3" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between w-full">
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
            {t('FILE_MANAGER')}
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
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 w-full">
                    {t('RESET')}
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </SheetContent>
            </Sheet>

            <ViewToggle className="h-8" />
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
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t('MY_FILES')}</h3>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle className="h-10" />
          <AddDropdownMenu onFileUpload={onFileUpload} onFolderCreate={onFolderCreate} />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="SEARCH_BY_FILE_FOLDER_NAME"
        />

        <div className="flex items-center gap-2">
          <DateRangeFilter
            date={filters.lastModified}
            onDateChange={handleDateRangeChange}
            title="LAST_MODIFIED"
          />

          <SelectFilter
            value={filters.fileType}
            onValueChange={handleFileTypeChange}
            title="FILE_TYPE"
            options={fileTypeOptions}
            allLabel="ALL_TYPES"
          />

          {sharedUsers.length > 0 && (
            <UserFilter
              value={filters.sharedBy}
              onValueChange={handleSharedByChange}
              title="SHARED_BY"
              users={sharedUsers}
            />
          )}
        </div>
      </div>

      {hasActiveFilters && <ActiveFilters />}
    </div>
  );
};

interface FileManagerMyFilesProps {
  onCreateFile?: () => void;
}

export const FileManagerMyFiles: React.FC<FileManagerMyFilesProps> = ({ onCreateFile }) => {
  const fileManager = useFileManager({ onCreateFile });
  const { filters, handleFiltersChange } = useFileFilters<FileFilters>({
    name: '',
    fileType: undefined,
    lastModified: undefined,
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
    <FileManagerHeaderToolbar
      onOpen={fileManager.handleCreateFile}
      viewMode={fileManager.viewMode}
      handleViewMode={fileManager.handleViewModeChange}
      searchQuery={fileManager.searchQuery}
      onSearchChange={handleSearchChange}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onFileUpload={(files) => fileManager.handleFileUpload(files, false)}
      onFolderCreate={(name) => fileManager.handleFolderCreate(name, false)}
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
        GridComponent={MyFileGridView}
        ListComponent={MyFilesListView}
        commonViewProps={commonViewProps}
      />
    </FileManagerLayout>
  );
};
