import { Cell } from './types';
import { gridStore } from '../store/gridStore';

type Direction = { dx: number; dy: number };

const DIRECTIONS: Direction[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

function isInside(x: number, y: number, rows: number, cols: number): boolean {
  return x >= 0 && x < rows && y >= 0 && y < cols;
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getNeighbors(cell: Cell, maze: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const { row, col } = cell;

  for (const { dx, dy } of DIRECTIONS) {
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length) {
      neighbors.push(maze[newRow][newCol]);
    }
  }

  return neighbors;
}

export function generateDFSMaze(rows: number, cols: number): [Cell[][], Cell[]] {
  const { getState } = gridStore;
  const maze: Cell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isStart: false,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: true,
      previousNode: null,
      heuristic: 0,
    }))
  );

  function carvePassagesFrom(x: number, y: number): void {
    maze[x][y].isWall = false;
    const directions = shuffleArray(DIRECTIONS.slice());

    for (const { dx, dy } of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (isInside(nx, ny, rows, cols) && maze[nx][ny].isWall) {
        maze[x + dx][y + dy].isWall = false;
        carvePassagesFrom(nx, ny);
      }
    }
  }

  carvePassagesFrom(0, 0);

  maze[0][0].isStart = true;
  maze[rows - 2][cols - 2].isFinish = true;
  getState().setStartNode(maze[0][0]);
  getState().setFinishNode(maze[rows - 2][cols - 2]);

  const wallsInOrder: Cell[] = [];
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  function dfsCollectWalls(x: number, y: number): void {
    if (!isInside(x, y, rows, cols) || visited[x][y]) return;

    visited[x][y] = true;

    if (maze[x][y].isWall) {
      wallsInOrder.push(maze[x][y]);
    }

    for (const { dx, dy } of DIRECTIONS) {
      dfsCollectWalls(x + dx, y + dy);
    }
  }

  dfsCollectWalls(0, 0);

  return [maze, wallsInOrder];
}

export function generateMazePrims(rows: number, cols: number): [Cell[][], Cell[]] {
  const { getState } = gridStore;
  const maze: Cell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isStart: false,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: true,
      previousNode: null,
      heuristic: 0,
    }))
  );
  const walls: Cell[] = [];
  const start = maze[0][0];
  start.isWall = false;
  walls.push(...getNeighbors(start, maze));
  const wallsInOrder: Cell[] = [];

  while (walls.length) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const wall = walls[randomIndex];
    walls.splice(randomIndex, 1);

    const neighbors = getNeighbors(wall, maze).filter((n) => !n.isWall);
    if (neighbors.length === 1) {
      wall.isWall = false;
      const nextWalls = getNeighbors(wall, maze);
      walls.push(...nextWalls);
    }
  }

  maze[0][0].isStart = true;
  maze[0][0].isWall = false;
  maze[rows - 1][cols - 1].isFinish = true;
  maze[rows - 1][cols - 1].isWall = false;
  getState().setStartNode(maze[0][0]);
  getState().setFinishNode(maze[rows - 1][cols - 1]);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c].isWall) {
        wallsInOrder.push(maze[r][c]);
      }
    }
  }

  return [maze, wallsInOrder];
}

export function generateMazeKruskals(rows: number, cols: number): [Cell[][], Cell[]] {
  const { getState } = gridStore;
  const maze: Cell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isStart: false,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: true,
      previousNode: null,
      heuristic: 0,
    }))
  );
  const sets: Set<Cell>[] = [];
  const edges: [Cell, Cell][] = [];

  for (const row of maze) {
    for (const cell of row) {
      const set = new Set<Cell>();
      set.add(cell);
      sets.push(set);
      for (const dir of DIRECTIONS) {
        const newRow = cell.row + dir.dx;
        const newCol = cell.col + dir.dy;
        if (isInside(newRow, newCol, rows, cols)) {
          edges.push([cell, maze[newRow][newCol]]);
        }
      }
    }
  }

  shuffleArray(edges);

  for (const [cellA, cellB] of edges) {
    const setA = sets.find((set) => set.has(cellA));
    const setB = sets.find((set) => set.has(cellB));
    if (setA !== setB) {
      unionSets(setA!, setB!, sets);
      const wall = getWallBetween(cellA, cellB, maze);
      wall.isWall = false;
    }
  }

  maze[0][0].isStart = true;
  maze[0][0].isWall = false;
  maze[rows - 1][cols - 1].isFinish = true;
  maze[rows - 1][cols - 1].isWall = false;

  getState().setStartNode(maze[0][0]);
  getState().setFinishNode(maze[rows - 1][cols - 1]);

  const wallsInOrder: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c].isWall) {
        wallsInOrder.push(maze[r][c]);
      }
    }
  }

  return [maze, wallsInOrder];
}

