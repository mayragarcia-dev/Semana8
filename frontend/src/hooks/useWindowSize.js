import { useEffect, useState } from 'react'

function getWindowSize() {
  return { width: window.innerWidth, height: window.innerHeight }
}

export function useWindowSize() {
  const [size, setSize] = useState(getWindowSize)

  useEffect(() => {
    function updateSize() {
      setSize(getWindowSize())
    }

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}
