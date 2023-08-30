import { Grid, Cell } from '../lib/types';
import { PriorityQueue } from './astar';
import { directions } from './bfs';

export const dijkstra = (grid: Grid, startNode: Cell, finishNode: Cell): Cell[] => {
  const visitedNodesInOrder: Cell[] = [];
  const queue = new PriorityQueue();
  startNode.distance = 0;
  queue.enqueue(startNode, 0);

  while (!queue.isEmpty()) {
    const dequeued = queue.dequeue();
    if (!dequeued) continue;

    const curr = dequeued.val;

    if (curr.isVisited || curr.isWall) continue;

    curr.isVisited = true;
    visitedNodesInOrder.push(curr);

    if (curr === finishNode) return visitedNodesInOrder;

    for (const direction of directions) {
      const newRow = curr.row + direction[0];
      const newCol = curr.col + direction[1];

      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) continue;

      const neighbor = grid[newRow][newCol];

      const newDistance = curr.distance + 1;
      if (!neighbor.isVisited && !neighbor.isWall && newDistance < neighbor.distance) {
        neighbor.previousNode = curr;
        neighbor.distance = newDistance;
        queue.enqueue(neighbor, newDistance);
      }
    }
  }
  return visitedNodesInOrder;
};
