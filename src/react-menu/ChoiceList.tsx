import React, { ContextType, createContext, forwardRef, ReactNode, RefObject, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useTimer } from "./useTimer"


type ID = number


type ChoiceListProps = {
  children: ReactNode
}

export type ChoiceListHandle<T = unknown> = {
  clear: () => void
  list: () => T[]
  activeIndex: () => number | undefined
  setActiveIndex: (index: number | undefined) => void
}

const ChoiceListContext = createContext({
  register: (id: ID, handle?: RefObject<unknown>) => { },
  unregister: (id: ID) => { },
  activeId: undefined as ID | undefined,
  setActiveID: (id: undefined | ID) => { },
})

type Version = number

const _ChoiceList = forwardRef<ChoiceListHandle, ChoiceListProps>(function ChoiceList(
  { children }: { children: ReactNode },
  ref,
) {
  const [version, setVersion] = useState<Version>(0)
  const list = useRef<[ID, Version, RefObject<unknown> | undefined][]>([])
  const [activeId, setActiveID] = useState<ID | undefined>(undefined)

  const context: ContextType<typeof ChoiceListContext> = useMemo(() => ({
    register: (id: ID, handle?: RefObject<unknown>) => {
      list.current.push([id, version, handle])
    },
    unregister: (id: ID) => {
      const index = list.current.findIndex(item => item[0] === id)
      if (index >= 0) {
        list.current.splice(index, 1)
      }
    },
    activeId,
    setActiveID,
  }), [activeId, version])

  useImperativeHandle(ref, () => ({
    clear: () => {
      setActiveID(undefined)
    },
    list: () => {
      return list.current.map(item => item[2]?.current)
    },
    activeIndex: () => {
      if (activeId !== undefined) {
        return list.current.findIndex(item => item[0] === activeId)
      }
    },
    setActiveIndex: (index: number | undefined) => {
      if (index !== undefined) {
        const item = list.current[index]
        if (item) {
          setActiveID(item[0])
        }
      }
      else {
        setActiveID(undefined)
      }
    }
  }), [activeId])

  useEffect(function checkVersionConsistency() {
    // all versions in list must be equal to version
    // if not, setVersion to the next version
    const versions = list.current.map(item => item[1])
    if (versions.some(v => v !== version)) {
      setVersion(version + 1) // this causes re-render of all child choices
    }
  })

  return (
    <ChoiceListContext.Provider value={context}>
      {children}
    </ChoiceListContext.Provider>
  )
})


export const ChoiceList = React.memo(_ChoiceList)


export function useChoice(handle?: RefObject<unknown>) {
  const [id,] = useState(seq())
  const list = useContext(ChoiceListContext)

  useEffect(() => {
    list.register(id, handle)
    return () => {
      list.unregister(id)
    }
  }, [handle])

  const timer = useTimer()

  const active = id === list.activeId

  const activate = useCallback((delay = false) => {
    if (delay) {
      timer(() => list.setActiveID(id))
    }
    else {
      list.setActiveID(id)
    }
  }, [])

  const deactivate = useCallback(() => {
    list.setActiveID(undefined)
  }, [])

  return { active, activate, deactivate }
}


const seq: () => ID = (() => {
  let i = 0
  return () => ++i
})()
