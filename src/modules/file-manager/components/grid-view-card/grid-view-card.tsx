import React from 'react';

interface BaseFile {
  id: string;
  name: string;
  fileType: string;
}

interface BaseCardProps<T extends BaseFile> {
  file: T;
  onFilePreview?: (file: T) => void;
  onNavigateToFolder?: (folderId: string) => void;
  renderActions: (file: T) => React.ReactNode;
  IconComponent: React.ComponentType<{ className?: string }>;
  iconColor: string;
  backgroundColor: string;
}

export const GridViewCard = <T extends BaseFile>({
  file,
  onFilePreview,
  onNavigateToFolder,
  renderActions,
  IconComponent,
  iconColor,
  backgroundColor,
}: Readonly<BaseCardProps<T>>) => {
  const isFolder = file.fileType === 'Folder';

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isActionButton = target.closest('[data-action-button="true"]');

    if (!isActionButton) {
      e.preventDefault();

      if (isFolder && onNavigateToFolder) {
        onNavigateToFolder(file.id);
      } else if (!isFolder && onFilePreview) {
        onFilePreview(file);
      }
    }
  };

  const containerClasses =
    'group relative bg-card rounded-lg border border-border hover:bg-card/50 transition-all duration-200 cursor-pointer';
  const contentClasses = isFolder
    ? 'p-3 flex items-center space-x-3'
    : 'p-6 flex flex-col items-center text-center space-y-4';

  const iconContainerClasses = `${isFolder ? 'w-8 h-8' : 'w-20 h-20'} flex items-center justify-center rounded-lg ${isFolder ? backgroundColor : ''}`;
  const iconClasses = `${isFolder ? 'w-5 h-5' : 'w-10 h-10'} ${iconColor} rounded-lg`;

  const renderFolderLayout = () => (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-high-emphasis truncate" title={file.name}>
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
          <h3 className="text-sm font-medium text-high-emphasis truncate" title={file.name}>
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
      aria-label={isFolder ? `Open folder ${file.name}` : `Preview ${file.name}`}
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
