import { forwardRef, memo, MouseEvent, PointerEvent, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react"
import { isClick, on } from './event'
import { classNamesFromStyles } from './style'


export type PulldownHandle = {
  deactivate: () => void
  deactivateWithoutCallback: () => void
}

type PulldownRenderProps = {
  active: boolean
}

type PulldownProps = {
  activateOnContextmenu?: boolean
  onActivate?: (e: MouseEvent | PointerEvent) => void
  onDeactivate?: () => void
  children?: ReactNode
  render?: (props: PulldownRenderProps) => ReactNode
  style?: React.CSSProperties
}

const _Pulldown = forwardRef<PulldownHandle, PulldownProps>((
  {
    render,
    children,
    onActivate,
    onDeactivate,
    activateOnContextmenu,
  },
  ref,
) => {
  if (!!render === !!children) {
    console.warn('Pulldown: Exactly one of `render` or `children` must be specified.')
    debugger
  }

  const [active, setActive] = useState(false)
  const handlers = useRef<(() => void)[]>([])

  useImperativeHandle(ref, () => ({
    deactivate,
    deactivateWithoutCallback: () => {
      cleanupHandlers()
      setActive(false)
    }
  }))

  const cleanupHandlers = () => {
    const q = handlers.current
    while (q.length > 0) {
      q.pop()!()
    }
  }

  const activate = (e: PointerEvent | MouseEvent) => {
    onActivate?.(e)
    setActive(true)
  }

  const deactivate = () => {
    cleanupHandlers()
    onDeactivate?.()
    setActive(false)
  }

  const onPointerDown = (e1: PointerEvent | MouseEvent) => {
    if (usedEvents.has(e1)) {
      return
    }
    usedEvents.add(e1)

    if (active) {
      e1.stopPropagation()
      // deactivate()
      return
    }
    activate(e1)
    handlers.current.push(on(
      document,
      'keydown',
      // @ts-ignore
      (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            deactivate()
            break
        }
      },
      { once: true },
    ))
    handlers.current.push(on(
      document,
      'pointerup',
      // @ts-ignore
      (e2: MouseEvent) => {
        if (isClick(e1, e2)) {
          handlers.current.push(
            on(document, 'pointerdown', () => {
              deactivate()
            }, { once: true })
          )
          e2.stopPropagation()
        }
      },
      { once: true, capture: true }, // capture phase!!
    ))
    handlers.current.push(on(
      document,
      'pointerup',
      // @ts-ignore
      (e2: MouseEvent) => {
        deactivate()
      },
      { once: true },
    ))
  }

  return (
    <div
      className={styles.root}
      onPointerDown={(e) => {
        if (!activateOnContextmenu || active) {
          onPointerDown(e)
        }
      }}
      onContextMenu={(e) => {
        if (activateOnContextmenu) {
          e.preventDefault()
          onPointerDown(e)
        }
      }}
    >
      {useMemo(() => render?.({ active }), [active])}
      {children}
    </div >
  )
})

_Pulldown.displayName = 'Pulldown'
export const Pulldown = memo(_Pulldown)

const usedEvents = new WeakSet<PointerEvent | MouseEvent>()

const styles = classNamesFromStyles({
  root: {
    display: 'inline-block',
  }
})
