import classNames from 'classnames'
import React, { createContext, CSSProperties, forwardRef, MutableRefObject, ReactNode, useContext, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ChoiceList, ChoiceListHandle } from './ChoiceList'
import { MenuItemHandle } from './MenuItem'
import { Rect } from './Rect'
import { safePosition } from './safePosition'
import { classNamesFromStyles } from './style'
import { ThemeContext } from './theme'
import { useWatch } from './useWatch'

export type Direction = number // 1 = right, -1 = left

type MenuProps = {
  children: ReactNode
  baseRect?: Rect
  riftUp?: boolean
  nodeRef?: MutableRefObject<HTMLDivElement | null>,
}

const MenuContext = createContext<{
  direction: Direction
  resize: () => void
  baseRect?: Rect
}>({
  direction: 1,
  resize: () => { },
})

export function useResizeMenu() {
  const { resize } = useContext(MenuContext)
  return resize
}

export function useOnParentOpen(onOpen: () => void) {
  const context = useContext(MenuContext)
  useWatch(context.baseRect, onOpen)
}

export type MenuHandle = {
  childList: () => MenuItemHandle[],
  activeItem: () => MenuItemHandle | undefined,
  activateNextItem: () => void
  activatePrevItem: () => void
}

const _Menu = forwardRef<MenuHandle, MenuProps>(function Menu(
  {
    children,
    baseRect,
    nodeRef,
    riftUp = false,
  }: MenuProps,
  ref,
) {
  const el = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({})
  const parentContext = useContext(MenuContext)
  const [childDirection, setChildDirection] = useState(parentContext.direction)
  const choiceList = useRef<ChoiceListHandle<MenuItemHandle>>(null)

  useImperativeHandle(ref, () => {
    const activeIndex = () => choiceList.current!.activeIndex()
    const list = () => choiceList.current!.list()

    const moveActive = (direction: number,) => {
      const l = list()
      const ai = activeIndex()
      const i0 = Math.max(-1, Math.min(l.length,
        ai === undefined ? (direction > 0 ? -1 : l.length) : ai
      ))
      for (
        let i = i0 + direction;
        0 <= i && i < l.length;
        i += direction
      ) {
        const { disabled } = l[i]
        if (!disabled) {
          choiceList.current!.setActiveIndex(i)
          return
        }
      }
    }

    return {
      childList: () => list(),
      activateNextItem: () => moveActive(+1),
      activatePrevItem: () => moveActive(-1),
      activeItem: () => {
        const ai = activeIndex()
        return ai === undefined ? undefined : list()[ai]
      },
    }
  })

  const resize = () => {
    if (baseRect) {
      if (nodeRef) {
        nodeRef.current = el.current
      }
      choiceList.current?.clear()
      const { style, hFlip } = safePosition(el.current!, baseRect, parentContext.direction, riftUp ? contentsTop.current! : undefined)
      setChildDirection((hFlip ? -1 : 1) * parentContext.direction)
      setStyle(style)
    }
  }

  const context = useMemo(() => ({
    direction: childDirection,
    baseRect, // will be used to detect when the menu is opened.
    resize,
  }), [childDirection, baseRect])

  const theme = useContext(ThemeContext)

  useLayoutEffect(resize, [baseRect])

  const contentsTop = useRef<HTMLDivElement>(null)

  return (
    <ChoiceList ref={choiceList}>
      <MenuContext.Provider value={context}>
        <div
          ref={el}
          className={classNames(styles.root, theme.menu)}
          style={style}
          onPointerUp={e => e.stopPropagation()}
        >
          <div ref={contentsTop} />
          {children && children}
        </div>
      </MenuContext.Provider>
    </ChoiceList>
  )
})


export const Menu = React.memo(_Menu)


const styles = classNamesFromStyles({
  root: {
    position: 'fixed',
    cursor: 'default',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    maxHeight: '100vh',
    maxWidth: '100vw',
    overflowX: 'auto',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
})
