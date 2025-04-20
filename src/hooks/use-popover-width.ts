import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Custom hook to track the width of a button element and update it on window resize.
 *
 * This hook returns a reference to a button element (`buttonRef`) and its width (`popoverWidth`).
 * It listens for changes in the window size and updates the width of the button whenever a resize event occurs.
 *
 * @returns {[RefObject<HTMLButtonElement>, number | undefined]} A tuple containing:
 * - `buttonRef`: A reference to the button element.
 * - `popoverWidth`: The width of the button element (undefined if the width can't be determined).
 *
 * @example
 * const [buttonRef, popoverWidth] = usePopoverWidth();
 * console.log(popoverWidth); // The current width of the button element.
 */

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
