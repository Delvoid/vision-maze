import type { Cell } from '../lib/types';
import { cn } from '../lib/utils';
import { useStore } from '../store/gridStore';
import { useMouseStore } from '../store/mouseStore';

interface Props extends Cell {
  size?: number;
}

export default function Cell({ row, col, isStart, isFinish, isWall, size = 5 }: Props) {
  const { grid, updateGrid, setStartNode, startNode, finishNode, setFinishNode } = useStore();
  const {
    toggleIsPressed,
    isPressed,
    isDraggingStart,
    setIsDraggingStart,
    isDraggingFinish,
    setIsDraggingFinish,
  } = useMouseStore();
  let hoverClass = 'hover:bg-slate-400 cursor-default';
  if (isDraggingStart) {
    hoverClass = 'hover:bg-green-400 cursor-grab';
  }
  if (isDraggingFinish) {
    hoverClass = 'hover:bg-red-400  cursor-grab';
  }
  // needed to add this as when the start or finished node was been dragged
  // the animate-isWall class was being removed
  const existingClasses = document.getElementById(`cell-${row}-${col}`)?.className || '';
  const className = cn(
    existingClasses,
    'bg-white',
    hoverClass,
    getClassName(isStart, isFinish, isWall)
  );

  function toggleWall(row: number, col: number) {
    if (isStart || isFinish) return;
    if (isDraggingFinish || isDraggingStart) return;

    const updatedGrid = grid;
    updatedGrid[row][col].isWall = !updatedGrid[row][col].isWall;
    updateGrid(updatedGrid);
    const node = document.getElementById(`cell-${row}-${col}`)?.classList;
    if (!node) return;
    if (node.contains('animate-visited')) {
      node.remove('animate-visited');
    }
    if (node.contains('animate-shortest')) {
      node.remove('animate-shortest');
    }
    node.toggle('animate-isWall');
  }

  const handleClick = () => {
    if (isStart || isFinish) return;
    toggleWall(row, col);
  };

  const handleMouseDown = () => {
    if (grid[row][col].isStart) {
      setIsDraggingStart(true);
      setStartNode(null);
      const updatedGrid = grid;
      updatedGrid[row][col].isStart = false;
      updateGrid(updatedGrid);
    } else if (grid[row][col].isFinish) {
      setIsDraggingFinish(true);
      setFinishNode(null);
      const updatedGrid = grid;
      updatedGrid[row][col].isFinish = false;
      updateGrid(updatedGrid);
    } else {
      toggleIsPressed();
    }
  };

  const handleMouseUp = () => {
    if (isDraggingStart && !grid[row][col].isFinish && !startNode) {
      const updatedGrid = grid;
      updatedGrid[row][col].isStart = true;
      setStartNode(grid[row][col]);
      updateGrid(updatedGrid);
      setIsDraggingStart(false);
      return;
    }
    if (isDraggingFinish && !grid[row][col].isStart && !finishNode) {
      const updatedGrid = grid;
      updatedGrid[row][col].isFinish = true;
      setFinishNode(grid[row][col]);
      updateGrid(updatedGrid);
      setIsDraggingFinish(false);
      return;
    }
    if (isPressed) {
      toggleIsPressed();
      return;
    }
  };

  return (
    <div
      id={`cell-${row}-${col}`}
      className={className}
      style={{ width: `${size}px`, height: `${size}px` }}
      onMouseDown={() => handleMouseDown()}
      onMouseUp={() => handleMouseUp()}
      onClick={() => handleClick()}
      onMouseOver={() => {
        if (!isDraggingStart && !isDraggingFinish && isPressed) {
          toggleWall(row, col);
        }
      }}
    />
  );
}

function getClassName(isStart: boolean, isFinish: boolean, isWall: boolean) {
  if (isStart) {
    return 'cell bg-green-500 hover:bg-green-400 cursor-grab';
  } else if (isFinish) {
    return 'cell bg-red-500 hover:bg-red-400 cursor-grab';
  } else if (isWall) {
    return 'cell ';
  } else {
    return 'cell';
  }
}
