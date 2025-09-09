import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

/**
 * Custom hook to implement infinite scrolling logic.
 *
 * @param {number} totalItems - Total number of items available
 * @param {number} batchSize - Number of items to load per scroll
 * @param {number} threshold - Scroll threshold to trigger load (in px)
 *
 * @returns {{
 *   visibleCount: number,
 *   containerRef: React.RefObject<HTMLDivElement>
 * }}
 */
export function useInfiniteScroll(totalItems: number, batchSize = 5, threshold = 200) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollHeight - container.scrollTop <= container.clientHeight + threshold
    ) {
      setVisibleCount((prev) => Math.min(prev + batchSize, totalItems));
    }
  }, [batchSize, threshold, totalItems]);

  useEffect(() => {
    const container = containerRef.current;
    const debouncedScroll = debounce(handleScroll, 200);

    if (container) {
      container.addEventListener('scroll', debouncedScroll);
    }

    return () => {
      debouncedScroll.cancel();
      if (container) {
        container.removeEventListener('scroll', debouncedScroll);
      }
    };
  }, [handleScroll]);

  return { visibleCount, containerRef };
}
