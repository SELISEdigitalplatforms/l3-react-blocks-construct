import { useCallback, useState } from 'react';

export interface UseDetailsPaneResult<T> {
  isDetailsOpen: boolean;
  selectedItem: T | null;
  handleOpenDetails: (item: T) => void;
  handleCloseDetails: () => void;
  shouldHideMainContent: boolean;
}

export const useDetailsPane = <T>(onViewDetails?: (item: T) => void): UseDetailsPaneResult<T> => {
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

  return {
    isDetailsOpen,
    selectedItem,
    handleOpenDetails,
    handleCloseDetails,
    shouldHideMainContent: isDetailsOpen,
  };
};
