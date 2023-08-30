import Cell from './Cell';
import type { Grid } from '../lib/types';
import { useState, useEffect, useRef } from 'react';
import { animateMaze, generateDFSMaze } from '../lib/maze';
import { useStore } from '../store/gridStore';
import { useMouseStore } from '../store/mouseStore';

export default function Grid({ grid }: { grid: Grid }) {
  const loaded = useRef(false);
  const { rows, cols, updateGrid, setSelectedMaze, selectedMaze } = useStore();
  const { toggleIsPressed, isPressed } = useMouseStore();
  const [width, setWidth] = useState(Math.min(1280, window.innerWidth));
  const [height, setHeight] = useState(Math.min(720, window.innerHeight));
  const maxCellSize = Math.min(
    Math.max(6, Math.floor(width / 60)),
    Math.max(6, Math.floor(height / 40))
  );

  useEffect(() => {
    function handleResize() {
      const maxWidth = Math.min(1280, window.innerWidth);
      const minHeight = Math.min(720, window.innerHeight);
      setWidth(maxWidth);
      setHeight(minHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    if (selectedMaze) return;
    const [maze, visitedNodesInOrder] = generateDFSMaze(rows, cols);

    setSelectedMaze('rdfs');
    updateGrid(maze);
    animateMaze(visitedNodesInOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex "
      onMouseLeave={() => {
        console.log('mouse leave');
        if (isPressed) {
          console.info('toggleIsPressed');
          toggleIsPressed();
        }
      }}
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx}>
          {row.map((cell) => (
            <Cell {...cell} key={`${cell.row}-${cell.col}`} size={maxCellSize} />
          ))}
        </div>
      ))}
    </div>
  );
}
