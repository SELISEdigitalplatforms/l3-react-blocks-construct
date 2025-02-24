import { useState, useEffect, useRef, RefObject } from 'react';

function usePopoverWidth(): [RefObject<HTMLButtonElement>, number | undefined] {
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (buttonRef.current) {
        setPopoverWidth(buttonRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return [buttonRef, popoverWidth];
}

export default usePopoverWidth;
