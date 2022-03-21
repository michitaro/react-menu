import classNames from 'classnames'
import React, { memo, ReactNode, RefObject, useCallback, useContext, useMemo, useRef, useState } from "react"
import { useChoice } from './ChoiceList'
import { KeyBind, KeyTrigger, useKeybind } from './keybind'
import { Menu, MenuHandle, useOnParentOpen } from './Menu'
import { MenuRootCloseContext } from './MenuRoot'
import { Rect } from './Rect'
import { classNamesFromStyles } from './style'
import { fadeSettings, ThemeContext } from './theme'
import { useWatch } from './useWatch'


const styles = classNamesFromStyles({
  body: {
    display: 'flex',
    alignItems: 'baseline',
  },
  bodyLeft: {},
  bodyMain: {
    flexGrow: 1,
    marginRight: '2em',
  },
  bodyRight: {},
  hidden: {
    display: 'none',
  },
})


export type MenuItemProps = {
  /** Menu item's label */
  label: string | ReactNode
  /** If true, the menu item has a checkbox checked. (Default: false) */
  checked?: boolean
  /** If true, the menu item is disabled. (Default: false) */
  disabled?: boolean
  /** Handler called when the menu item is selected. */
  onClick?: () => void
  /** Keyboard shortcut. The argument will be parsed by `Keybind.parse` */
  keybind?: string
  /** If true, the `onClick` handler will be called immediately when the item is selected. */
  noDelay?: boolean
  /** Handler called then the item is activated. */
  onOpen?: () => void
  /** Child menu items */
  children?: ReactNode
}

/**
 * A menu item is an entry of menu and a container for a menu items.
 */
export const MenuItem = memo(function MenuItem({
  label,
  children,
  checked,
  keybind,
  onClick,
  disabled,
  noDelay,
  onOpen,
}: MenuItemProps) {
  const handle = useRef<MenuItemHandle>()
  const choice = useChoice(handle)
  const menuRootClose = useContext(MenuRootCloseContext)
  const rootEl = useRef<HTMLDivElement>(null)
  const menuEl = useRef<HTMLDivElement>(null)
  const [baseRect, setBaseRect] = useState<Rect>()
  const [flashing, setFlashing] = useState(false)
  const [opened, setOpened] = useState(false) // set to true when pointerenter of keyboard `RightArrow` is pressed
  const theme = useContext(ThemeContext)
  const menu = useRef<MenuHandle>(null)

  handle.current = {
    opened: opened && choice.active,
    menu,
    disabled: !!disabled,
    hasChild: !!children,
    open: (options = {}) => {
      choice.activate()
      if (children) {
        setOpened(true)
        if (options.activateFirstItem) {
          for (const item of menu.current?.childList() || []) {
            if (!item.disabled) {
              // we have to wrap this in a requestAnimationFrame
              // because the activated item will be cleared on useLayoutEffect of the menu's resize
              requestAnimationFrame(item.activate)
              break
            }
          }
        }
      }
    },
    activate: () => {
      choice.activate()
    },
    close: () => {
      setOpened(false)
    },
    childList: () => {
      return menu.current?.childList()
    },
    fire: () => {
      fire()
    },
  }

  if (children && onClick) {
    console.warn(`Both onClick and children are truthy`)
    // eslint-disable-next-line no-debugger
    debugger
  }

  useWatch(choice.active && opened, function onMenuOpened(opened) {
    if (opened) {
      setBaseRect(rootEl.current!.getBoundingClientRect())
      children && onOpen?.()
    }
  })

  useOnParentOpen(() => {
    setFlashing(false)
    setOpened(false)
  })

  const kb = useMemo(
    () => keybind ? new KeyBind(KeyTrigger.parse(keybind), () => {
      if (!disabled) {
        if (noDelay) {
          onClick?.()
        }
        else {
          setTimeout(() => onClick?.())
        }
      }
    }) : undefined,
    [keybind, onClick, disabled],
  )
  useKeybind(kb)

  const deactivate = choice.deactivate

  const fire = useCallback(() => {
    if (!children) {
      setFlashing(true)
      if (onClick) {
        if (noDelay) {
          onClick()
        }
        else {
          setTimeout(() => {
            onClick()
          }, fadeSettings.delay)
        }
      }
      menuRootClose()
    }
  }, [onClick, noDelay, menuRootClose])

  return (
    <>
      <div
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') {
            if (!(e.relatedTarget instanceof HTMLElement && menuEl.current?.contains(e.relatedTarget))) {
              deactivate()
            }
          }
        }}
        ref={rootEl}
        onPointerEnter={(e) => {
          if (!disabled) {
            children && setOpened(true)
            choice.activate()
          }
        }}
        onPointerUp={() => {
          if (!disabled) {
            // @ts-ignore
            document.activeElement?.blur && document.activeElement.blur()
            fire()
          }
        }}
        className={classNames(
          styles.body,
          theme.menuItem,
          { [theme.menuItemDisabled]: disabled },
          flashing ? theme.menuItemFlashing : { [theme.menuItemActive]: choice.active }
        )}>
        <div className={styles.bodyLeft} style={{ visibility: checked ? 'visible' : 'hidden' }}>✓&nbsp;</div>
        <div className={styles.bodyMain}>
          {label}
        </div>
        <div className={styles.bodyRight}>
          {kb?.trigger.display()}
          {children && '▸'}
        </div>
      </div>
      {children && (
        <div
          className={classNames({ [styles.hidden]: !(choice.active && opened) })}
        >
          <Menu ref={menu} nodeRef={menuEl} baseRect={baseRect} riftUp={true}>{children}</Menu>
        </div>
      )}
    </>
  )
})


export type MenuItemHandle = {
  opened: boolean
  disabled: boolean
  open: (options?: { activateFirstItem?: boolean }) => void
  close: () => void
  activate: () => void
  childList: () => MenuItemHandle[] | undefined
  hasChild: boolean
  fire: () => void
  menu: RefObject<MenuHandle>
}
