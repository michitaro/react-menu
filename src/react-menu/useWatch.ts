import { useState } from "react"


export function useWatch<T>(value: T, cb: (newValue: T) => void) {
  const [last, setLast] = useState(value)
  if (!Object.is(value, last)) {
    cb(value)
    setLast(value)
  }
}