import { useEffect } from "react"
import { on } from './event'

/**
 * On Safari, dragging on an element changes the cursor to I-beam,
 * even if the element has style `user-select: none`.
 */
export function useDisableSelection(nodeRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (nodeRef.current) {
      return on(nodeRef.current, 'selectstart', e => {
        e.preventDefault()
      })
    }
  }, [])
}
