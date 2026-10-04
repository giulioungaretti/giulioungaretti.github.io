import type { LayoutProps } from '@/layouts/PageFrame'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PersonalIntro } from '@/components/PersonalIntro'
import {
  PersonalPageSwitch,
  type PersonalView,
} from '@/components/PersonalPageSwitch'
import { normalizePath } from '@/lib/blog'
import { site } from '@/site'

export function PersonalLayout({ mainRef }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const path = normalizePath(location.pathname)
  const view: PersonalView =
    path.startsWith('/blog') || /^\/\d{4}\/\d{2}\//.test(path) ? 'blog' : 'cv'
  const introduction = path === '/' || path === '/cv' || path === '/blog'
  const Name = introduction ? 'h1' : 'p'
  function select(next: PersonalView) {
    void navigate(next === 'cv' ? '/' : '/blog')
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="personal-layout">
        <div className="personal-cassette">
          <header className="personal-sleeve">
            <div className="personal-identity">
              <span className="personal-monogram" aria-hidden="true">
                gu<span>.</span>
              </span>
              <Name className="personal-name">{site.author}</Name>
            </div>
            <PersonalPageSwitch value={view} onValueChange={select} />
          </header>
          <main
            id="main"
            className="personal-sheet"
            ref={mainRef}
            tabIndex={-1}
          >
            {introduction && <PersonalIntro view={view} />}
            <Outlet />
            <footer className="personal-footer">
              <span>{site.author}</span>
              {view === 'blog' && <a href="/feed.xml">RSS feed</a>}
              <noscript>
                <nav
                  className="personal-fallback"
                  aria-label="Personal site without JavaScript"
                >
                  <a href="/">CV</a>
                  <a href="/blog/">Blog</a>
                </nav>
              </noscript>
            </footer>
          </main>
        </div>
      </div>
    </>
  )
}
