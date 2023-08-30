import Navbar from './Navbar';
import Grid from './Grid';
import type { Cell, ValidAlgo } from '../lib/types';
import { getNodesInShortestPathOrder } from '../lib/gridUtils';
import { useStore } from '../store/gridStore';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { AStar } from '../algorithms/astar';
import { dijkstra } from '../algorithms/dijkstra';

const VISITED_ANIMATION_SPEED = 8;

const PathfindingVisualizer = () => {
  const { grid, isRunning, toggleIsRunning, clearGrid, finishNode, algo, startNode } = useStore();

  const visualize = (algorithm: ValidAlgo) => {
    if (!isRunning) {
      clearGrid();
      toggleIsRunning();
      if (!finishNode) return;
      if (!startNode) return;

      let visitedNodesInOrder: Cell[] = [];
      switch (algorithm) {
        case 'dijkstra':
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          break;
        case 'aStar':
          visitedNodesInOrder = AStar(grid, startNode, finishNode);
          break;
        case 'BFS':
          visitedNodesInOrder = bfs(grid, startNode, finishNode);
          break;
        case 'DFS':
          visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        default:
          // should never get here
          break;
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  };

  const animate = (visitedNodesInOrder: Cell[], nodesInShortestPathOrder: Cell[]) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      const speed = algo === 'BFS' ? VISITED_ANIMATION_SPEED - 2 : VISITED_ANIMATION_SPEED;
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        continue;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(`cell-${node.row}-${node.col}`)?.className;
        if (nodeClassName !== 'cell cell-start' && nodeClassName !== 'cell cell-finish') {
          document.getElementById(`cell-${node.row}-${node.col}`)?.classList.add('animate-visited');
        }
      }, speed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: Cell[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const nodeClassName = document.getElementById(`cell-${node.row}-${node.col}`)?.className;
        if (nodeClassName !== 'cell cell-start' && nodeClassName !== 'cell cell-finish') {
          document
            .getElementById(`cell-${node.row}-${node.col}`)
            ?.classList.remove('animate-visited');
          document
            .getElementById(`cell-${node.row}-${node.col}`)
            ?.classList.add('animate-shortest');
        }
      }, i * 10);
    }
    setTimeout(() => {
      toggleIsRunning();
    }, (nodesInShortestPathOrder.length - 1) * 10);
  };

  return (
    <div className="bg-red-400 min-h-screen flex flex-col">
      <Navbar visualize={visualize} />
      <div className="grid-container flex-grow flex w-full items-center mx-auto justify-center  bg-stone-600 ">
        <Grid grid={grid} />
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
