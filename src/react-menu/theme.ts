import { CSSProperties, StyleDeclarationMap } from 'aphrodite/no-important'
import { createContext } from "react"
import { classNamesFromStyles } from './style'

export type StyleValue = CSSProperties | StyleDeclarationMap

export type ThemeStyles = {
  menuBar: StyleValue
  menuBarItem: StyleValue
  menuBarItemActive: StyleValue
  menu: StyleValue
  menuItem: StyleValue
  menuItemActive: StyleValue
  menuItemDisabled: StyleValue
  menuItemFlashing: StyleValue
  separator: StyleValue
}

export const builtInThemes = {
  white: makeTheme({
    styles: makeThemeStylesFromThemeColors({
      color: 'black',
      background: 'rgba(255, 255, 255, 0.95)',
      activeBackground: 'rgba(127, 127, 127, 0.5)',
      activeColor: 'white',
      disabledColor: '#777',
      separatorColor: '#ddd',
      fontFamily: 'sans-serif',
    }),
  }),
  metal: makeTheme({
    styles: makeThemeStylesFromThemeColors({
      color: 'black',
      background: 'linear-gradient(to bottom, rgb(215, 215, 215), rgb(191, 191, 191))',
      activeBackground: '#999',
      activeColor: '#ddd',
      disabledColor: '#777',
      separatorColor: '#aaa',
      fontFamily: 'sans-serif',
    }),
  }),
  black: makeTheme({
    styles: makeThemeStylesFromThemeColors({
      color: '#ccc',
      background: 'rgba(31, 31, 31, 0.95)',
      activeBackground: 'rgba(127, 127, 127, 0.5)',
      activeColor: 'white',
      disabledColor: '#555',
      separatorColor: '#555',
      fontFamily: 'sans-serif',
      menuExtra: {
        boxShadow: '0 0 8px rgba(191, 191, 191, 0.25)',
        // backdropFilter: 'blur(4px)',
        // https://stackoverflow.com/questions/52937708/why-does-applying-a-css-filter-on-the-parent-break-the-child-positioning
      },
      mneuBarExtra: {
        boxShadow: '0 0 8px rgba(191, 191, 191, 0.25)',
      }
    }),
  }),
}

export function makeTheme({ styles }: { styles: ThemeStyles }) {
  return classNamesFromStyles(styles)
}

export type Theme = ReturnType<typeof makeTheme>


export type ThemeColors = {
  color: CSSProperties["color"],
  background: CSSProperties["background"],
  activeBackground: CSSProperties["background"],
  activeColor: CSSProperties["color"],
  disabledColor: CSSProperties["color"],
  fontFamily: CSSProperties["fontFamily"],
  separatorColor: CSSProperties["backgroundColor"],
  menuExtra?: CSSProperties,
  mneuBarExtra?: CSSProperties,
}

export function makeThemeStylesFromThemeColors({
  color,
  background,
  activeBackground,
  activeColor,
  fontFamily,
  disabledColor,
  separatorColor,
  menuExtra = {},
  mneuBarExtra = {},
}: ThemeColors): ThemeStyles {
  return {
    menuBar: {
      color,
      background,
      boxShadow: '0 0 12px rgba(0, 0, 0, 0.75)',
      padding: '0 8px',
      fontFamily,
      borderRadius: '4px',
      overflowX: 'auto',
      ...mneuBarExtra,
    },
    menuBarItem: {
      padding: '8px 8px 6px 8px',
      // borderRadius: '4px',
      ':hover': {
        background: activeBackground,
        color: activeColor,
      },
      outlineStyle: 'none',
      ':focus': {
        // background: activeBackground,
        // color: activeColor,
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.25) inset',
      },
    },
    menuBarItemActive: {
      background: activeBackground,
      color: activeColor,
    },
    menu: {
      fontFamily,
      color,
      background,
      boxShadow: '0 0 12px rgba(0, 0, 0, 0.75)',
      borderRadius: '4px',
      padding: '4px 0',
      ...menuExtra,
    },
    menuItem: {
      padding: '2px 12px 2px 8px',
    },
    menuItemActive: {
      background: activeBackground,
      color: activeColor,
    },
    menuItemDisabled: {
      color: disabledColor,
    },
    menuItemFlashing: {
      animationName: [{
        '50%': {
          background,
          color,
        },
        '100%': {
          background: activeBackground,
          color: activeColor,
        },
      }],
      animationDuration: '0.1s',
      animationIterationCount: 3,
      animationTimingFunction: 'steps(1, start)',
      animationFillMode: 'forwards',
    },
    separator: {
      height: '2px',
      backgroundColor: separatorColor,
      margin: '4px 0',
    }
  }
}

export const fadeSettings = {
  delay: 400,
  duration: 200,
}

export const ThemeContext = createContext<Theme>(builtInThemes.white)
// export const ThemeContext = createContext<Theme>(builtInThemes.black)
