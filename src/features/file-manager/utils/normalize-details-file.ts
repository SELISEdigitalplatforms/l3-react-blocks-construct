import { WithLastModified } from '../types/file-manager.type';

export const normalizeDetailsFile = <T extends WithLastModified>(file: T | null) => {
  if (!file) return null;
  const lm = file.lastModified;
  let lastModifiedStr = '';
  if (typeof lm === 'string') {
    lastModifiedStr = lm;
  } else if (lm instanceof Date) {
    lastModifiedStr = lm.toISOString();
  }
  return {
    ...file,
    lastModified: lastModifiedStr,
    isShared: file.isShared ?? false,
  } as T & { lastModified: string; isShared: boolean };
};
