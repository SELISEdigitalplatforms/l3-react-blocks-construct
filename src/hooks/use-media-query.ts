import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};

export const useIsTablet = (): boolean => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
};

export const useIsDesktop = (): boolean => {
  return useMediaQuery('(min-width: 1025px)');
};
