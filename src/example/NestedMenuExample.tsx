import { useMemo } from "react"
import { MenuBar, MenuBarItem, MenuItem } from "../react-menu"
import fileList from './filelist.txt?raw'


export function Nested() {
  const root = useMemo(() => tree('root'), [])

  return (
    <MenuBar style={{ borderRadius: '0 0 8px 0' }}>
      <MenuBarItem label="File">
        <MenuItem disabled label="Open `Directory`→" />
      </MenuBarItem>
      <MenuBarItem label="Directory">
        <DirEntryMenuItem entry={root} />
      </MenuBarItem>
    </MenuBar>
  )
}


function DirEntryMenuItem({ entry }: { entry: DirEntry }) {
  return (
    <MenuItem
      label={entry.label}
    >
      {
        Object.keys(entry.children).length > 0 &&
        Object.entries(entry.children).map(([name, child]) => (
          <DirEntryMenuItem key={name} entry={child} />
        ))
      }
    </MenuItem>
  )
}


class DirEntry {
  constructor(readonly label: string) { }
  readonly children: { [label: string]: DirEntry } = {}
}


function tree(rootName: string) {
  const root = new DirEntry(rootName)
  const paths = fileList.split('\n').filter(path => path.length > 0)

  for (const path of paths) {
    const route = path.split('/').slice(1)
    let entry = root
    for (const name of route) {
      if (entry.children[name])
        entry = entry.children[name]!
      else
        entry = entry.children[name] = new DirEntry(name)
    }
  }

  return root
}
