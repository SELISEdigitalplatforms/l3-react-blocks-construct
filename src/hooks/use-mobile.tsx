import * as React from 'react';

/**
 * Custom hook to detect if the current device is mobile based on the window width.
 *
 * This hook listens for window resizing and determines if the current window width is less than the defined
 * mobile breakpoint (768px). It returns a boolean value indicating whether the device is mobile.
 *
 * @returns {boolean} `true` if the device is considered mobile (width less than 768px), otherwise `false`.
 *
 * @example
 * const isMobile = useIsMobile();
 * console.log(isMobile); // true if the device width is less than 768px, false otherwise.
 */

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
