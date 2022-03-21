import { useState } from "react"
import { builtInThemes, makeTheme, makeThemeStylesFromThemeColors, MenuBar, MenuBarItem, MenuItem, MenuSeparator, ThemeContext } from "../react-menu"

export function ThemeExample() {
  return (
    <>
      <ThemedSet themeName="white" />
      <ThemedSet themeName="black" />
      <ThemedSet themeName="metal" />
      <ThemedSet themeName="water" />
    </>
  )
}


function ThemedSet({ themeName }: { themeName: keyof typeof themes }) {
  return (
    <div>
      <ThemeContext.Provider value={themes[themeName]}>
        <div style={{
          margin: '1em',
          padding: '1em',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.5)',
        }}>
          <ExampleMenuBar />
        </div>
      </ThemeContext.Provider>
    </div>
  )
}


function ExampleMenuBar() {
  const [checked, setChecked] = useState(true)
  return (
    <MenuBar>
      <MenuBarItem label="File">
        <MenuItem label="New" onClick={() => alert('New')} />
        <MenuItem label="Open" onClick={() => alert('Open')} />
        <MenuSeparator />
        <MenuItem label="Save" disabled />
        <MenuItem label="Export">
          <MenuItem label="PDF..." />
          <MenuItem label="PNG..." />
        </MenuItem>
      </MenuBarItem>
      <MenuBarItem label="Edit">
        <MenuItem label="Undo" onClick={() => alert('Undo')} />
        <MenuSeparator />
        <MenuItem label="Cut" disabled />
      </MenuBarItem>
      <MenuBarItem label="Checkmark">
        <MenuItem label="Check" checked={checked} onClick={() => setChecked(true)} disabled={checked} />
        <MenuItem label="Uncheck" checked={!checked} onClick={() => setChecked(false)} disabled={!checked} />
        <MenuSeparator />
        <MenuItem label={checked ? '😁 Checked' : '🙂 Unchecked'} checked={checked} onClick={() => setChecked(_ => !_)} />
      </MenuBarItem>
    </MenuBar>
  )
}


const themes = {
  ...builtInThemes,
  water: makeTheme({
    styles: makeThemeStylesFromThemeColors({
      color: '#ccc',
      background: 'linear-gradient(to bottom, black, #436f7c)',
      activeBackground: '#009999',
      activeColor: 'white',
      fontFamily: 'sans-serif',
      disabledColor: '#599',
      separatorColor: 'rgba(255, 0, 0, 0.25)',
      menuExtra: {
        opacity: 0.95,
      },
    }),
  })
}
