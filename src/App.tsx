import PathfindingVisualizer from './components/Pathfinding';

// const MAZE: Value[][] = [
//   ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
//   ['W', 'S', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'W'],
//   ['W', 'L', 'W', 'W', 'W', 'W', 'W', 'W', 'L', 'W'],
//   ['W', 'L', 'W', 'L', 'L', 'L', 'L', 'W', 'L', 'W'],
//   ['W', 'L', 'W', 'L', 'W', 'W', 'L', 'W', 'L', 'W'],
//   ['W', 'L', 'W', 'L', 'W', 'W', 'L', 'W', 'L', 'W'],
//   ['W', 'L', 'W', 'L', 'W', 'W', 'L', 'W', 'L', 'W'],
//   ['W', 'L', 'W', 'L', 'W', 'W', 'L', 'W', 'L', 'W'],
//   ['W', 'L', 'L', 'L', 'W', 'W', 'L', 'L', 'F', 'W'],
//   ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
// ];

function App() {
  return (
    <>
      <div className="hidden fixed bottom-10 right-10 md:flex px-2 py-1 bg-slate-100 rounded-xl gap-2 ">
        <a
          href="https://github.com/Delvoid/vision-maze"
          target="_blank"
          className="h-10 w-10  bg-white rounded-full flex items-center justify-center hover:bg-slate-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 24 24"
          >
            <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
          </svg>
        </a>
        <a
          href="https://x.com/delvoid"
          target="_blank"
          className="h-10 w-10 p-1 bg-white rounded-full flex items-center justify-center hover:bg-slate-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 24 24"
          >
            <path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,21H3V3h18V21z M17.538,17l-4.186-5.99L16.774,7h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
          </svg>
        </a>
      </div>
      <PathfindingVisualizer />
    </>
  );
}

export default App;
