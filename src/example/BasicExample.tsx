import React, { useState } from "react"
import { MenuBar, MenuBarItem, MenuItem, MenuSeparator } from "../react-menu"

export function Basic() {
  const [checked, setChecked] = useState(false)

  return (
    <>
      <MenuBar style={{ borderRadius: '0 0 8px 0' }}>
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
          <MenuItem label="Undo" keybind="meta+KeyZ" onClick={() => alert('Undo')} />
          <MenuSeparator />
          <MenuItem label="Cut" keybind="meta+KeyX" onClick={() => alert('Cut')} />
          <MenuItem label="Copy" keybind="meta+KeyC" onClick={() => alert('Copy')} />
          <MenuItem label="Paste" keybind="meta+KeyV" onClick={() => alert('Paste')} />
        </MenuBarItem>
        <MenuBarItem label="Checkmark">
          <MenuItem label="Check" checked={checked} onClick={() => setChecked(true)} disabled={checked} />
          <MenuItem label="Uncheck" checked={!checked} onClick={() => setChecked(false)} disabled={!checked} />
          <MenuSeparator />
          <MenuItem label={checked ? '😁 Checked' : '🙂 Unchecked'} checked={checked} onClick={() => setChecked(_ => !_)} />
        </MenuBarItem>
      </ MenuBar>
    </>
  )
}