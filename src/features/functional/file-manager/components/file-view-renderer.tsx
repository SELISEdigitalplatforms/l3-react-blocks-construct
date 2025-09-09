import React from 'react';

interface FileViewRendererProps {
  viewMode: 'grid' | 'list';
  GridComponent: React.ComponentType<any>;
  ListComponent: React.ComponentType<any>;
  commonViewProps: any;
}

export const FileViewRenderer: React.FC<FileViewRendererProps> = ({
  viewMode,
  GridComponent,
  ListComponent,
  commonViewProps,
}) => {
  return viewMode === 'grid' ? (
    <div className="h-full overflow-y-auto">
      <GridComponent {...commonViewProps} />
    </div>
  ) : (
    <div className="h-full">
      <ListComponent {...commonViewProps} />
    </div>
  );
};
