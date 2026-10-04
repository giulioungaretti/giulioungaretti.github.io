import { ArrowDownToLine } from 'lucide-react'
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
        <div className="fascia-brand">
          <span className="fascia-monogram">gu.</span>
          <span className="fascia-light" aria-hidden="true" />
        </div>
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
        {view === 'cv' && (
          <div className="fascia-actions">
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
          </div>
        )}
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
