import classNames from 'classnames'
import React, { createContext, CSSProperties, memo, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react"
import { ChoiceList, ChoiceListHandle } from './ChoiceList'
import { MenuBarItemHandle } from './MenuBarItem'
import { Pulldown, PulldownHandle } from './Pulldown'
import { classNamesFromStyles } from './style'
import { ThemeContext } from './theme'
import { useDisableSelection } from './useDisableSelection'


export type MenuBarProps = {
  /** Child menu bar items */
  children: ReactNode
  /** Styles applied to the menu bar. Useful to set cornerRadius */
  style?: CSSProperties
}

export const MenuBarActiveContext = createContext<boolean>(false)
MenuBarActiveContext.displayName = 'MenuBarActiveContext'

export const MenuBarCancelContext = createContext<() => void>(() => { })
MenuBarCancelContext.displayName = 'MenuBarCancelContext'

export function useMenuBarFocusContext() {
  const context = useContext(FocusContext)
  return context
}

const FocusContext = createContext({
  focusOnNextMenu: () => { },
  focusOnPrevMenu: () => { },
})

/**
 * A menu bar is a container for a menu bar items.
 */
export const MenuBar = memo(function MenuBar({ children, style = {} }: MenuBarProps) {
  const theme = useContext(ThemeContext)
  const nodeRef = useRef<HTMLDivElement>(null)
  const pulldown = useRef<PulldownHandle>(null)
  const [active, setActive] = useState(false)
  const choiceList = useRef<ChoiceListHandle<MenuBarItemHandle>>(null)

  const moveFocus = (direciton: number) => {
    const n = choiceList.current!.list().length
    const a = choiceList.current!.activeIndex()
    if (a !== undefined) {
      const i = (a + direciton + n) % n
      choiceList.current!.list()[i].focus()
    }
  }

  const focusContext: React.ContextType<typeof FocusContext> = {
    focusOnNextMenu: () => moveFocus(1),
    focusOnPrevMenu: () => moveFocus(-1),
  }

  const onActivate = useCallback(() => {
    setActive(true)
  }, [])

  const onDeactivate = useCallback(() => {
    setActive(false)
    // choiceList.current?.clear()
  }, [])

  const cancel = useCallback(() => {
    setActive(false)
    pulldown.current!.deactivate()
  }, [])

  useDisableSelection(nodeRef)

  return (
    <ChoiceList ref={choiceList}>
      <Pulldown
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        ref={pulldown}
      >
        <div
          className={classNames(styles.root, theme.menuBar)}
          style={style}
          ref={nodeRef}
        >
          <div className={styles.items}>
            <MenuBarActiveContext.Provider value={active}>
              <MenuBarCancelContext.Provider value={cancel}>
                <FocusContext.Provider value={focusContext}>
                  {children}
                </FocusContext.Provider>
              </MenuBarCancelContext.Provider>
            </MenuBarActiveContext.Provider>
          </div>
        </div>
      </Pulldown>
    </ChoiceList>
  )
})


const styles = classNamesFromStyles({
  root: {
    cursor: 'default',
    userSelect: 'none',
  },
  items: {
    display: 'flex',
  },
})