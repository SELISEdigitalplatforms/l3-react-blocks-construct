import { useState, useCallback } from 'react';

type ViewMode = 'grid' | 'list';

interface UseViewModeOptions {
  storageKey: string;
  defaultMode?: ViewMode;
}

interface UseViewModeReturn {
  viewMode: ViewMode;
  handleViewModeChange: (mode: string) => void;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * Custom hook for managing view mode with sessionStorage persistence
 * @param storageKey - The key to use for sessionStorage
 * @param defaultMode - The default view mode if none is stored (defaults to 'list')
 */
export const useViewMode = ({
  storageKey,
  defaultMode = 'list',
}: UseViewModeOptions): UseViewModeReturn => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return (saved as ViewMode) || defaultMode;
    } catch {
      return defaultMode;
    }
  });

  const handleViewModeChange = useCallback(
    (mode: string) => {
      const newViewMode = mode as ViewMode;
      setViewMode(newViewMode);

      try {
        sessionStorage.setItem(storageKey, newViewMode);
      } catch (error) {
        console.warn(`Failed to save view mode to sessionStorage (${storageKey}):`, error);
      }
    },
    [storageKey]
  );

  return {
    viewMode,
    handleViewModeChange,
    setViewMode,
  };
};
