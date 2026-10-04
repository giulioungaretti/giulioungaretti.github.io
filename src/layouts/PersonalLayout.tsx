import { PageFrame, type LayoutProps } from '@/layouts/PageFrame'
import { useLocation, useNavigate } from 'react-router-dom'
import { PersonalIntro } from '@/components/PersonalIntro'
import { NavigationDial } from '@/components/NavigationDial'
import type { NavigationPage } from '@/lib/navigation-dial'
import { normalizePath } from '@/lib/blog'

export function PersonalLayout(props: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const path = normalizePath(location.pathname)
  const view: NavigationPage | undefined =
    path === '/'
      ? 'home'
      : path === '/cv'
        ? 'cv'
        : path === '/blog'
          ? 'blog'
          : undefined
  function select(next: NavigationPage) {
    void navigate(next === 'home' ? '/' : `/${next}`)
  }
  return (
    <PageFrame
      {...props}
      intro={view && <PersonalIntro view={view} onSelect={select} />}
      header={
        view ? null : (
          <>
            <span className="wordmark">
              gu<span>.</span>
            </span>
            <NavigationDial
              value={
                path.startsWith('/blog') || /^\/\d{4}\/\d{2}\//.test(path)
                  ? 'blog'
                  : 'home'
              }
              onValueChange={select}
            />
          </>
        )
      }
      footer={
        <>
          <span>Giulio Jensen Ungaretti</span>
          <a href="/feed.xml" className="text-link">
            RSS feed
          </a>
          <noscript>
            <nav
              className="dial-fallback"
              aria-label="Personal site without JavaScript"
            >
              <a href="/">Home</a>
              <a href="/cv/">CV</a>
              <a href="/blog/">Blog</a>
            </nav>
          </noscript>
        </>
      }
    />
  )
}
