import { ArrowDownToLine, ArrowRight } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/system'
import { NavigationDial } from '@/components/NavigationDial'
import type { NavigationPage } from '@/lib/navigation-dial'
import { cvSummary } from '@/data/cv'
import { site } from '@/site'

export function PersonalIntro({
  view,
  onSelect,
}: {
  view: NavigationPage
  onSelect: (view: NavigationPage) => void
}) {
  return (
    <Panel
      className="personal-fascia identity-plate"
      aria-labelledby="personal-title"
    >
      <div className="fascia-header">
        <Link
          to="/"
          className="fascia-brand"
          aria-label="Giulio Ungaretti home"
        >
          <span className="fascia-monogram">gu.</span>
          <span className="fascia-light" aria-hidden="true" />
        </Link>
        <nav className="fascia-nav" aria-label="Personal site">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/cv">CV</NavLink>
          <NavLink to="/blog">Blog</NavLink>
        </nav>
      </div>
      <div className="fascia-copy">
        <h1 id="personal-title">
          {view === 'home'
            ? site.author
            : view === 'cv'
              ? 'Curriculum vitae'
              : 'Writing'}
        </h1>
        <p className="fascia-role">
          {view === 'home' ? 'Software & AI engineering leader' : site.author}
        </p>
        <p className="fascia-intro">
          {view === 'blog' ? `${site.description}.` : cvSummary}
        </p>
      </div>
      <div className="fascia-controls">
        <div className="fascia-actions">
          {view === 'cv' ? (
            <Button asChild variant="outline">
              <a
                href="/giulio-jensen-ungaretti-cv.pdf"
                download
                aria-label="Download CV (PDF)"
              >
                <ArrowDownToLine aria-hidden="true" />
                Download CV
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/cv">
                Read my CV
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
          {view !== 'blog' && (
            <Button asChild variant="outline">
              <Link to="/blog">
                Writing
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
        <div className="fascia-material">
          <p className="fascia-caption">
            People. Software.
            <br />
            Scientific curiosity.
          </p>
          <NavigationDial value={view} onValueChange={onSelect} />
        </div>
      </div>
    </Panel>
  )
}
