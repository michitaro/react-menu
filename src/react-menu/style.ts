import { css, StyleDeclaration, StyleSheet } from "aphrodite/no-important"


export function classNamesFromStyles<T>(styles: StyleDeclaration<T>): { [K in keyof T]: string } {
  const compiled = StyleSheet.create(styles)
  // @ts-ignore
  return Object.fromEntries(Object.entries(compiled).map(([k, v]) => [k, css(v)]))
}
