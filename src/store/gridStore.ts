import { create } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { Cell, Grid, ValidAlgo, ValidMazeAlgo } from '../lib/types';
import { initializeGrid } from '../lib/gridUtils';
import { isMobile } from 'react-device-detect';

interface StoreState {
  grid: Grid;
  rows: number;
  cols: number;
  isRunning: boolean;
  startNode: Cell | null;
  finishNode: Cell | null;
  algo: ValidAlgo;
  selectedMaze: '' | ValidMazeAlgo;
  updateGrid: (grid: Grid) => void;
  setRunning: (isRunning: boolean) => void;
  toggleIsRunning: () => void;
  setStartNode: (node: Cell | null) => void;
  setFinishNode: (node: Cell | null) => void;
  setAlgo: (algo: ValidAlgo) => void;
  setSelectedMaze: (maze: '' | ValidMazeAlgo) => void;
  clearGrid: () => void;
  clearWalls: () => void;
}

export const gridStore = createStore<StoreState>((set, get) => ({
  grid: initializeGrid(isMobile ? 40 : 60, 40),
  rows: isMobile ? 40 : 60,
  cols: 40,
  algo: 'BFS',
  selectedMaze: '',

  isRunning: false,
  startNode: null,
  finishNode: null,

  updateGrid: (grid) => set({ grid }),
  setRunning: (isRunning) => set({ isRunning }),
  toggleIsRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  setStartNode: (node) => set({ startNode: node }),
  setFinishNode: (node) => set({ finishNode: node }),
  setAlgo: (algo) => set({ algo }),
  setSelectedMaze: (maze) => set({ selectedMaze: maze }),
  clearGrid: () => {
    if (get().isRunning) return;
    const newGrid = get().grid;
    for (const row of newGrid) {
      for (const node of row) {
        const nodeClassName = document.getElementById(`cell-${node.row}-${node.col}`);
        nodeClassName?.classList.remove('animate-visited');
        nodeClassName?.classList.remove('animate-shortest');

        if (!node.isStart && !node.isFinish && !node.isWall) {
          node.isVisited = false;
          node.distance = Infinity;
          node.previousNode = null;
        }

        if (node.isStart) {
          node.isVisited = false;
          node.distance = 0;
          node.isStart = true;
          node.isWall = false;
          node.previousNode = null;
        }

        if (node.isFinish) {
          node.isVisited = false;
          node.distance = Infinity;
          node.isFinish = true;
          node.isWall = false;
          node.previousNode = null;
        }
      }
    }
    set({ grid: newGrid });
  },
  clearWalls: () => {
    if (get().isRunning) return;
    const newGrid = get().grid;
    for (const row of newGrid) {
      for (const node of row) {
        if (node.isWall) {
          node.isWall = false;
          document
            .getElementById(`cell-${node.row}-${node.col}`)
            ?.classList.remove('animate-isWall');
        }
      }
    }
    set({ grid: newGrid });
  },
}));

export const useStore = create(gridStore);
