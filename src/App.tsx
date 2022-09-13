import {useState, useEffect} from 'react';
import {Node} from './components/Node';

function App() {
  
  type Node = {
    start: boolean,
    end: boolean,
    wall: boolean,
    x: number,
    y: number,
    closed: boolean,
    visited: boolean,
    width: number,
    f_score: number,
    g_score: number,
    isPath: boolean,
    
  }
  const [visited, setVisited] = useState<Node[]>([]);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('walls');
  const [nodes, setNodes] = useState([
    [{
      start: false,
      end: false,
      wall: false,
      x: 0,
      y: 0,
      width: 0,
      closed: false,
      visited: false,
      f_score: 1,
      g_score: 0,
      isPath: false,

}]
  ]);
  const [found, setFound] = useState(false);
  const ROWS = 40;
  const COLS = 40;
  const width = 20;

  // creates grid of size ROWS x COLS and returns the grid
  const initializeGrid = () => {
    if (found) {
      setFound(false);
    }
    const grid: Node[][] = [];
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
          visited: false,
          closed: false,
          f_score: Infinity,
          g_score: Infinity,
          isPath: false,
        });

      }
      grid.push(temp);
    }
    
    grid.map((row: Node[]) => {
      row.map((node: Node) => {
        if (node.start){
          node.f_score = h(node, grid[15][30]);
          node.g_score = 0;
        }

      })})
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
              node.start = false;
            } else if (node.start){
              node.start = false;
              node.f_score = Infinity;
              node.g_score = Infinity;
            }
            if (node.x === x && node.y === y && node.end === false){
              node.start = true;
            } else {
              node.start = false;
            }
           
          }
        )
      )
      console.log(newGrid);
    } else if (mode === 'end'){
      newGrid.map(
        (row: Node[]) => row.map(
          (node: Node) => {
            if (node.start){
              node.end = false;
            }
            if (node.x === x && node.y === y && node.start === false){
              node.end = true;
            } else {
              node.end = false;
            }
          }
        )
      )
    } else if (mode === 'walls'){
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
    
    
    setNodes([...newGrid]);
  }
  
  const reconstructPath =(cameFrom: Map<Node, Node>, current: Node) => {
    // reconstruct path found by algorithm
    const totalPath = [current];
    while (cameFrom.has(current)){
      if (cameFrom.get(current)){
        current = cameFrom.get(current)!;
        totalPath.unshift(current);
      }
      
    }
    const grid = nodes;
    grid.map((row: Node[]) => row.map(async (node: Node, i: number) => {
     
      if (totalPath.includes(node)){
        
        node.isPath = true;
      
        
      } else {
        node.isPath = false;
      }
    
    }))

  }
  const sleep = (mill: number) => {
    return new Promise(resolve => {
      const timer = setTimeout(resolve, mill)
      return () => clearTimeout(timer);
      
    })
  }

  // a star algorithm that finds the shortest path from the start node to the end node
  const aStar = async (start: Node, end: Node ) => {
    setRunning(true);
    setMode('');
    //needc to check if algorithm was run already and if so, reset the grid
    if (found) {
      initializeGrid();
      setFound(false);
    }
    nodes.map((row: Node[]) => {
      row.map((node: Node) => {
        if (node.start){
          node.f_score = h(node, nodes[getEnd()[1]][getEnd()[0]]);
          node.g_score = 0;
        }

      })})
    //setNodes(nodes);
    const newGrid = [...nodes];
    
    const openSet = [start];
    let cameFrom = new Map<Node,Node>(); 
    const fScore = [];
    start.f_score = h(start, end);
    fScore.push(start);
    

    while (openSet.length > 0) {
      await sleep(10);
      setNodes([...newGrid]);
      // find node in open set with lowest fSCore
      const current = findLowestFScore(openSet);
     
      if (current === end) {
        console.log("path found")
        
        setFound(true);
        reconstructPath(cameFrom, current);
        setRunning(false);
        return; // path found 

      }
      openSet.splice(openSet.indexOf(current), 1);
      const neighbors = getNeighbors(current, newGrid);
      
      
      for (let i = 0; i < neighbors.length; i++) {
          const tgScore = current.g_score + 1;
          const neighbor = neighbors[i];
          if (tgScore < neighbor.g_score) { 
            cameFrom.set(neighbor, current);
            neighbor.g_score = tgScore;
            neighbor.f_score = neighbor.g_score + h(neighbor, end);
            
            if (!openSet.find(node => node === neighbor)) { // if neighbor is not in open set, add it
              openSet.push(neighbor);
              neighbor.visited = true;
    
            
          
            }

          }


      }

      
      if (current !== start){
        current.visited = false;
        current.closed = true;
      
      }

    
      


    }
    console.log("failed")
    setRunning(false);
    return "Failed: no path found";
  }
  const getNeighbors = (current: Node, grid: Node[][]) => {
    const neighbors: Node[] = [];

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (grid[i][j].wall) {
          continue;
        }
        if (i === current.y && j === current.x) {
          continue;
        }
        if (i === current.y && j === current.x + 1 && current.x + 1 < COLS) {
          neighbors.push(grid[i][j]);
        }
        if (i === current.y && j === current.x - 1 && current.x - 1 >= 0) {
          neighbors.push(grid[i][j]);
        }
        if (j === current.x && i === current.y - 1 && current.y - 1 >=0) {
          neighbors.push(grid[i][j]);
        }
        if (j === current.x && i === current.y + 1 && current.y + 1 < ROWS) {
          neighbors.push(grid[i][j]);
        }
        }

      }
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
  
  const getStart = () => {
    let vals = [10,15];
    nodes.map((row: Node[]) => row.map((node: Node) => {
        console.log(node.start);
        if (node.start){
          vals = [node.x, node.y];
        } 
      })

    )
   
    return vals;
  }

  const getEnd = () => {
    let vals = [10,15];
    nodes.map((row: Node[]) => row.map((node: Node) => {

        if (node.end){
          
          vals = [node.x,node.y];
        }
      })

    )
    return vals;
  
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
      <button disabled={running || found} onClick={() => aStar(nodes[getStart()[1]][getStart()[0]], nodes[getEnd()[1]][getEnd()[0]])}>Start A* Algorithm</button>
      <button disabled={running || found} onClick={() => setMode('start')}>Change Start</button>
      <button disabled={running || found} onClick={() => setMode('end')}>Change End</button>
      <button disabled={running || found} onClick={() => setMode('walls')}>Add Walls</button>
      <button disabled={running} onClick={() => initializeGrid()}>Reset</button>
    </div>
  
    {
  // iterate through 2d array of nodes, then create a row of nodes with props
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
                  <Node key={`${i}-${j}`} {...node} onDrag={handleDrag} />
              
              )})}
      </div>
    )})}
  </div>)

}
export default App;
