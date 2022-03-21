import { classNamesFromStyles } from "../react-menu/style"
import { ContextMenu, HeadlessMenu } from '../react-menu/HeadlessMenu'
import { MenuItem } from "../react-menu"


export function ContextMenuExample() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ margin: '2em' }}>
          <ContextMenu trigger={<div className={styles.box}>Right Click Here</div>}>
            <MenuItem label="Context Menu Item1" />
            <MenuItem label="Context Menu Item2" />
          </ContextMenu>
        </div>
        <div style={{ margin: '2em' }}>
          <ContextMenu
            trigger={
              <div className={styles.box}>
                Right Click Here
                <ContextMenu trigger={
                  <div style={{ margin: '1em' }} className={styles.box}>Right Click Here</div>
                }>
                  <MenuItem label="Innner Context Menu" />
                </ContextMenu>
              </div>
            }
          >
            <MenuItem label="Outer Context Menu" />
          </ContextMenu>
        </div>
        <div style={{ margin: '2em' }}>
          <HeadlessMenu
            trigger={<button>Pulldown Here</button>}
          >
            <MenuItem label="Pulldown Item1" />
            <MenuItem label="Pulldown Item2" />
          </HeadlessMenu>
        </div>
      </div>
    </>
  )
}


const styles = classNamesFromStyles({
  box: {
    borderRadius: '12px',
    padding: '0.5em 1em',
    boxShadow: '0 0 8px black',
    backgroundColor: 'lightgray',
    cursor: 'context-menu',
    userSelect: 'none',
  }
})