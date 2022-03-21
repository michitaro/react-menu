import React, { RefObject } from "react"
import { MenuHandle } from './Menu'

type useKeyboardNavigationArgs = {
  rootMenu: RefObject<MenuHandle | null>
  opened: boolean
  setOpened: (opened: boolean) => void
  focusOnNextMenu?: () => void
  focusOnPrevMenu?: () => void
}


export function useKeyboardNavigation({
  rootMenu, opened, setOpened,
  focusOnNextMenu, focusOnPrevMenu,
}: useKeyboardNavigationArgs) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    // e.preventDefault()
    if (opened) {
      const [parent, top] = [undefined, ...menuStack(rootMenu.current!)].slice(-2) as [undefined | MenuHandle, MenuHandle]
      const ai = top.activeItem()
      switch (e.key) {
        case 'ArrowDown':
          top.activateNextItem()
          break
        case 'ArrowUp':
          top.activatePrevItem()
          break
        case 'ArrowRight':
          if (top === rootMenu.current!) {
            if (!ai?.childList?.()) {
              focusOnNextMenu?.()
              break
            }
          }
          ai?.open({ activateFirstItem: true })
          break
        case 'ArrowLeft':
          if (top === rootMenu.current!) {
            focusOnPrevMenu?.()
            break
          }
          parent?.activeItem()?.close()
          break
        case ' ':
        case 'Enter':
          if (ai?.hasChild) {
            ai?.open({ activateFirstItem: true })
          } else {
            ai?.fire()
          }
          break
        case 'Escape':
          setOpened(false)
          break
      }
    } else {
      switch (e.key) {
        case ' ':
        case 'Enter':
          setOpened(true)
          break
        case 'ArrowDown':
          setOpened(true)
          requestAnimationFrame(() => {
            rootMenu.current?.activateNextItem()
          })
          break
        case 'ArrowRight':
          focusOnNextMenu?.()
          break
        case 'ArrowLeft':
          focusOnPrevMenu?.()
          break
      }
    }
  }

  return { onKeyDown }
}


function menuStack(menu: MenuHandle) {
  const stack: MenuHandle[] = [menu]
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const next = menu.childList().find(h => h.opened)
    if (next === undefined) {
      return stack
    }
    stack.push(next.menu.current!)
    menu = next.menu.current!
  }
}
