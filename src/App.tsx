import {useState, useEffect} from 'react';
import {Node} from './components/Node';

function App() {
  
  type Node = {
    start: boolean,
    end: boolean,
    wall: boolean,
    x: number,
    y: number,
    width: number,
    f_score: number,
    g_score: number,
    
  }
  const [mode, setMode] = useState('walls');
  const [nodes, setNodes] = useState([
    [{
      start: false,
      end: false,
      wall: false,
      x: 0,
      y: 0,
      width: 0,
      f_score: Infinity,
      g_score: Infinity,

}]
  ]);
  const ROWS = 30;
  const COLS = 40;
  const width = 20;
  
  // creates grid of size ROWS x COLS and returns the grid
  const initializeGrid = () => {
    const grid = [];
    for (let i = 0; i <ROWS; i++){ 
      const temp = [];
      for (let j = 0; j < COLS; j++){
        temp.push({
          width,
          start: i === 15 && j === 10,
          end: i === 15 && j === 30,
          wall: false,
          x: j,
          y: i,
          f_score: Infinity,
          g_score: Infinity,
        });

      }
      grid.push(temp);
    }
    console.log(grid);
    setNodes(grid);
  }

  // sets nodes state to the original grid created
  useEffect(() => {
   initializeGrid();
  }, []);


  // changes the current start node to the node at the passed in x and y coordinates
  const changeNode = (x:number, y:number) => {
    const newGrid = [...nodes];
    // need to fix bug where start or end node disappears when you click on opposite node
    if (mode === 'start'){  
      newGrid.map(
        (row: Node[]) => row.map(
          (node: Node) => {
            if (node.end){
              return;
            }
            if (node.x === x && node.y === y && node.end === false){
              node.start = true;
            } else {
              node.start = false;
            }
          }
        )
      )
    } else if (mode === 'end'){
      newGrid.map(
        (row: Node[]) => row.map(
          (node: Node) => {
            if (node.start){
              return;
            }
            if (node.x === x && node.y === y && node.start === false){
              node.end = true;
            } else {
              node.end = false;
            }
          }
        )
      )
    } else {
      newGrid.map(
        (row: Node[]) => row.map(
          (node: Node) => {
            if (node.x === x && node.y === y){
              node.wall = true;
            } 
          }
        )
      )
    }
    
    console.log(newGrid);
    setNodes(newGrid);
  }

  // a star algoirthm that finds the shortest path from the start node to the end node
  const aStar = (start: Node, end: Node, ) => {
    const newGrid = [...nodes];
    // need to not hard code later
    const startNode = newGrid[15][10];
    const endNode = newGrid[15][30];
    const openSet = [start];
    const closedSet = [];
    const cameFrom = [];
    const gScore = [];
    const fScore = [];
    start.f_score = h(start, end);
    fScore.push(start);
    

    while (openSet.length > 0) {
      // find node in open set with lowest fSCore
      const current = findLowestFScore(openSet);
      if (current === end) {
        return; // path found --> need to reconstruct path

      }
      
      const neighbors = getNeighbors(current, newGrid);
      for (let i = 0; i < neighbors.length; i++) {
          const tgScore = current.g_score + 1;
          const neighbor = neighbors[i];
          if (tgScore < neighbor.g_score) {
            
          }

      }
    }
  }
  const getNeighbors = (current: Node, grid: Node[][]) => {
    const neighbors: Node[] = [];
   
    return neighbors;

  }
  const h = (current: Node, end: Node) => {
    return Math.abs(end.x - current.x) + Math.abs(end.y - current.y);
  }
  const findLowestFScore = (openSet: Node[]) => {
    let lowest = openSet[0];
   
    for (let i = 1; i < openSet.length; i++){
      const node = openSet[i];
      if (node.f_score < lowest.f_score){
        lowest = openSet[i];
        
      }
    }
    return lowest;
  }
  const handleDrag = (x: number, y: number) => {
    changeNode(x,y);
 
  }
  return (<div
  style={{
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: (COLS*30) + 'px',
  }}
  >
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '25px',
      marginBottom: '50px',
    }}>
      <button>Start A* Algorithm</button>
      <button onClick={() => setMode('start')}>Change Start</button>
      <button onClick={() => setMode('end')}>Change End</button>
      <button onClick={() => setMode('walls')}>Add Walls</button>
      <button onClick={() => initializeGrid()}>Reset</button>
    </div>
  
    {
  // iterate through 2d array of nodes, then create a row of nodes with associated props
  nodes.map((row: Node[], i: number) => {
    return (


      <div key={i} style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        {
        row.map((node: Node, j: number) => 
          {
              return (
                  <Node key={`${i}-${j}`} {...node} onDrag={handleDrag} mode={mode} />
              
              )})}
      </div>
    )})}
  </div>)

}
export default App;
