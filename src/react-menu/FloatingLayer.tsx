import { memo, ReactNode, useLayoutEffect } from "react"
import { createPortal } from 'react-dom'
import { classNamesFromStyles } from "./style"


type FloatingLayerProps = {
  children: ReactNode
}


const styles = classNamesFromStyles({
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0,
  }
})


export const FloatingLayer = memo(function FloatingLayer({
  children,
}: FloatingLayerProps
) {
  const mountpoint = useTopPortalElement()
  return createPortal(children, mountpoint)
})


export const useTopPortalElement = (() => {
  let count = 0
  const mountpoint = document.createElement('div')

  // In Firefox, rendering an element whose parent element is not in the viewport
  // will result in very poor performance.
  // So we have to bring the placeholder element into the viewport.
  mountpoint.className = styles.fixed

  return function useTopPortalElement() {
    useLayoutEffect(() => {
      if (count++ === 0) {
        document.body.appendChild(mountpoint)
      }
      return () => {
        if (count-- === 0) {
          document.body.removeChild(mountpoint!)
        }
      }
    }, [])

    return mountpoint
  }
})()

