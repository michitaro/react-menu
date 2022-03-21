import classNames from 'classnames'
import { memo, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useChoice } from './ChoiceList'
import { MenuHandle } from './Menu'
import { MenuBarActiveContext, MenuBarCancelContext, useMenuBarFocusContext } from './MenuBar'
import { MenuRoot } from './MenuRoot'
import { Rect } from './Rect'
import { ThemeContext } from './theme'
import { useKeyboardNavigation } from './useKeyboardNavigation'
import { useWatch } from './useWatch'


export type MenuBarItemProps = {
  /** Menu bar item's label */
  label: string | ReactNode
  /** If true, the menu bar item will be deactivated when the cursor leaves it (Default: false) */
  deactivateOnPointerLeave?: boolean
  /** Handler called when the menu bar item will be opened */
  onOpen?: () => void
  /** Child menu items */
  children: ReactNode
}


export type MenuBarItemHandle = {
  focus: () => void
}

/**
 * A menu bar item is an entry of menu bar and a container for a menu items.
 */
export const MenuBarItem = memo(function MenuBarItem({ label,
  children,
  deactivateOnPointerLeave,
  onOpen,
}: MenuBarItemProps) {
  const rootEl = useRef<HTMLDivElement>(null)
  const menuEl = useRef<HTMLDivElement>(null)
  const menubarActive = useContext(MenuBarActiveContext)
  const menubarCancel = useContext(MenuBarCancelContext)
  const theme = useContext(ThemeContext)
  const [baseRect, setBaseRect] = useState<Rect>()
  const [opened, setOpened] = useState(false)
  const handle = useRef<MenuBarItemHandle>({
    focus: () => {
      rootEl.current?.focus()
    },
  })
  const choice = useChoice(handle)
  const active = choice.active && (menubarActive || opened)
  const { focusOnNextMenu, focusOnPrevMenu } = useMenuBarFocusContext()

  useWatch(active, function onMenuOpened() {
    if (active) {
      const { bottom, left, width } = rootEl.current!.getBoundingClientRect()
      setBaseRect({
        top: bottom,
        left,
        width,
        height: 0,
      })
      children && onOpen?.()
    }
  })

  useEffect(() => {
    if (active) {
      rootEl.current?.focus()
    }
  }, [active])

  const menu = useRef<MenuHandle>(null)

  const onCloseRequest = useCallback(() => {
    menubarCancel()
    // rootEl.current?.blur()
    setOpened(false)
  }, [])

  const { onKeyDown } = useKeyboardNavigation({
    rootMenu: menu, opened, setOpened,
    focusOnNextMenu, focusOnPrevMenu,
  })

  return (
    <>
      <div
        onPointerLeave={(e) => {
          if (deactivateOnPointerLeave) {
            if (!(e.relatedTarget instanceof HTMLElement && menuEl.current?.contains(e.relatedTarget))) {
              choice.deactivate()
            }
          }
        }}
        ref={rootEl}
        className={classNames(
          theme.menuBarItem,
          { [theme.menuBarItemActive]: active }
        )}
        onPointerDown={() => { choice.activate() }}
        onPointerEnter={(e) => {
          if (menubarActive && e.pointerType == 'mouse') {
            choice.activate()
          }
        }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={(e) => {
          if (!choice.active) {
            setOpened(true)
            choice.activate()
          }
        }}
        onBlur={() => setOpened(false)}
      >
        {label}
      </div>
      <MenuRoot
        ref={menu}
        menuContents={children}
        baseRect={baseRect}
        active={active}
        fadeOnExit={choice.active}
        onCloseRequest={onCloseRequest}
        nodeRef={menuEl}
      />
    </>
  )
})
