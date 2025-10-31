import { useState, useCallback } from 'react';

export const useFileFilters = <T extends Record<string, any>>(initialFilters: T) => {
  const [filters, setFilters] = useState<T>(initialFilters);

  const handleFiltersChange = useCallback((newFilters: T) => {
    setFilters((prevFilters) => {
      if (JSON.stringify(prevFilters) === JSON.stringify(newFilters)) {
        return prevFilters;
      }
      return newFilters;
    });
  }, []);

  return {
    filters,
    handleFiltersChange,
  };
};
