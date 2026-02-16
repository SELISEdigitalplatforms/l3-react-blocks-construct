import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';

/**
 * Pagination Component
 *
 * A reusable pagination component that displays page information and navigation controls.
 * Shows the current range of items being displayed and provides buttons to navigate between pages.
 *
 * Features:
 * - Displays current range of items (e.g., "1-10 of 50")
 * - Previous and next page navigation buttons
 * - Automatic disabling of buttons when at first or last page
 * - Handles page change events with callback functionality
 * - Maintains internal page state
 *
 * Props:
 * @param {number} totalItems - The total number of items in the dataset
 * @param {number} itemsPerPage - Number of items to display per page
 * @param {(page: number) => void} [onPageChange] - Optional callback when page changes
 *
 * @example
 * // Basic usage
 * <Pagination
 *   totalItems={100}
 *   itemsPerPage={10}
 *   onPageChange={(page) => fetchDataForPage(page)}
 * />
 *
 * // Without page change handler (component manages state internally)
 * <Pagination
 *   totalItems={50}
 *   itemsPerPage={5}
 * />
 */

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

export const CustomPaginationEmail = ({
  totalItems,
  itemsPerPage,
  onPageChange,
}: Readonly<PaginationProps>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(start + itemsPerPage - 1, totalItems);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onPageChange?.(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange?.(currentPage - 1);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex w-full items-center justify-between md:justify-end gap-6">
        <p className="text-sm text-medium-emphasis">{`${start}-${end} of ${totalItems}`}</p>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
