/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useState } from 'react';
import { BaseGridView } from '../basic-grid-view';
import { RegularFileDetailsSheet } from '../regular-file-details-sheet';
import { IFileData } from '../../hooks/use-mock-files-query';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  matchesFileType,
  matchesModifiedDate,
  matchesName,
} from '../../utils/grid-view-filter-files';

interface MyFileGridViewProps {
  onViewDetails?: (file: IFileData) => void;
  onFilePreview?: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  filters: any;
  newFiles?: IFileData[];
  newFolders?: IFileData[];
  renamedFiles?: Map<string, IFileData>;
  fileSharedUsers?: Record<string, any[]>;
  filePermissions?: Record<string, any>;
  currentFolderId?: string;
  onNavigateToFolder?: (folderId: string) => void;
  onNavigateBack?: () => void;
}

const MyFileGridView: React.FC<MyFileGridViewProps> = (props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFileForDetails, setSelectedFileForDetails] = useState<IFileData | null>(null);

  const handleViewDetails = useCallback(
    (file: IFileData) => {
      setSelectedFileForDetails(file);
      setIsDetailsOpen(true);
      props.onViewDetails?.(file);
    },
    [props.onViewDetails]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFileForDetails(null);
  }, []);

  const queryBuilder = useCallback(
    (params: any) => ({
      page: params.page,
      pageSize: params.pageSize,
      filter: params.filters,
      folderId: props.currentFolderId,
    }),
    [props.currentFolderId]
  );

  const filterFiles = useCallback((files: IFileData[], filters: any): IFileData[] => {
    return files.filter((file) => {
      return (
        matchesFileType(file, filters.fileType) &&
        matchesName(file, filters.name) &&
        matchesModifiedDate(file, filters.modifiedDate)
      );
    });
  }, []);

  const shouldHideMainContent = isMobile && isDetailsOpen;

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          <BaseGridView
            onNavigateToFolder={props.onNavigateToFolder}
            onFilePreview={props.onFilePreview}
            onViewDetails={handleViewDetails}
            filters={props.filters}
            newFiles={props.newFiles}
            newFolders={props.newFolders}
            renamedFiles={props.renamedFiles}
            fileSharedUsers={props.fileSharedUsers}
            filePermissions={props.filePermissions}
            currentFolderId={props.currentFolderId}
            onShare={props.onShare}
            onDelete={props.onDelete}
            onMove={props.onMove}
            onCopy={props.onCopy}
            onRename={props.onRename}
            queryBuilder={queryBuilder}
            filterFiles={filterFiles}
          />
        </div>
      )}

      <RegularFileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={
          selectedFileForDetails
            ? {
                ...selectedFileForDetails,
                lastModified:
                  typeof selectedFileForDetails.lastModified === 'string'
                    ? selectedFileForDetails.lastModified
                    : (selectedFileForDetails.lastModified?.toISOString?.() ?? ''),
                isShared: selectedFileForDetails.isShared ?? false,
              }
            : null
        }
        t={t}
      />
    </div>
  );
};

export default MyFileGridView;
