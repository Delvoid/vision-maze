import type { Cell, Grid } from '../lib/types';

export const directions = [
  [-1, 0], // Up
  [1, 0], // Down
  [0, -1], // Left
  [0, 1], // Right
];

export const bfs = (grid: Grid, startNode: Cell, finishNode: Cell): Cell[] => {
  const visitedNodesInOrder: Cell[] = [];
  const queue: Cell[] = [startNode];
  startNode.distance = 0;

  while (queue.length) {
    const curr = queue.shift();

    if (!curr || curr.isVisited || curr.isWall) continue;

    curr.isVisited = true;
    visitedNodesInOrder.push(curr);

    if (curr === finishNode) return visitedNodesInOrder;

    for (const direction of directions) {
      const newRow = curr.row + direction[0];
      const newCol = curr.col + direction[1];

      // check bounds
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) continue;

      const neighbor = grid[newRow][newCol];

      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = curr;
        neighbor.distance = curr.distance + 1;
        queue.push(neighbor);
      }
    }
  }
  return visitedNodesInOrder;
};
