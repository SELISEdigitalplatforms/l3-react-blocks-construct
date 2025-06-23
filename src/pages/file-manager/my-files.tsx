/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-console */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from 'hooks/use-mobile';
import { Search, PlusCircle, ListFilter, AlignJustify, LayoutGrid, X } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { Calendar } from 'components/ui/calendar';
import { Badge } from 'components/ui/badge';
import AddDropdownMenu from 'features/file-manager/components/file-manager-add-new-dropdown';
import { FileGridView } from 'features/file-manager/components/my-files/my-files-grid-view';
import { RenameModal } from 'features/file-manager/components/rename-modal';
import MyFilesListView from '../../features/file-manager/components/my-files/my-files-list-view';
import { ShareWithMeModal } from 'features/file-manager/components/shared-user-modal';
import {
  fileTypeOptions,
  IFileDataWithSharing,
  SharedUser,
} from 'features/file-manager/utils/file-manager';
import { DateRange } from 'features/file-manager/types/file-manager.type';

interface FileFilters {
  name: string;
  fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  lastModified?: DateRange;
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
    if (!range?.from && !range?.to) return t('LAST_MODIFIED');
    if (range.from && !range.to) return `From ${range.from.toLocaleDateString()}`;
    if (!range.from && range.to) return `Until ${range.to.toLocaleDateString()}`;
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

interface FileManagerHeaderToolbarProps {
  onOpen: () => void;
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters: FileFilters;
  onFiltersChange: (filters: FileFilters) => void;
  onFileUpload?: (files: File[]) => void;
  onFolderCreate?: (folderName: string) => void;
}

const FileManagerHeaderToolbar: React.FC<FileManagerHeaderToolbarProps> = ({
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

  const handleDateRangeChange = (dateRange?: DateRange) => {
    onFiltersChange({
      ...filters,
      lastModified: dateRange,
    });
  };

  const handleResetFilters = () => {
    onSearchChange?.('');
    onFiltersChange({
      name: '',
      fileType: undefined,
      lastModified: undefined,
    });
  };

  const isFiltered = filters.name ?? filters.fileType ?? filters.lastModified;
  const activeFiltersCount =
    (filters.name ? 1 : 0) +
    (filters.fileType ? 1 : 0) +
    ((filters.lastModified?.from ?? filters.lastModified?.to) ? 1 : 0);

  const FilterControls = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'space-y-4' : 'flex items-center gap-2'}`}>
      <div className={isMobile ? 'w-full' : ''}>
        <label className={`text-sm font-medium ${isMobile ? 'block mb-2' : 'sr-only'}`}>
          {t('FILE_TYPE')}
        </label>
        <Select value={filters.fileType ?? 'all'} onValueChange={handleFileTypeChange}>
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
        <div className="w-full">
          <label className="text-sm font-medium block mb-2">{t('LAST_MODIFIED')}</label>
          <DateRangeFilter
            date={filters.lastModified}
            onDateChange={handleDateRangeChange}
            title="LAST_MODIFIED"
          />
        </div>
      )}
    </div>
  );

  const ActiveFilters = () => {
    const activeFilters = [];

    if (filters.fileType) {
      activeFilters.push(
        <Badge key="fileType" variant="secondary" className="h-6  text-foreground">
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

    if (filters.lastModified?.from || filters.lastModified?.to) {
      const dateRange = filters.lastModified;
      const label =
        dateRange.from && dateRange.to
          ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
          : dateRange.from
            ? `From ${dateRange.from.toLocaleDateString()}`
            : `Until ${dateRange.to?.toLocaleDateString()}`;

      activeFilters.push(
        <Badge key="lastModified" variant="secondary" className="h-6">
          {label}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => handleDateRangeChange()}
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
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
            {t('FILE_MANAGER')}
          </h3>

          <AddDropdownMenu onFileUpload={onFileUpload} onFolderCreate={onFolderCreate} />
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
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">{t('MY_FILES')}</h3>
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
            date={filters.lastModified}
            onDateChange={handleDateRangeChange}
            title="LAST_MODIFIED"
          />

          <Select value={filters.fileType ?? 'all'} onValueChange={handleFileTypeChange}>
            <SelectTrigger className="h-8 w-[140px]">
              <PlusCircle className="h-4 w-4 mr-1" />
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

interface FileManagerProps {
  onCreateFile?: () => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ onCreateFile }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FileFilters>({
    name: '',
    fileType: undefined,
    lastModified: undefined,
  });

  const [newFiles, setNewFiles] = useState<IFileDataWithSharing[]>([]);
  const [newFolders, setNewFolders] = useState<IFileDataWithSharing[]>([]);
  const [renamedFiles, setRenamedFiles] = useState<Map<string, IFileDataWithSharing>>(new Map());

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState<IFileDataWithSharing | null>(null);
  const [fileSharedUsers, setFileSharedUsers] = useState<{ [key: string]: SharedUser[] }>({});
  const [filePermissions, setFilePermissions] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<IFileDataWithSharing | null>(null);

  const handleShare = useCallback((file: IFileDataWithSharing) => {
    setFileToShare(file);
    setIsShareModalOpen(true);
  }, []);

  const handleShareModalClose = useCallback(() => {
    setIsShareModalOpen(false);
    setFileToShare(null);
  }, []);

  const handleRename = useCallback((file: IFileDataWithSharing) => {
    setFileToRename(file);
    setIsRenameModalOpen(true);
  }, []);

  const handleRenameConfirm = useCallback(
    (newName: string) => {
      if (!fileToRename) return;

      const updatedFile = {
        ...fileToRename,
        name: newName,
        lastModified: new Date(),
      };

      const isLocalFile =
        fileToRename.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === fileToRename.id)
          : newFiles.some((file) => file.id === fileToRename.id);

      if (isLocalFile) {
        if (fileToRename.fileType === 'Folder') {
          setNewFolders((prev) =>
            prev.map((folder) => (folder.id === fileToRename.id ? updatedFile : folder))
          );
        } else {
          setNewFiles((prev) =>
            prev.map((file) => (file.id === fileToRename.id ? updatedFile : file))
          );
        }
      } else {
        setRenamedFiles((prev) => new Map(prev.set(fileToRename.id, updatedFile)));
      }

      setIsRenameModalOpen(false);
      setFileToRename(null);
    },
    [fileToRename, newFiles, newFolders]
  );

  const handleRenameModalClose = useCallback(() => {
    setIsRenameModalOpen(false);
    setFileToRename(null);
  }, []);

  const handleRenameUpdate = useCallback(
    (oldFile: IFileDataWithSharing, newFile: IFileDataWithSharing) => {
      const isLocalFile =
        oldFile.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === oldFile.id)
          : newFiles.some((file) => file.id === oldFile.id);

      if (isLocalFile) {
        if (oldFile.fileType === 'Folder') {
          setNewFolders((prev) =>
            prev.map((folder) => (folder.id === oldFile.id ? newFile : folder))
          );
        } else {
          setNewFiles((prev) => prev.map((file) => (file.id === oldFile.id ? newFile : file)));
        }
      } else {
        setRenamedFiles((prev) => new Map(prev.set(oldFile.id, newFile)));
      }
    },
    [newFiles, newFolders]
  );

  const getFileTypeFromFile = (file: File): 'File' | 'Image' | 'Audio' | 'Video' => {
    const type = file.type;
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.startsWith('video/')) return 'Video';
    return 'File';
  };

  const handleFileUpload = useCallback((files: File[]) => {
    const uploadedFiles: IFileDataWithSharing[] = files.map((file) => ({
      id: Date.now().toString(),
      name: file.name,
      fileType: getFileTypeFromFile(file),
      size: file.size.toString(),
      lastModified: new Date(),
    }));

    setNewFiles((prev) => [...prev, ...uploadedFiles]);
  }, []);

  const handleFolderCreate = useCallback((folderName: string) => {
    const newFolder: IFileDataWithSharing = {
      id: Date.now().toString(),
      name: folderName,
      fileType: 'Folder',
      size: '0',
      lastModified: new Date(),
    };

    setNewFolders((prev) => [...prev, newFolder]);
  }, []);

  const handleDownload = useCallback((file: IFileDataWithSharing) => {
    console.log('Download:', file);
  }, []);

  const handleDelete = useCallback((file: IFileDataWithSharing) => {
    setNewFiles((prev) => prev.filter((f) => f.id !== file.id));
    setNewFolders((prev) => prev.filter((f) => f.id !== file.id));
    setRenamedFiles((prev) => {
      const newMap = new Map(prev);
      newMap.delete(file.id);
      return newMap;
    });
    setFileSharedUsers((prev) => {
      const newSharedUsers = { ...prev };
      delete newSharedUsers[file.id];
      return newSharedUsers;
    });
    setFilePermissions((prev) => {
      const newPermissions = { ...prev };
      delete newPermissions[file.id];
      return newPermissions;
    });
  }, []);

  const handleViewModeChange = useCallback((mode: string) => {
    setViewMode(mode as 'grid' | 'list');
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({
      ...prev,
      name: query,
    }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: FileFilters) => {
    setFilters((prevFilters) => {
      if (JSON.stringify(prevFilters) === JSON.stringify(newFilters)) {
        return prevFilters;
      }
      return newFilters;
    });
    setSearchQuery(newFilters.name || '');
  }, []);

  const handleCreateFile = useCallback(() => {
    if (onCreateFile) {
      onCreateFile();
    }
  }, [onCreateFile]);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<IFileDataWithSharing | null>(
    null
  );

  const getUpdatedFile = useCallback(
    (file: IFileDataWithSharing): IFileDataWithSharing => {
      const renamedFile = renamedFiles.get(file.id);
      if (renamedFile) {
        return renamedFile;
      }

      const isLocalFile =
        file.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === file.id)
          : newFiles.some((f) => f.id === file.id);

      if (isLocalFile) {
        const localFile =
          file.fileType === 'Folder'
            ? newFolders.find((folder) => folder.id === file.id)
            : newFiles.find((f) => f.id === file.id);
        return localFile || file;
      }

      const sharedUsers = fileSharedUsers[file.id];
      const permissions = filePermissions[file.id];

      if (sharedUsers || permissions) {
        return {
          ...file,
          sharedWith: sharedUsers || file.sharedWith,
          sharePermissions: permissions || file.sharePermissions,
          isShared:
            (sharedUsers && sharedUsers.length > 0) ||
            (file.sharedWith && file.sharedWith.length > 0),
        };
      }

      return file;
    },
    [newFiles, newFolders, renamedFiles, fileSharedUsers, filePermissions]
  );

  const handleViewDetails = useCallback(
    (file: IFileDataWithSharing) => {
      const updatedFile = getUpdatedFile(file);
      setSelectedFileForDetails(updatedFile);
      setIsDetailsOpen(true);
    },
    [getUpdatedFile]
  );

  const handleShareConfirm = useCallback(
    (users: SharedUser[], permissions: { [key: string]: string }) => {
      if (!fileToShare) return;

      const updatedFile = {
        ...fileToShare,
        sharedWith: users,
        sharePermissions: permissions,
        lastModified: new Date(),
        isShared: users.length > 0,
      };

      const isLocalFile =
        fileToShare.fileType === 'Folder'
          ? newFolders.some((folder) => folder.id === fileToShare.id)
          : newFiles.some((file) => file.id === fileToShare.id);

      if (isLocalFile) {
        if (fileToShare.fileType === 'Folder') {
          setNewFolders((prev) =>
            prev.map((folder) => (folder.id === fileToShare.id ? updatedFile : folder))
          );
        } else {
          setNewFiles((prev) =>
            prev.map((file) => (file.id === fileToShare.id ? updatedFile : file))
          );
        }
      } else {
        setRenamedFiles((prev) => new Map(prev.set(fileToShare.id, updatedFile)));
      }

      setFileSharedUsers((prev) => ({
        ...prev,
        [fileToShare.id]: users,
      }));
      setFilePermissions((prev) => ({
        ...prev,
        [fileToShare.id]: permissions,
      }));

      if (selectedFileForDetails && selectedFileForDetails.id === fileToShare.id) {
        setSelectedFileForDetails(updatedFile);
      }

      setIsShareModalOpen(false);
      setFileToShare(null);
    },
    [fileToShare, newFiles, newFolders, selectedFileForDetails]
  );

  const commonViewProps = {
    onViewDetails: handleViewDetails,
    onDownload: handleDownload,
    onShare: handleShare,
    onDelete: handleDelete,

    onRename: handleRename,
    onRenameUpdate: handleRenameUpdate,
    filters,
    newFiles,
    newFolders,
    renamedFiles,
    fileSharedUsers,
    filePermissions,
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4 p-4 md:p-6">
      <FileManagerHeaderToolbar
        onOpen={handleCreateFile}
        viewMode={viewMode}
        handleViewMode={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onFileUpload={handleFileUpload}
        onFolderCreate={handleFolderCreate}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="h-full overflow-y-auto">
            <FileGridView {...commonViewProps} />
          </div>
        ) : (
          <div className="h-full">
            <MyFilesListView {...commonViewProps} />
          </div>
        )}
      </div>

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={handleRenameModalClose}
        onConfirm={handleRenameConfirm}
        file={fileToRename}
      />

      <ShareWithMeModal
        isOpen={isShareModalOpen}
        onClose={handleShareModalClose}
        onConfirm={handleShareConfirm}
        currentSharedUsers={fileToShare ? fileToShare.sharedWith || [] : []}
      />
    </div>
  );
};

export default FileManager;
