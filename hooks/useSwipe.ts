import { create } from "zustand";

interface SwipeState {
  direction: "left" | "right" | "up" | "down" | null;
  setDirection: (dir: "left" | "right" | "up" | "down" | null) => void;
}

export const useSwipeStore = create<SwipeState>((set) => ({
  direction: null,
  setDirection: (direction) => set({ direction }),
}));

// Placeholder for actual swipe logic which would attach to window/document
// and update the store.
export function useSwipe() {
  const { direction, setDirection } = useSwipeStore();
  return { direction, setDirection };
}
