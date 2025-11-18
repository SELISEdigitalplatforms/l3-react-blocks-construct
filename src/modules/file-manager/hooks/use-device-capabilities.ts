import { useEffect, useState } from 'react';

/**
 * Custom hook to detect device capabilities including touch support and screen size.
 *
 * @returns {object} Object containing touchEnabled and screenSize properties
 *
 * @example
 * const { touchEnabled, screenSize } = useDeviceCapabilities();
 * console.log(touchEnabled); // true if device has touch support
 * console.log(screenSize); // 'mobile' | 'tablet' | 'desktop'
 */
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    touchEnabled: false,
    screenSize: 'desktop' as 'mobile' | 'tablet' | 'desktop',
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const hasTouchScreen =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      const width = window.innerWidth;
      let screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop';

      if (width <= 768) {
        screenSize = 'mobile';
      } else if (width <= 1024) {
        screenSize = 'tablet';
      }

      setCapabilities({
        touchEnabled: hasTouchScreen,
        screenSize,
      });
    };

    checkCapabilities();
    window.addEventListener('resize', checkCapabilities);
    return () => window.removeEventListener('resize', checkCapabilities);
  }, []);

  return capabilities;
}
