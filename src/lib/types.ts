export interface Cell {
  row: number;
  col: number;
  isStart: boolean;
  isFinish: boolean;
  distance: number;
  isVisited: boolean;
  isWall: boolean;
  previousNode: Cell | null;
  heuristic: number;
}

export type Grid = Cell[][];

export type ValidAlgo = 'dijkstra' | 'aStar' | 'BFS' | 'DFS';
export type ValidSpeed = 'Fast' | 'Average' | 'Slow';
export type ValidMazeAlgo = 'rdfs' | 'prim' | 'kruskal' | 'recursive';
export type Value = 'W' | 'L' | 'S' | 'F' | 'P';
export type Point = {
  x: number;
  y: number;
  parent?: Point;
};
