import React from 'react'

export type NodeProps = {
    start: boolean,
    end: boolean,
    wall: boolean,
    x: number,
    y: number,
    width: number,
    onDrag: (x: number, y: number) => void,
    mode: string
}
export const Node = ({start, end, wall, x, y, width,onDrag, mode}: NodeProps) => {
  
  return (
    <div onClick={() => onDrag(x,y)} onDragOver={() => onDrag(x, y)} style={{
        border: '1px solid black', 
        backgroundColor: start ? 'red' : end ? 'green' : wall ? 'black' : 'white',
        width: width + 'px',
        height:  width + 'px',
    }}>

    </div>
  )
}
