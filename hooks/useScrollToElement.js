import { useContext, useEffect } from 'react';

import { NavigationStateContext } from '../providers/navigationStateProvider';

import useScroll from './useScroll';

const useScrollToElement = (id, ref, debounceTime = 300) => {
  const navigationState = useContext(NavigationStateContext);

  // Restore scroll position on mount
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    // Prefer in-memory context state (set during same session/SPA navigation).
    // Fall back to localStorage so position is restored after a full page refresh.
    let savedState = navigationState[id];

    if (!savedState) {
      try {
        const raw = localStorage.getItem(`navigationState:${id}`);
        if (raw) {
          savedState = JSON.parse(raw);
          // Hydrate context so it's available for the rest of the session
          navigationState[id] = savedState;
        }
      } catch {
        localStorage.removeItem(`navigationState:${id}`);
      }
    }

    // Scroll only if the saved position differs from current
    if (savedState && savedState.y !== element.scrollTop) {
      element.scroll({ top: savedState.y, behavior: 'auto' });
    }
  }, [id]);

  // Save scroll position on scroll
  const handleScroll = position => {
    try {
      localStorage.setItem(`navigationState:${id}`, JSON.stringify(position));
    } catch {
      // localStorage may be unavailable (e.g. Safari private browsing)
      // or the quota may be exceeded — fall through so in-memory state
      // is still updated below.
    }
    // Always update in-memory state regardless of localStorage availability
    navigationState[id] = position;
  };

  // Use the useScroll hook to handle scroll events with debouncing
  useScroll(ref, { debounceTime, onScroll: handleScroll });
};

export default useScrollToElement;
