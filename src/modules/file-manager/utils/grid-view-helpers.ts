import { IFileData } from '@/modules/file-manager/types/file-manager.type';
import {
  matchesFileType,
  matchesModifiedDate,
  matchesName,
} from '@/modules/file-manager/utils/grid-view-filter-files';

export const createGridQueryBuilder = (currentFolderId?: string) => (params: any) => ({
  page: params.page,
  pageSize: params.pageSize,
  filter: params.filters,
  folderId: currentFolderId,
});

export const createGridFilter =
  () =>
  (files: IFileData[], filters: any): IFileData[] =>
    files.filter(
      (file) =>
        matchesFileType(file, filters.fileType) &&
        matchesName(file, filters.name) &&
        matchesModifiedDate(file, filters.modifiedDate)
    );
