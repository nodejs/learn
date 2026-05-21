import { useEffect, useRef } from 'react';

// Custom hook to handle scroll events with optional debouncing
const useScroll = (ref, { debounceTime = 300, onScroll }) => {
  const timeoutRef = useRef(undefined);
  const onScrollRef = useRef(onScroll);

  // Keep onScrollRef updated with the latest callback
  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);
  useEffect(() => {
    // Get the current element
    const element = ref.current;

    // Return early if no element or onScroll callback is provided
    if (!element || !onScrollRef.current) {
      return;
    }

    // Debounced scroll handler
    const handleScroll = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to call onScroll after debounceTime
      timeoutRef.current = setTimeout(() => {
        if (element && onScrollRef.current) {
          onScrollRef.current({
            x: element.scrollLeft,
            y: element.scrollTop,
          });
        }
      }, debounceTime);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
      // Clear any pending debounced calls
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [ref.current, debounceTime]);
};

export default useScroll;
