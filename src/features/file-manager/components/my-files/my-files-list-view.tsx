import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IFileData, useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import { createFileTableColumns } from './my-files-table-columns';
import { useIsMobile } from 'hooks/use-mobile';
import DataTable from 'components/blocks/data-table/data-table';
import FileDetailsSheet from './my-files-details';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

interface MyFilesListViewProps {
  onViewDetails: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onOpen: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  filters: {
    name?: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
  newFiles: IFileData[];
  newFolders: IFileData[];
}

const MyFilesListView: React.FC<MyFilesListViewProps> = ({
  onViewDetails,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onRename,
  filters,
  newFiles,
  newFolders,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileData | null>(null);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const queryParams = {
    page: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    filter: filters,
  };

  const { data, isLoading, error } = useMockFilesQuery(queryParams);

  const localFiles = useMemo(() => {
    return [...newFiles, ...newFolders];
  }, [newFiles, newFolders]);

  const combinedData = useMemo(() => {
    const serverFiles = data?.data || [];
    const filteredLocalFiles = localFiles.filter((file) => {
      if (filters.name && !file.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.fileType && file.fileType !== filters.fileType) {
        return false;
      }
      return true;
    });

    return [...filteredLocalFiles, ...serverFiles];
  }, [localFiles, data?.data, filters]);

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    []
  );

  useEffect(() => {
    if (data?.totalCount !== undefined) {
      setPaginationState((prev) => ({
        ...prev,
        totalCount: data.totalCount + localFiles.length,
      }));
    }
  }, [data?.totalCount, localFiles.length]);

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters]);

  const handleViewDetailsWrapper = useCallback(
    (file: IFileData) => {
      setSelectedFile(file);
      setIsDetailsOpen(true);
      onViewDetails(file);
    },
    [onViewDetails]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedFile(null);
  }, []);

  const handleDownloadWrapper = () => undefined;

  const handleShareWrapper = useCallback(
    (file: IFileData) => {
      setSelectedFile(file);
      onShare(file);
    },
    [onShare]
  );

  const handleDeleteWrapper = useCallback(
    (file: IFileData) => {
      setSelectedFile(file);
      onDelete(file);
    },
    [onDelete]
  );

  const columns = createFileTableColumns({
    onViewDetails: handleViewDetailsWrapper,
    onDownload: handleDownloadWrapper,
    onShare: handleShareWrapper,
    onDelete: handleDeleteWrapper,
    onMove: onMove,
    onCopy: onCopy,
    onOpen: handleViewDetailsWrapper,
    onRename: onRename,
    t,
  });

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  const shouldHideMainContent = isMobile && isDetailsOpen;

  return (
    <div className="flex h-full w-full rounded-xl relative">
      {!shouldHideMainContent && (
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            isDetailsOpen && !isMobile ? 'flex-1' : 'w-full'
          }`}
        >
          <div className="h-full flex-col flex w-full gap-6 md:gap-8">
            <DataTable
              data={combinedData}
              columns={columns}
              onRowClick={handleViewDetailsWrapper}
              isLoading={isLoading}
              pagination={{
                pageIndex: paginationState.pageIndex,
                pageSize: paginationState.pageSize,
                totalCount: paginationState.totalCount,
              }}
              onPaginationChange={handlePaginationChange}
              manualPagination={true}
              mobileColumns={['name']}
              expandable={true}
            />
          </div>
        </div>
      )}

      <FileDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        file={selectedFile}
        t={t}
      />
    </div>
  );
};

export default MyFilesListView;
