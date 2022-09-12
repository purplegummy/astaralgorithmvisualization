import React from 'react'

export type NodeProps = {
    start: boolean,
    end: boolean,
    wall: boolean,
    x: number,
    y: number,
    width: number,
    onDrag: (x: number, y: number) => void,
    isPath: boolean
    visited: boolean,
    closed: boolean
}
export const Node = ({start, end, wall, x, y, width,onDrag, isPath, visited, closed}: NodeProps) => {
  
  return (
    <div onClick={() => onDrag(x,y)} onDragOver={() => onDrag(x, y)} style={{
        border: '1px solid black', 
        backgroundColor: start ? 'red' : end ? 'green' : isPath ? 'yellow' : closed ? 'blue' : visited ? 'purple' : wall ? 'black'  : 'white',
        width: width + 'px',
        height:  width + 'px',
    }}>

    </div>
  )
}
