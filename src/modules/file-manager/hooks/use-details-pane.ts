import { useCallback, useState } from 'react';

export interface UseDetailsPaneResult<T> {
  isDetailsOpen: boolean;
  selectedItem: T | null;
  handleOpenDetails: (item: T) => void;
  handleCloseDetails: () => void;
  shouldHideMainContent: boolean;
}

export const useDetailsPane = <T>(
  isMobile: boolean,
  onViewDetails?: (item: T) => void
): UseDetailsPaneResult<T> => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const handleOpenDetails = useCallback(
    (item: T) => {
      setSelectedItem(item);
      setIsDetailsOpen(true);
      onViewDetails?.(item);
    },
    [onViewDetails]
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedItem(null);
  }, []);

  const shouldHideMainContent = isMobile && isDetailsOpen;

  return {
    isDetailsOpen,
    selectedItem,
    handleOpenDetails,
    handleCloseDetails,
    shouldHideMainContent,
  };
};
