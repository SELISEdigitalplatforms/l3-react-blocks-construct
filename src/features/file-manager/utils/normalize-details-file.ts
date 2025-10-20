import { WithLastModified } from '../types/file-manager.type';

export const normalizeDetailsFile = <T extends WithLastModified>(file: T | null) => {
  if (!file) return null;
  return {
    ...file,
    lastModified:
      typeof file.lastModified === 'string'
        ? file.lastModified
        : ((file.lastModified as Date | undefined)?.toISOString?.() ?? ''),
    isShared: file.isShared ?? false,
  } as T & { lastModified: string; isShared: boolean };
};
