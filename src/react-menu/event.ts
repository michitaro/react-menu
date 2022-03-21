import { PointerEvent, MouseEvent } from "react"

const isClickDefaultOptions = {
  maxMove: 4, //pixel
  maxDuration: 400 //ms
}

export function isClick(
  e1: PointerEvent | MouseEvent,
  e2: PointerEvent | MouseEvent,
  options: Partial<typeof isClickDefaultOptions> = {},
) {
  const { maxDuration, maxMove } = Object.assign(options, isClickDefaultOptions)
  return (
    Math.abs(e1.screenX - e2.screenX) < maxMove &&
    Math.abs(e1.screenY - e2.screenY) < maxMove &&
    (e2.timeStamp - e1.timeStamp) < maxDuration
  )
}


type EvnetTarget = {
  addEventListener: (...args: unknown[]) => unknown
}

export function on<Target extends EventTarget>(
  target: Target,
  type: Parameters<Target["addEventListener"]>[0],
  callback: Parameters<Target["addEventListener"]>[1],
  options?: Parameters<Target["addEventListener"]>[2],
) {
  target.addEventListener(type, callback, options)
  return () => {
    target.removeEventListener(type, callback, options)
  }
}
