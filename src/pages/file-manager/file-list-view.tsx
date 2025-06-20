import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/blocks/data-table/data-table';
import { useTranslation } from 'react-i18next';
import { IFileData, useMockFilesQuery } from 'features/file-manager/hooks/use-mock-files-query';
import { createFileTableColumns } from 'features/file-manager/components/file-table-columns';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

interface FileListViewProps {
  onViewDetails: (file: IFileData) => void;
  onDownload: (file: IFileData) => void;
  onShare: (file: IFileData) => void;
  onDelete: (file: IFileData) => void;
  onMove: (file: IFileData) => void;
  onCopy: (file: IFileData) => void;
  onOpen: (file: IFileData) => void;
  onRename: (file: IFileData) => void;
  filters: {
    name: string;
    fileType?: 'Folder' | 'File' | 'Image' | 'Audio' | 'Video';
  };
}

const FileListView: React.FC<FileListViewProps> = ({
  onViewDetails,
  onShare,
  onDelete,
  onMove,
  onCopy,
  onOpen,
  onRename,
  filters,
}) => {
  const [openSheet, setOpenSheet] = useState(false);
  const [, setSelectedFile] = useState<IFileData | null>(null);
  const { t } = useTranslation();

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
        totalCount: data.totalCount,
      }));
    }
  }, [data?.totalCount]);

  useEffect(() => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters]);

  const handleViewDetailsWrapper = (file: IFileData) => {
    setSelectedFile(file);
    setOpenSheet(true);
    onViewDetails(file);
  };

  const handleDownloadWrapper = () => undefined;

  const handleShareWrapper = (file: IFileData) => {
    setSelectedFile(file);
    onShare(file);
  };

  const handleDeleteWrapper = (file: IFileData) => {
    setSelectedFile(file);
    onDelete(file);
  };

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

  const columns = createFileTableColumns({
    onViewDetails: handleViewDetailsWrapper,
    onDownload: handleDownloadWrapper,
    onShare: handleShareWrapper,
    onDelete: handleDeleteWrapper,
    onMove: onMove,
    onCopy: onCopy,
    onOpen: onOpen,
    onRename: onRename,
    t,
  });

  if (error) {
    return <div className="p-4 text-error">{t('ERROR_LOADING_FILES')}</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-full flex-col flex w-full gap-6 md:gap-8">
        <DataTable
          data={data?.data || []}
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
  );
};

export default FileListView;
