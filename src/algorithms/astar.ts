import type { Cell, Grid } from '../lib/types';
import { directions } from './bfs';

const heuristic = (a: Cell, b: Cell): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

export class PriorityQueue {
  values: { val: Cell; priority: number }[] = [];

  enqueue(val: Cell, priority: number) {
    this.values.push({ val, priority });
    this.values.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.values.shift();
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

export const AStar = (grid: Grid, startNode: Cell, finishNode: Cell): Cell[] => {
  const visitedNodesInOrder: Cell[] = [];
  const queue = new PriorityQueue();
  startNode.distance = 0;
  queue.enqueue(startNode, heuristic(startNode, finishNode));

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
        const priority = newDistance + heuristic(neighbor, finishNode);
        queue.enqueue(neighbor, priority);
      }
    }
  }
  return visitedNodesInOrder;
};
