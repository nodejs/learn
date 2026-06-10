'use client';

import { createContext, useRef } from 'react';

export const NavigationStateContext = createContext({});

export const NavigationStateProvider = ({children}) => {
  const navigationStateRef = useRef({});

  return (
    <NavigationStateContext.Provider value={navigationStateRef.current}>
      {children}
    </NavigationStateContext.Provider>
  );
};
