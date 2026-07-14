"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ScrollLockValue {
  locked: boolean;
  setLocked: (locked: boolean) => void;
}

const ScrollLockContext = createContext<ScrollLockValue>({
  locked: true,
  setLocked: () => {},
});

/**
 * Shares a page-wide scroll-lock flag. The experience starts with the
 * invitation closed, so scrolling begins locked; the smooth-scroll provider
 * only starts Lenis once this is released (otherwise Lenis scrolls the page
 * behind the closed invitation, even with `overflow: hidden`).
 */
export function ScrollLockProvider({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(true);
  return (
    <ScrollLockContext.Provider value={{ locked, setLocked }}>
      {children}
    </ScrollLockContext.Provider>
  );
}

export function useScrollLock() {
  return useContext(ScrollLockContext);
}
