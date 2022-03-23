import classNames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Navigate, Outlet, Route, Routes, useMatch, useNavigate, useResolvedPath } from "react-router-dom"
import { classNamesFromStyles } from '../react-menu/style'
import { Basic } from './BasicExample'
import { ContextMenuExample } from './ContextMenuExample'
import { Nested } from './NestedMenuExample'
import './style.css'
import { ThemeExample } from './ThemeExample'



function main() {
  ReactDOM.render(
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/basic" replace />} />
            <Route path='/basic' element={<Basic />} />
            <Route path='/nested' element={<Nested />} />
            <Route path='/context' element={<ContextMenuExample />} />
            <Route path='/theme' element={<ThemeExample />} />
          </Route>
        </Routes>
      </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
  )
}


const Layout = function Layout() {
  return (
    <div>
      <Outlet />
      <div className={styles.footer}>
        <ExampleLink
          to="/basic"
          url='https://github.com/michitaro/react-menu/blob/main/src/example/BasicExample.tsx'
        >Basic</ExampleLink>
        <ExampleLink
          to="/nested"
          url="https://github.com/michitaro/react-menu/blob/main/src/example/NestedMenuExample.tsx"
        >Deeply Nested Menu</ExampleLink>
        <ExampleLink
          to="/context"
          url="https://github.com/michitaro/react-menu/blob/main/src/example/ContextMenuExample.tsx"
        >Context Menu</ExampleLink>
        <ExampleLink
          to="/theme"
          url="https://github.com/michitaro/react-menu/blob/main/src/example/ThemeExample.tsx"
        >Theme</ExampleLink>
      </div>
    </div>
  )
}


type ExampleLinkProps = {
  to: string
  url?: string
  children: React.ReactNode
}

const ExampleLink = ({ to, url, children }: ExampleLinkProps) => {
  const navigate = useNavigate()
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <div className={styles.linkGroup}>
      <button className={classNames({ [styles.active]: match })} onClick={() => navigate(to)}>{children}</button>
      {url &&
        <button onClick={() => window.open(url)}>{'<code />'}</button>
      }
    </div>
  )
}


const styles = classNamesFromStyles({
  footer: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '1em',
    background: 'linear-gradient(to bottom, rgb(215, 215, 215), rgb(191, 191, 191))',
    width: '100vw',
    boxShadow: '0 0 8px black',
  },
  linkGroup: {
    margin: '0 0.5em',
  },
  active: {
    color: '#077',
    textDecoration: 'underline',
  },
})


main()
