import React, { memo, MouseEvent, PointerEvent, ReactNode, useCallback, useRef, useState } from "react"
import { MenuRoot } from "./MenuRoot"
import { Pulldown, PulldownHandle } from "./Pulldown"
import { classNamesFromStyles } from './style'
import { Rect } from "./Rect"
import { useKeyboardNavigation } from "./useKeyboardNavigation"
import { MenuHandle } from "./Menu"

export type Position = 'cursor' | 'bottom'

export type HeadlessMenuProps = {
  /** Trigger of the menu */
  trigger: string | ReactNode
  /** If true, the menu will be opened when the  */
  activateOnContextmenu?: boolean
  /** Position for the child menu */
  position?: Position
  /** Child menu items */
  children: ReactNode
}


/**
 * HeadlessMenu is an arbitrary menu that can be opened by a trigger.
 */
export const HeadlessMenu = memo(function MenuButton(
  {
    trigger,
    children,
    activateOnContextmenu,
    position = 'bottom',
  }: HeadlessMenuProps
) {
  const [active, setActive] = useState(false)
  const elRef = useRef<HTMLDivElement>(null)
  const [baseRect, setBaseRect] = useState<Rect>()

  const onActivate = useCallback((e: PointerEvent | MouseEvent) => {
    setBaseRect((() => {
      switch (position) {
        case 'cursor':
          return {
            left: e.clientX,
            top: e.clientY,
            width: 0,
            height: 0,
          }
        case 'bottom':
          {
            const { left, bottom, width } = elRef.current!.getBoundingClientRect()
            return {
              left,
              top: bottom,
              width,
              height: 0,
            }
          }
      }
    })())
    setActive(true)
  }, [])

  const pulldown = useRef<PulldownHandle>(null)

  const onDeactivate = useCallback(() => {
    setActive(false)
    pulldown.current?.deactivateWithoutCallback() // for onCloseRequest in MenuRoot
  }, [])

  const menu = useRef<MenuHandle>(null)

  const setOpenedByKeyboardNavigation = (opened: boolean) => {
    if (opened) {
      const { left, bottom, width } = elRef.current!.getBoundingClientRect()
      setBaseRect({
        left,
        top: bottom,
        width,
        height: 0,
      })
    }
    setActive(opened)
  }

  const { onKeyDown } = useKeyboardNavigation({ rootMenu: menu, opened: active, setOpened: setOpenedByKeyboardNavigation })

  return (
    <Pulldown
      activateOnContextmenu={activateOnContextmenu}
      onActivate={onActivate}
      onDeactivate={onDeactivate}
      ref={pulldown}
    >
      <div
        ref={elRef}
        className={styles.inlineBlock}
        tabIndex={0}
        onKeyDown={onKeyDown}
        // onBlur={() => setActive(false)}
      >
        {trigger}
      </div>
      <MenuRoot
        ref={menu}
        menuContents={children}
        active={active}
        fadeOnExit={true}
        baseRect={baseRect}
        onCloseRequest={onDeactivate}
      />
    </Pulldown>
  )
})


export type ContextMenuProps = {
  /** Trigger of the menu */
  trigger: string | ReactNode
  /** Child menu items */
  children: ReactNode,
}

/**
 * ContextMenu is a menu that is opened by right-clicking on a trigger.
 */
export const ContextMenu = memo(function ContextMenu({
  children,
  trigger,
}: ContextMenuProps) {
  return <HeadlessMenu
    trigger={trigger}
    activateOnContextmenu={true}
    position='cursor'
  >{children}</HeadlessMenu>
})


const styles = classNamesFromStyles({
  inlineBlock: {
    display: 'inline-block',
  }
})
