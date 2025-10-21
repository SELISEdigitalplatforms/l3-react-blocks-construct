import { WithLastModified } from '../types/file-manager.type';

export const normalizeDetailsFile = <T extends WithLastModified>(file: T | null) => {
  if (!file) return null;
  const lm = file.lastModified;
  return {
    ...file,
    lastModified: typeof lm === 'string' ? lm : lm instanceof Date ? lm.toISOString() : '',
    isShared: file.isShared ?? false,
  } as T & { lastModified: string; isShared: boolean };
};
