import { useEffect } from "react"

export function useTimer() {
  const cleanups: (() => void)[] = []

  useEffect(function callCleanups() {
    return () => {
      while (cleanups.length) {
        cleanups.pop()!()
      }
    }
  }, [])

  return (cb: () => void, timeout: number = 0) => {
    cleanups.push(timeout === 0 ? nextTick(cb) : timer(cb, timeout))
  }
}


function nextTick(cb: () => void) {
  let rafHandle: undefined | ReturnType<typeof requestAnimationFrame> = requestAnimationFrame(() => {
    rafHandle = undefined
    cb()
  })
  const cleanup = () => {
    if (rafHandle) {
      cancelAnimationFrame(rafHandle)
    }
  }
  return cleanup
}


function timer(cb: () => void, timeout: number) {
  let timerHandle: undefined | ReturnType<typeof setTimeout> = setTimeout(() => {
    timerHandle = undefined
    cb()
  }, timeout)
  const cleanup = () => {
    if (timerHandle) {
      clearTimeout(timerHandle)
    }
  }
  return cleanup
}
