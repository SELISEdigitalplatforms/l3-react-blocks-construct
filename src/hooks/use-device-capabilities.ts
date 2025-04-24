import { useEffect, useState } from 'react';

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

      if (width < 768) {
        screenSize = 'mobile';
      } else if (width < 1024) {
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
