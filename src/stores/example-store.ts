/**
 * Example Zustand Store
 *
 * Simple example demonstrating Zustand with localStorage persistence.
 *
 * @example
 * ```tsx
 * import { useExampleStore } from "@/stores/example-store";
 *
 * const { count, increment } = useExampleStore();
 * ```
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExampleState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    { name: "example-store" }
  )
);
