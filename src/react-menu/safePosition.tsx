import { CSSProperties } from "react"
import { Rect } from './Rect'
import { Direction } from './Menu'

export function safePosition(el: HTMLElement, baseRect: Rect, direction: Direction, contentsTop?: HTMLElement) {
  const { width, height, top: wrapperTop } = el.getBoundingClientRect()

  let style: CSSProperties = {}
  let hFlip = false

  if (baseRect.top + height > window.innerHeight) {
    style = { ...style, top: Math.max(0, window.innerHeight - height) }
  } else {
    if (contentsTop) {
      const paddingTop = contentsTop.getBoundingClientRect().top - wrapperTop
      style = { ...style, top: `${Math.max(0, baseRect.top - paddingTop)}px` }
    }
    else {
      style = { ...style, top: `${baseRect.top}px` }
    }
  }

  const m0 = baseRect.left + baseRect.width / 2
  const shift = ((baseRect.width + width) / 2 + (baseRect.height === 0 ? -baseRect.width : 0))
  let m1 = m0 + direction * shift
  let left = m1 - width / 2

  // if the menu is not in the viewport, flip it.
  if (m1 + width / 2 > window.innerWidth || m1 - width / 2 < 0) {
    m1 = m0 - direction * shift
    left = Math.min(Math.max(0, m1 - width / 2), window.innerWidth - width)
    hFlip = true
  }

  style = { ...style, left: `${left}px` }

  return {
    style, hFlip,
  }
}
