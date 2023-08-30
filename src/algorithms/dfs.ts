import type { Cell, Grid } from '../lib/types';
import { directions } from './bfs';

export const dfs = (grid: Grid, startNode: Cell, finishNode: Cell): Cell[] => {
  const visitedNodesInOrder: Cell[] = [];
  let found = false;

  const dfsRecursive = (node: Cell) => {
    if (found || !node || node.isVisited || node.isWall) return;

    node.isVisited = true;
    visitedNodesInOrder.push(node);

    if (node === finishNode) {
      found = true;
      return;
    }

    for (const direction of directions) {
      const newRow = node.row + direction[0];
      const newCol = node.col + direction[1];

      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) continue;

      const neighbor = grid[newRow][newCol];

      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = node;
        neighbor.distance = node.distance + 1;
        dfsRecursive(neighbor);
      }
    }
  };

  dfsRecursive(startNode);
  return visitedNodesInOrder;
};
