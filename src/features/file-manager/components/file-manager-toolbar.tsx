import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignJustify, LayoutGrid, ListFilter, Plus, Search } from 'lucide-react';
import { useIsMobile } from 'hooks/use-mobile';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Tabs, TabsList, TabsTrigger } from 'components/ui/tabs';
import { FileManagerFilterSheet } from './file-manager-filters-sheet';

/**
 * FileManagerToolbar Component
 *
 * A reusable toolbar component for managing files in a file manager application.
 * This component supports:
 * - Switching between grid and list views
 * - Searching for files
 * - Opening a modal to add new files
 * - Managing filters via a filter sheet
 *
 * Features:
 * - Responsive design with separate layouts for mobile and desktop views
 * - Search functionality with a clear button
 * - View mode toggle between "grid" and "list"
 * - Integration with the `TaskManagerFilterSheet` for filtering files
 *
 * Props:
 * @param {() => void} onOpen - Callback to open the file creation modal
 * @param {string} [viewMode='grid'] - The current view mode ('grid' or 'list')
 * @param {(view: string) => void} handleViewMode - Callback to change the view mode
 * @param {string} [searchQuery=''] - Current search query
 * @param {(query: string) => void} onSearchChange - Callback for search query changes
 *
 * @returns {JSX.Element} The file manager toolbar component
 *
 * @example
 * // Basic usage
 * <FileManagerToolbar
 *   onOpen={() => console.log('Open file modal')}
 *   viewMode="grid"
 *   handleViewMode={(view) => console.log('View mode changed:', view)}
 *   searchQuery=""
 *   onSearchChange={(query) => console.log('Search:', query)}
 * />
 */

interface FileManagerHeaderToolbarProps {
  onOpen: () => void;
  viewMode?: string;
  handleViewMode: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function FileManagerHeaderToolbar({
  onOpen,
  viewMode = 'grid',
  handleViewMode,
  searchQuery = '',
  onSearchChange,
}: Readonly<FileManagerHeaderToolbarProps>) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [openSheet, setOpenSheet] = useState(false);

  // Sync local search query with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearchQuery !== searchQuery) {
        onSearchChange(localSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange, searchQuery]);

  useEffect(() => {
    if (openSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [openSheet]);

  const handleFileModalOpen = () => {
    onOpen();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  // mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between w-full">
          <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
            {t('FILE_MANAGER')}
          </h3>

          <Button onClick={handleFileModalOpen} size="sm" className="h-8">
            <Plus className="h-4 w-4" />
            {t('ADD_NEW')}
          </Button>
        </div>

        <div className="flex items-center w-full mt-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('SEARCH')}
              value={localSearchQuery}
              onChange={handleSearchInputChange}
              className="h-8 w-full rounded-lg bg-background pl-8 pr-8"
            />
            {localSearchQuery && (
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
            <Button
              onClick={() => setOpenSheet(true)}
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              <ListFilter className="h-4 w-4" />
            </Button>

            <Tabs value={viewMode} onValueChange={(value) => handleViewMode(value)}>
              <TabsList className="border rounded-lg flex h-8">
                <TabsTrigger value="list" className="px-2">
                  <AlignJustify className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="grid" className="px-2">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <FileManagerFilterSheet open={openSheet} onOpenChange={setOpenSheet} />
      </div>
    );
  }

  // desktop view
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-high-emphasis">
          {t('FILE_MANAGER')}
        </h3>
      </div>
      <div className="flex gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t('SEARCH')}
            value={localSearchQuery}
            onChange={handleSearchInputChange}
            className="h-8 w-full rounded-lg bg-background pl-8 pr-8"
          />
          {localSearchQuery && (
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
        <Button onClick={() => setOpenSheet(true)} variant="outline" size="sm" className="h-8 px-3">
          <ListFilter className="h-4 w-4" />
        </Button>
        <Tabs value={viewMode} onValueChange={(value) => handleViewMode(value)}>
          <TabsList className="border rounded-lg flex h-8">
            <TabsTrigger value="list" className="px-3">
              <AlignJustify className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="grid" className="px-3">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleFileModalOpen} size="sm" className="h-8 text-sm font-bold">
          <Plus className="h-4 w-4 mr-1" />
          {t('ADD_NEW')}
        </Button>
      </div>
      <FileManagerFilterSheet open={openSheet} onOpenChange={setOpenSheet} />
    </div>
  );
}
