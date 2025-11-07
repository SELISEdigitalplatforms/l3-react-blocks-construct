import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui-kit/button';
import { SkeletonGrid } from '../file-manager-grid-view-skeleton/file-manager-grid-view-skeleton';
import { GridViewCard } from '../grid-view-card/grid-view-card';

interface BaseFile {
  id: string;
  name: string;
  fileType: string;
}

interface BaseGridViewProps<T extends BaseFile> {
  onViewDetails?: (file: T) => void;
  onFilePreview?: (file: T) => void;
  onNavigateToFolder?: (folderId: string) => void;
  filters: Record<string, any>;
  data?: {
    data: T[];
    totalCount: number;
  };
  isLoading: boolean;
  error?: any;
  onLoadMore: () => void;
  renderDetailsSheet: (file: T | null, isOpen: boolean, onClose: () => void) => React.ReactNode;
  renderPreviewSheet?: (file: T | null, isOpen: boolean, onClose: () => void) => React.ReactNode;
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
  additionalFiles?: T[];
  filterFiles?: (files: T[], filters: Record<string, any>) => T[];
  processFiles?: (files: T[]) => T[];
  currentFolderId?: string;
}

export const CommonGridView = <T extends BaseFile>({
  onFilePreview,
  onNavigateToFolder,
  filters,
  data,
  isLoading,
  error,
  onLoadMore,
  renderDetailsSheet,
  renderPreviewSheet,
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
  currentFolderId,
}: Readonly<BaseGridViewProps<T>>) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<T | null>(null);

  const getEmptyStateMessage = () => {
    if (hasActiveFilters) {
      return 'No files match the current criteria';
    }

    if (currentFolderId) {
      return 'This folder is empty';
    }

    return emptyStateConfig.description;
  };

  const handleFilePreview = useCallback(
    (file: T) => {
      setSelectedFile(file);
      setIsPreviewOpen(true);
      onFilePreview?.(file);
    },
    [onFilePreview]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  }, []);

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
      <div
        className={`flex flex-col h-full ${isDetailsOpen || isPreviewOpen ? 'flex-1' : 'w-full'}`}
      >
        <div className="flex-1">
          <div className="space-y-8">
            <SkeletonGrid count={3} title="folders" type="folder" />
            <SkeletonGrid count={6} title="files" type="file" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div
        className={`flex flex-col h-full ${isDetailsOpen || isPreviewOpen ? 'flex-1' : 'w-full'}`}
      >
        <div className="flex-1">
          <div className="space-y-8">
            {folders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-high-emphasis mb-4 py-2 rounded">
                  {sectionLabels.folder} ({folders.length})
                </h2>
                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {folders.map((file) => {
                    const IconComponent = getFileTypeIcon(file.fileType);
                    const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

                    return (
                      <GridViewCard
                        key={`folder-${file.id}-${file.name}`}
                        file={file}
                        onNavigateToFolder={onNavigateToFolder}
                        onFilePreview={onFilePreview}
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
                <h2 className="text-sm font-medium text-high-emphasis mb-4 py-2 rounded">
                  {sectionLabels.file} ({regularFiles.length})
                </h2>
                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  {regularFiles.map((file) => {
                    const IconComponent = getFileTypeIcon(file.fileType);
                    const { iconColor, backgroundColor } = getFileTypeInfo(file.fileType);

                    return (
                      <GridViewCard
                        key={`file-${file.id}-${file.name}`}
                        file={file}
                        onNavigateToFolder={onNavigateToFolder}
                        onFilePreview={handleFilePreview}
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
                <h3 className="text-lg font-medium text-high-emphasis mb-2">
                  {emptyStateConfig.title}
                </h3>
                <p className="text-medium-emphasis max-w-sm">{getEmptyStateMessage()}</p>
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

      {renderPreviewSheet?.(selectedFile, isPreviewOpen, handleClosePreview)}
    </div>
  );
};
