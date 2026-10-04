import { PageFrame, type LayoutProps } from '@/layouts/PageFrame'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { PersonalIntro } from '@/components/PersonalIntro'
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
  return (
    <PageFrame
      {...props}
      intro={
        view && (
          <PersonalIntro
            view={view}
            onSelect={(next) => {
              void navigate(next === 'home' ? '/' : `/${next}`)
            }}
          />
        )
      }
      header={
        view ? null : (
          <>
            <Link
              to="/"
              className="wordmark"
              aria-label="Giulio Ungaretti home"
            >
              gu<span>.</span>
            </Link>
            <nav className="personal-nav" aria-label="Personal site">
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/cv">CV</NavLink>
              <NavLink to="/blog">Blog</NavLink>
            </nav>
          </>
        )
      }
      footer={
        <>
          <span>Giulio Jensen Ungaretti</span>
          <a href="/feed.xml" className="text-link">
            RSS feed
          </a>
        </>
      }
    />
  )
}
