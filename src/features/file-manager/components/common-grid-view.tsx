import React, { useState, useCallback, useMemo } from 'react';
import { Button } from 'components/ui/button';

interface BaseFile {
  id: string | number;
  name: string;
  fileType: string;
}

interface BaseCardProps<T extends BaseFile> {
  file: T;
  onViewDetails?: (file: T) => void;
  renderActions: (file: T) => React.ReactNode;
  IconComponent: React.ComponentType<{ className?: string }>;
  iconColor: string;
  backgroundColor: string;
}

interface BaseGridViewProps<T extends BaseFile> {
  onViewDetails?: (file: T) => void;
  filters: Record<string, any>;
  data?: {
    data: T[];
    totalCount: number;
  };
  isLoading: boolean;
  error?: any;
  onLoadMore: () => void;
  renderDetailsSheet: (file: T | null, isOpen: boolean, onClose: () => void) => React.ReactNode;
  getFileTypeIcon: (fileType: string) => React.ComponentType<{ className?: string }>;
  getFileTypeInfo: (fileType: string) => { iconColor: string; backgroundColor: string };
  renderActions: (file: T) => React.ReactNode;
  emptyStateConfig: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  };
  sectionLabels: {
    folder: string;
    file: string;
  };
  errorMessage: string;
  loadingMessage: string;
  loadMoreLabel: string;
  // Additional props for customization
  additionalFiles?: T[];
  filterFiles?: (files: T[], filters: Record<string, any>) => T[];
  processFiles?: (files: T[]) => T[];
}

// Common Card Component
const CommonCard = <T extends BaseFile>({
  file,
  onViewDetails,
  renderActions,
  IconComponent,
  iconColor,
  backgroundColor,
}: BaseCardProps<T>) => {
  const isFolder = file.fileType === 'Folder';

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isActionButton = target.closest('[data-action-button="true"]');

    if (!isActionButton) {
      e.preventDefault();
      onViewDetails?.(file);
    }
  };

  const containerClasses =
    'group relative bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer';
  const contentClasses = isFolder
    ? 'p-3 flex items-center space-x-3'
    : 'p-6 flex flex-col items-center text-center space-y-4';

  const iconContainerClasses = `${isFolder ? 'w-8 h-8' : 'w-20 h-20'} flex items-center justify-center ${isFolder ? backgroundColor : ''}`;
  const iconClasses = `${isFolder ? 'w-5 h-5' : 'w-10 h-10'} ${iconColor}`;

  const renderFolderLayout = () => (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
          {file.name}
        </h3>
      </div>
      <section data-action-button="true" className="flex-shrink-0" aria-label="File actions">
        {renderActions(file)}
      </section>
    </div>
  );

  const renderFileLayout = () => (
    <div className="flex items-center justify-between space-x-2 mt-2">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${backgroundColor}`}>
          <IconComponent className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
            {file.name}
          </h3>
        </div>
      </div>
      <section data-action-button="true" className="flex-shrink-0" aria-label="File actions">
        {renderActions(file)}
      </section>
    </div>
  );

  return (
    <button
      className={containerClasses}
      onClick={handleCardClick}
      aria-label={`View details for ${file.name}`}
      type="button"
    >
      <div className={contentClasses}>
        <div className={iconContainerClasses}>
          <IconComponent className={iconClasses} />
        </div>
        <div className={isFolder ? 'flex-1' : 'w-full'}>
          {isFolder ? renderFolderLayout() : renderFileLayout()}
        </div>
      </div>
    </button>
  );
};

export const CommonGridView = <T extends BaseFile>({
  onViewDetails,
  filters,
  data,
  isLoading,
  error,
  onLoadMore,
  renderDetailsSheet,
  getFileTypeIcon,
  getFileTypeInfo,
  renderActions,
  emptyStateConfig,
  sectionLabels,
  errorMessage,
  loadingMessage,
  loadMoreLabel,
  additionalFiles = [],
  filterFiles,
  processFiles,
}: BaseGridViewProps<T>) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<T | null>(null);

  const handleViewDetails = useCallback(
    (file: T) => {
      setSelectedFile(file);
      setIsDetailsOpen(true);
      onViewDetails?.(file);
    },
    [onViewDetails]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  // Process files
  const processedFiles = useMemo(() => {
    let files = [...additionalFiles, ...(data?.data || [])];

    if (processFiles) {
      files = processFiles(files);
    }

    if (filterFiles) {
      files = filterFiles(files, filters);
    }

    return files;
  }, [additionalFiles, data?.data, processFiles, filterFiles, filters]);

  const folders = processedFiles.filter((file) => file.fileType === 'Folder');
  const regularFiles = processedFiles.filter((file) => file.fileType !== 'Folder');

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true)
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (isLoading && !processedFiles.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className={`flex flex-col h-full ${isDetailsOpen ? 'flex-1' : 'w-full'}`}>
        <div className="flex-1">
          <div className="space-y-8">
            {folders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded">
                  {sectionLabels.folder} ({folders.length})
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {folders.map((file) => {
                    const IconComponent = getFileTypeIcon(file.fileType);
                    const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

                    return (
                      <CommonCard
                        key={`folder-${file.id}-${file.name}`}
                        file={file}
                        onViewDetails={handleViewDetails}
                        renderActions={renderActions}
                        IconComponent={IconComponent}
                        iconColor={iconColor}
                        backgroundColor={backgroundColor}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {regularFiles.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-600 mb-4 py-2 rounded">
                  {sectionLabels.file} ({regularFiles.length})
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {regularFiles.map((file) => {
                    const IconComponent = getFileTypeIcon(file.fileType);
                    const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

                    return (
                      <CommonCard
                        key={`file-${file.id}-${file.name}`}
                        file={file}
                        onViewDetails={handleViewDetails}
                        renderActions={renderActions}
                        IconComponent={IconComponent}
                        iconColor={iconColor}
                        backgroundColor={backgroundColor}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {processedFiles.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <emptyStateConfig.icon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyStateConfig.title}</h3>
                <p className="text-gray-500 max-w-sm">
                  {hasActiveFilters
                    ? 'No files match the current criteria'
                    : emptyStateConfig.description}
                </p>
              </div>
            )}

            {data && data.data.length < data.totalCount && (
              <div className="flex justify-center pt-6">
                <Button
                  onClick={onLoadMore}
                  variant="outline"
                  disabled={isLoading}
                  className="min-w-32"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      {loadingMessage}
                    </div>
                  ) : (
                    loadMoreLabel
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderDetailsSheet(selectedFile, isDetailsOpen, handleCloseDetails)}
    </div>
  );
};
