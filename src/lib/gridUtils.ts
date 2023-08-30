import { Cell, Grid, Point } from './types';

export function createGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }

  return grid;
}

export const initializeGrid = (rows: number, cols: number): Grid => {
  const grid = createGrid(rows, cols);

  grid[0][0].isStart = true;
  grid[rows - 1][cols - 1].isFinish = true;

  return grid;
};

export const createNode = (row: number, col: number): Cell => {
  return {
    row,
    col,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    heuristic: Infinity,
  };
};

export const getNewGridWithWallToggled = (grid: Grid, row: number, col: number) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (!node.isStart && !node.isFinish) {
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
  }
  return newGrid;
};

export function getNodesInShortestPathOrder(finishNode: Cell | null): Cell[] {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

export function getNodesInShortestPathOrderForMaze(finishPoint: Point): Point[] {
  const nodesInShortestPathOrder = [];
  let currentPoint: Point | undefined = finishPoint;
  while (currentPoint) {
    nodesInShortestPathOrder.unshift(currentPoint);

    currentPoint = currentPoint.parent;
  }
  return nodesInShortestPathOrder;
}
