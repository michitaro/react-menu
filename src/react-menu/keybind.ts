import { useEffect } from "react"


export type Modifiers = {
  shift: boolean
  ctrl: boolean
  alt: boolean
  meta: boolean
}


export class KeyTrigger {
  constructor(
    readonly code: string,
    readonly modifiers: Partial<Modifiers> = {},
  ) {
  }

  match(e: KeyboardEvent) {
    return (
      e.code === this.code &&
      e.shiftKey === !!this.modifiers.shift &&
      e.ctrlKey === !!this.modifiers.ctrl &&
      e.altKey === !!this.modifiers.alt &&
      e.metaKey === !!this.modifiers.meta
    )
  }

  display() {
    // @ts-ignore
    const mods = Object.keys(this.modifiers).filter(k => this.modifiers[k])
    const mainKey = this.code.replace(/^(?:Key|Digit|Numpad)/, "")
    return mods.length > 0 ?
      // @ts-ignore
      `${mods.map(m => (modifierMarks[m] || m)).join("")}${mainKey}` :
      mainKey
  }

  /**
   * Returns a KeyTrigger from a string.
   * string format:
   *   modifier1+code
   *   modifier1+...+modifierN+code
   * examples:
   *   "meta+shift+KeyA"
   */
  static parse(source: string) {
    // Shfit+Ctrl+Alt+Meta+Space -> new KeyTrigger("Space", {shift: true, ctrl: true, alt: true, meta: true})
    // Meta+Digit1 -> new KeyTrigger("Digit1", { meta: true })
    const parts = source.split("+")
    const modifiers: Partial<Modifiers> = {}
    const code = parts.pop()!
    for (const part of parts) {
      if (part in modifierMarks) {
        // @ts-ignore
        modifiers[part] = true
      } else {
        throw new Error(`Invalid modifier: ${part}`)
      }
    }
    return new KeyTrigger(code, modifiers)
  }
}


export class KeyBind {
  constructor(
    readonly trigger: KeyTrigger,
    readonly cb: () => void,
  ) {
  }
}


const kbs = new Set<KeyBind>()

function register(kb: KeyBind) {
  if (kbs.size === 0) {
    document.addEventListener('keydown', keydown)
  }
  kbs.add(kb)
}

function unregister(kb: KeyBind) {
  kbs.delete(kb)
  if (kbs.size === 0) {
    document.removeEventListener('keydown', keydown)
  }
}

function keydown(e: KeyboardEvent) {
  if (e.target === document.body) {
    kbs.forEach((kb) => {
      if (kb.trigger.match(e)) {
        kb.cb()
        e.preventDefault()
      }
    })
  }
}

export function useKeybind(kb?: KeyBind) {
  useEffect(() => {
    if (kb) {
      register(kb)
      return () => {
        unregister(kb)
      }
    }
  }, [kb])
}

const modifierMarks = {
  shift: "⇧",
  ctrl: "⌃",
  alt: "⌥",
  meta: "⌘",
}
