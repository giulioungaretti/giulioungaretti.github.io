import type { ReactNode, Ref } from 'react'
import { Outlet } from 'react-router-dom'

export interface LayoutProps {
  mainRef: Ref<HTMLElement>
}

export function PageFrame({
  mainRef,
  header,
  footer,
  intro,
}: LayoutProps & { header?: ReactNode; footer: ReactNode; intro?: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="shell">
        {header && <header className="topbar">{header}</header>}
        <main id="main" className="page" ref={mainRef} tabIndex={-1}>
          {intro}
          <Outlet />
        </main>
        <footer className="footer">{footer}</footer>
      </div>
    </>
  )
}
