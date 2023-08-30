import { useStore } from '../store/gridStore';
import { Cell, Grid, ValidAlgo, ValidMazeAlgo } from '../lib/types';
import {
  animateMaze,
  generateDFSMaze,
  generateMazeKruskals,
  generateMazePrims,
  generateRecursiveDivisionMaze,
} from '../lib/maze';
import { cn } from '../lib/utils';

export default function Navbar({ visualize }: { visualize: (algo: ValidAlgo) => void }) {
  const {
    isRunning,
    clearGrid,
    clearWalls,
    updateGrid,
    algo,
    setAlgo,
    rows,
    cols,
    selectedMaze,
    setSelectedMaze,
    startNode,
    finishNode,
  } = useStore();

  const closeDropdowns = () => {
    const dropdowns = document.querySelectorAll('[data-dropdown-toggle]');
    dropdowns.forEach((dropdown) => {
      if (!dropdown) return;
      const dropdownId = dropdown.getAttribute('data-dropdown-toggle');
      if (!dropdownId) return;
      const target = document.getElementById(dropdownId);
      if (!target) return;
      if (target && !target.classList.contains('hidden')) {
        target.classList.add('hidden');
      }
    });
  };

  const randomMaze = (algo: ValidMazeAlgo) => {
    if (isRunning) return;
    clearGrid();
    clearWalls();
    let maze: Grid = [];
    let wallsInOrder: Cell[] = [];
    switch (algo) {
      case 'prim': {
        const [newMaze, walls] = generateMazePrims(rows, cols);
        maze = newMaze;
        wallsInOrder = walls;
        break;
      }
      case 'rdfs': {
        const [newMaze, walls] = generateDFSMaze(rows, cols);
        maze = newMaze;
        wallsInOrder = walls;

        break;
      }
      case 'kruskal': {
        const [newMaze, walls] = generateMazeKruskals(rows, cols);
        maze = newMaze;
        wallsInOrder = walls;
        break;
      }
      case 'recursive': {
        console.error('recursive not implemented');
        const [newMaze, walls] = generateRecursiveDivisionMaze(rows, cols);
        maze = newMaze;
        wallsInOrder = walls;
        break;
      }
      default:
        break;
    }
    setSelectedMaze(algo);
    updateGrid(maze);
    animateMaze(wallsInOrder);
    closeDropdowns();
  };

  const selectAlgo = (algo: ValidAlgo) => {
    setAlgo(algo);
    closeDropdowns();
  };
  return (
    <nav className="bg-gray-900 border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center">
          <img src="/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Vison Maze
          </span>
        </a>

        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto  md:justify-center" id="navbar-dropdown">
          <ul className="flex flex-col md:items-center font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button
                className={cn(
                  'block py-2 pl-3 pr-4 text-white  rounded   ',
                  isRunning ? 'bg-red-500 cursor-not-allowed' : 'bg-blue-700'
                )}
                onClick={() => visualize(algo)}
                disabled={isRunning || !startNode || !finishNode}
              >
                Visualize
              </button>
            </li>
            <li>
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                className="flex items-center justify-between w-full py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Algorithms{' '}
                <svg
                  className="w-2.5 h-2.5 ml-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownNavbar"
                className="z-10 hidden font-normal divide-y rounded-lg shadow w-44 bg-gray-700 divide-gray-600"
              >
                <ul className="py-2 text-sm text-gray-400" aria-labelledby="dropdownLargeButton">
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        algo === 'BFS' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => selectAlgo('BFS')}
                    >
                      Breath First Search
                    </button>
                  </li>
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        algo === 'DFS' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => selectAlgo('DFS')}
                    >
                      Depth First Search
                    </button>
                  </li>
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        algo === 'aStar' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => selectAlgo('aStar')}
                    >
                      A*
                    </button>
                  </li>
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        algo === 'dijkstra' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => selectAlgo('dijkstra')}
                    >
                      Dijkstra
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button
                id="maze-patterns-list"
                data-dropdown-toggle="maze-patterns"
                className="flex items-center justify-between w-full py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Mazes & Patterns{' '}
                <svg
                  className="w-2.5 h-2.5 ml-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="maze-patterns"
                className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        selectedMaze === 'prim' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => randomMaze('prim')}
                    >
                      Prims
                    </button>
                  </li>
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        selectedMaze === 'rdfs' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => randomMaze('rdfs')}
                    >
                      Recursive Backtracking (Random DFS)
                    </button>
                  </li>
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        selectedMaze === 'kruskal' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => randomMaze('kruskal')}
                    >
                      Kruskal's
                    </button>
                  </li>
                  <li>
                    <button
                      className={cn(
                        'block w-full text-left px-4 py-2 hover:bg-gray-600 hover:text-white',
                        selectedMaze === 'recursive' ? 'bg-green-600 text-white' : ''
                      )}
                      onClick={() => randomMaze('recursive')}
                    >
                      Recursive Division
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => clearGrid()}
              >
                Clear Path
              </button>
            </li>
            <li>
              <button
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => {
                  setSelectedMaze('');
                  clearWalls();
                }}
              >
                Clear Walls
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
