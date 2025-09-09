import { IFileDataWithSharing } from './file-manager';

export const isDateInRange = (date: Date | null, fromDate?: string, toDate?: string): boolean => {
  if (!date) return false;

  if (fromDate && date < new Date(fromDate)) return false;
  if (toDate && date > new Date(toDate)) return false;

  return true;
};

export const matchesFileType = (file: IFileDataWithSharing, fileTypes?: string[]): boolean => {
  if (!fileTypes?.length) return true;
  return fileTypes.includes(file.fileType);
};

export const matchesName = (file: IFileDataWithSharing, searchName?: string): boolean => {
  const trimmedName = searchName?.trim();
  if (!trimmedName) return true;

  return file.name.toLowerCase().includes(trimmedName.toLowerCase());
};

export const matchesSharedBy = (file: IFileDataWithSharing, sharedByFilter?: string): boolean => {
  const trimmedFilter = sharedByFilter?.trim();
  if (!trimmedFilter) return true;

  const sharedBy = file.sharedBy?.name?.toLowerCase() ?? file.sharedBy?.id?.toLowerCase() ?? '';
  return sharedBy.includes(trimmedFilter.toLowerCase());
};

export const matchesSharedDate = (
  file: IFileDataWithSharing,
  dateRange?: { from?: string; to?: string }
): boolean => {
  if (!dateRange?.from && !dateRange?.to) return true;

  const sharedDate = file.sharedDate ? new Date(file.sharedDate) : null;
  return isDateInRange(sharedDate, dateRange.from, dateRange.to);
};

export const matchesModifiedDate = (
  file: IFileDataWithSharing,
  dateRange?: { from?: string; to?: string }
): boolean => {
  if (!dateRange?.from && !dateRange?.to) return true;

  const modifiedDate = new Date(file.lastModified);
  return isDateInRange(modifiedDate, dateRange.from, dateRange.to);
};
