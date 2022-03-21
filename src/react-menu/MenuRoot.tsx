import classNames from "classnames"
import React, { createContext, forwardRef, ReactNode, useCallback, useMemo, useRef, useState } from "react"
// @ts-ignore
import { CSSTransition } from 'react-transition-group'
import { FloatingLayer } from './FloatingLayer'
import { Menu, MenuHandle } from './Menu'
import { Rect } from './Rect'
import { classNamesFromStyles } from './style'
import { fadeSettings } from './theme'
import { useDisableSelection } from "./useDisableSelection"
import { useWatch } from './useWatch'


export const MenuRootCloseContext = createContext<() => void>(() => { })


type MenuRootProps = {
  active: boolean
  menuContents: ReactNode
  baseRect?: Rect
  fadeOnExit?: boolean
  onCloseRequest: () => void
  nodeRef?: React.MutableRefObject<HTMLDivElement | null>
}


const _MenuRoot = forwardRef<MenuHandle, MenuRootProps>(function MenuRoot(
  {
    baseRect,
    menuContents,
    active,
    fadeOnExit,
    onCloseRequest,
    nodeRef,
  }: MenuRootProps,
  ref,
) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [exitDelay, setExitDelay] = useState(false)

  const transitionClasses = useMemo(() => ({
    exit: fadeStyles.exit,
    exitActive: exitDelay ? fadeStyles.delayExitActive : fadeStyles.exitActive,
  }), [exitDelay])

  useWatch(active, () => {
    if (active) {
      setExitDelay(false)
    }
  })

  const delayClose = useCallback(() => {
    setExitDelay(true)
    onCloseRequest()
  }, [onCloseRequest])

  useDisableSelection(menuRef)

  return (
    <>
      <FloatingLayer>
        <MenuRootCloseContext.Provider value={delayClose}>
          <CSSTransition
            in={active}
            exit={fadeOnExit}
            timeout={{
              enter: 0,
              exit: fadeSettings.duration + (exitDelay ? fadeSettings.delay : 0),
            }}
            classNames={transitionClasses}
            nodeRef={menuRef}
          >{(state: string) => (
            <div
              ref={menuRef}
              className={classNames({
                [fadeStyles.hidden]: !active && state === 'exited',
                [fadeStyles.block]: state === 'exiting',
              })}
            >
              <Menu ref={ref} nodeRef={nodeRef} baseRect={baseRect}>{menuContents}</Menu>
            </div>
          )}
          </CSSTransition>
        </MenuRootCloseContext.Provider>
      </FloatingLayer>
    </>
  )
})

export const MenuRoot = React.memo(_MenuRoot)


const fadeStyles = classNamesFromStyles({
  exit: {
    opacity: 1,
  },
  exitActive: {
    opacity: 0,
    transition: `opacity ${fadeSettings.duration}ms`,
  },
  hidden: {
    display: 'none',
    // visibility: 'hidden'
  },
  delayExitActive: {
    opacity: 0,
    transition: `opacity ${fadeSettings.duration}ms ${fadeSettings.delay}ms`,
  },
  block: {
    pointerEvents: 'none',
  },
})
