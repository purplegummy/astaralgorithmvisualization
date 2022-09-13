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
    <div onClick={() => onDrag(x,y)} onDragOverCapture={() => onDrag(x, y)} style={{
        transition: 'all 0.1s ease-in',
        border: '1px solid #9B2335',
        borderRadius: '1px',
        backgroundColor: start ? '#DD4124' : end ? '#009B77' : isPath ? '#EFC050' : closed ? '#98B4D4' : visited ? '#955251' : wall ? 'black'  : 'white',
        width: width + 'px',
        height:  width + 'px',
    }}>

    </div>
  )
}
