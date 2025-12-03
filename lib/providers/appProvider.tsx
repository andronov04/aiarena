"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { AppState, createAppStore } from "@/lib/stores/appStore";

export type AppStoreApi = ReturnType<typeof createAppStore>;

const AppContext = createContext<AppStoreApi | undefined>(undefined);

export function AppProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<AppState>;
}) {
  const storeRef = useRef<AppStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createAppStore(initialState);
  }
  return (
    // eslint-disable-next-line react-hooks/refs
    <AppContext.Provider value={storeRef.current}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore<T>(
  selector: (s: AppState) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return useStoreWithEqualityFn(ctx, selector, equalityFn);
}
