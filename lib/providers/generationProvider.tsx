"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStoreWithEqualityFn } from "zustand/traditional";

import {
  createGenerationStore,
  type GenerationStoreState,
} from "@/lib/stores/generationStore";

export type GenerationStoreApi = ReturnType<typeof createGenerationStore>;

const GenerationContext = createContext<GenerationStoreApi | null>(null);

export function GenerationProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<GenerationStoreState>;
}) {
  const storeRef = useRef<GenerationStoreApi>(null);

  if (storeRef.current === null) {
    storeRef.current = createGenerationStore(initialState);
  }

  return (
    // eslint-disable-next-line react-hooks/refs
    <GenerationContext.Provider value={storeRef.current}>
      {children}
    </GenerationContext.Provider>
  );
}

export function useGenerationStore<T>(
  selector: (s: GenerationStoreState) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T {
  const store = useContext(GenerationContext);

  if (!store) {
    throw new Error(
      "useGenerationStore must be used inside <GenerationProvider>",
    );
  }

  return useStoreWithEqualityFn(store, selector, equalityFn);
}

export const useGenerationStoreApi = () => {
  const store = useContext(GenerationContext);
  if (!store)
    throw new Error("useGenerationStoreApi must be used inside Provider");
  return store;
};
