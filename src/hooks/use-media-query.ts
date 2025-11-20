import { useState, useEffect } from 'react';

/**
 * Custom hook to detect media query matches using the matchMedia API.
 *
 * This hook uses the native matchMedia change listener for better performance
 * compared to window resize listeners.
 *
 * @param query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} `true` if the media query matches, otherwise `false`
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);

    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/**
 * Custom hook to detect if the current device is mobile based on the window width.
 *
 * @returns {boolean} `true` if the device is considered mobile (width <= 768px), otherwise `false`
 *
 * @example
 * const isMobile = useIsMobile();
 * console.log(isMobile); // true if the device width is <= 768px, false otherwise
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};

/**
 * Custom hook to detect if the current device is a tablet based on the window width.
 *
 * @returns {boolean} `true` if the device is considered tablet (width between 769px and 1024px), otherwise `false`
 *
 * @example
 * const isTablet = useIsTablet();
 */
export const useIsTablet = (): boolean => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
};

/**
 * Custom hook to detect if the current device is desktop based on the window width.
 *
 * @returns {boolean} `true` if the device is considered desktop (width >= 1025px), otherwise `false`
 *
 * @example
 * const isDesktop = useIsDesktop();
 */
export const useIsDesktop = (): boolean => {
  return useMediaQuery('(min-width: 1025px)');
};
