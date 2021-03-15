import { useState, useRef, useEffect, FC } from 'react'
import { ResizableBox, ResizableBoxProps } from 'react-resizable'
import './resizable.css'

interface ResizableProps {
  direction: 'horizontal' | 'vertical'
}

const Resizable: FC<ResizableProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth * 0.75)

  const timer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const listener = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setInnerWidth(window.innerWidth)
        setInnerHeight(window.innerHeight)
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75)
        }
      }, 100)
    }
    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [width])

  let resizableBoxProps: ResizableBoxProps

  if (direction === 'horizontal') {
    resizableBoxProps = {
      className: 'resizable-horizontal',
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      height: Infinity,
      width,
      resizeHandles: ['e'],
      onResizeStop: (_, data) => {
        setWidth(data.size.width)
      },
    }
  } else {
    resizableBoxProps = {
      width: Infinity,
      height: 200,
      resizeHandles: ['s'],
      minConstraints: [Infinity, 48],
      maxConstraints: [Infinity, innerHeight * 0.9],
    }
  }

  return <ResizableBox {...resizableBoxProps}>{children}</ResizableBox>
}

export default Resizable
