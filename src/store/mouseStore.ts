import { create } from 'zustand';

interface MouseStore {
  isPressed: boolean;
  toggleIsPressed: () => void;
  position: { x: number; y: number };
  setPosition: (x: number, y: number) => void;
  isDraggingStart: boolean;
  setIsDraggingStart: (isDraggingStart: boolean) => void;
  isDraggingFinish: boolean;
  setIsDraggingFinish: (isDraggingFinish: boolean) => void;
}

export const useMouseStore = create<MouseStore>((set) => ({
  isPressed: false,
  toggleIsPressed: () => set((state) => ({ isPressed: !state.isPressed })),
  position: { x: 0, y: 0 },
  setPosition: (x, y) => set({ position: { x, y } }),
  isDraggingStart: false,
  setIsDraggingStart: (isDraggingStart) => set({ isDraggingStart }),

  isDraggingFinish: false,
  setIsDraggingFinish: (isDraggingFinish) => set({ isDraggingFinish }),
}));