export function generateRecursiveDivisionMaze(rows: number, cols: number): [Cell[][], Cell[]] {
  const { getState } = gridStore;
  const wallsInOrder: Cell[] = [];
  const maze: Cell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const isWall = row === 0 || col === 0 || row === rows - 1 || col === cols - 1;
      const cell = {
        row,
        col,
        isStart: false,
        isFinish: false,
        distance: Infinity,
        isVisited: false,
        isWall,
        previousNode: null,
        heuristic: 0,
      };
      if (isWall) {
        wallsInOrder.push(cell);
      }
      return cell;
    })
  );

  function recursiveDivision(x1: number, y1: number, x2: number, y2: number) {
    if (x2 - x1 < 3 || y2 - y1 < 3) return;

    let horizontal: boolean;

    const aspectRatio = (x2 - x1) / (y2 - y1);

    if (aspectRatio > 1) {
      horizontal = Math.random() < 0.5;
    } else {
      horizontal = Math.random() < 0.5;
    }

    if (horizontal) {
      const y = y1 + 2 * Math.floor((Math.random() * (y2 - y1 - 1)) / 2) + 1;
      const passage = x1 + 2 * Math.floor((Math.random() * (x2 - x1)) / 2);

      for (let x = x1; x < x2; x++) {
        if (x === passage || (y === 1 && x === 1) || (y === rows - 2 && x === cols - 2)) continue;
        maze[y][x].isWall = true;
        wallsInOrder.push(maze[y][x]);
      }

      recursiveDivision(x1, y1, x2, y);
      recursiveDivision(x1, y + 1, x2, y2);
    } else {
      const x = x1 + 2 * Math.floor((Math.random() * (x2 - x1 - 1)) / 2) + 1;
      const passage = y1 + 2 * Math.floor((Math.random() * (y2 - y1)) / 2);

      for (let y = y1; y < y2; y++) {
        if (y === passage || (y === 1 && x === 1) || (y === rows - 2 && x === cols - 2)) continue;
        maze[y][x].isWall = true;
        wallsInOrder.push(maze[y][x]);
      }

      recursiveDivision(x1, y1, x, y2);
      recursiveDivision(x + 1, y1, x2, y2);
    }
  }

  recursiveDivision(1, 1, cols - 1, rows - 1);

  maze[1][1].isStart = true;
  maze[1][1].isWall = false;
  maze[rows - 2][cols - 2].isFinish = true;
  maze[rows - 2][cols - 2].isWall = false;

  getState().setStartNode(maze[1][1]);
  getState().setFinishNode(maze[rows - 2][cols - 2]);

  return [maze, wallsInOrder];
}

function unionSets(setA: Set<Cell>, setB: Set<Cell>, sets: Set<Cell>[]): void {
  // Add all elements from setB to setA
  for (const cell of setB) {
    setA.add(cell);
  }

  // Remove setB from the sets array
  const index = sets.indexOf(setB);
  if (index !== -1) {
    sets.splice(index, 1);
  }
}

function getWallBetween(cellA: Cell, cellB: Cell, maze: Cell[][]): Cell {
  const row = Math.round((cellA.row + cellB.row) / 2);
  const col = Math.round((cellA.col + cellB.col) / 2);
  return maze[row][col];
}

export const animateMaze = (visitedNodesInOrder: Cell[]) => {
  const { getState } = gridStore;
  getState().toggleIsRunning();
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    setTimeout(() => {
      if (i === visitedNodesInOrder.length) {
        getState().toggleIsRunning();
        return;
      }
      const node = visitedNodesInOrder[i];
      if (node.isWall) {
        document.getElementById(`cell-${node.row}-${node.col}`)?.classList.add('animate-isWall');
      }
    }, 2 * i);
  }
};
