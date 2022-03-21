import { memo, useContext } from "react"
import { ThemeContext } from './theme'


/**
 * MenuSeparator is a separator of menu items.
 */
export const MenuSeparator = memo(function MenuSeparator() {
  const theme = useContext(ThemeContext)
  return (
    <div className={theme.separator}></div>
  )
})
