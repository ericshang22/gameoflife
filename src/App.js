import logo from './logo.svg';
import React, { useState, useCallback, useRef } from "react";
import produce from 'immer';
import './App.css';
const rowNum = 50;
const colNum = 50;

const operations = [
  [0,1],
  [0,-1],
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmpty = () => {
  const rows = [];
  for (let i = 0; i < rowNum; i++) {
    rows.push(Array(colNum).fill(0))
  }
  return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmpty();
  })

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current){
      return;
    }
    
    setGrid((g) =>{
      return produce(g, gridCopy => {
        for (let i = 0; i < rowNum; i++){
          for(let j = 0; j < colNum; j++){
            let neighbors  = 0;
            operations.forEach(([x,y]) => {
              const newI = i+x;
              const newJ = j+y;
              if(newI >= 0 && newI < rowNum && newJ >= 0 && newJ < colNum){
                neighbors += g[newI][newJ]
              }
            })

            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3){
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    })
    
    setTimeout(runSimulation, 500);
  }, [])

  console.log(grid);
  return <>
  <button onClick ={() => {
    setRunning(!running);
    if (!running){
      runningRef.current = true;
      runSimulation();
    }
  }}> {running ? 'stop' : 'start'} </button>
  <button onClick = {() => {
    setGrid(generateEmpty());
  }}>
    clear
  </button>

  <button onClick = {() => {
    const rows = [];
    for (let i = 0; i < rowNum; i++) {
      rows.push(Array.from(Array(colNum), () => Math.random() > 0.5 ? 1 : 0))
    }
    
    setGrid(rows);
  }}>
    random
  </button>

  <div style = {{
    display: "grid",
    gridTemplateColumns: `repeat(${colNum}, 20px)`
  }}>
    {grid.map((rows, i) =>
        rows.map((col, j) =>
          <div 
          key = {`${i}-${j}`}
          onClick = {()=> {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][j] = grid[i][j] ? 0 : 1;
            })
            setGrid(newGrid);
          }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: grid[i][j] ? 'pink' : undefined,
            border: 'solid 1px black'
            }}
          />
        ))
    }
  </div>
 </>

}

export default App;
