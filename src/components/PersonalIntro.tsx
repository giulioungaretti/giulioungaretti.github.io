import { ArrowDownToLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PersonalView } from '@/components/PersonalPageSwitch'
import { cvSummary } from '@/data/cv'
import { site } from '@/site'

export function PersonalIntro({ view }: { view: PersonalView }) {
  return (
    <div className="personal-intro">
      <p>{view === 'cv' ? cvSummary : `${site.description}.`}</p>
      {view === 'cv' && (
        <Button asChild variant="outline" className="personal-download">
          <a href="/giulio-jensen-ungaretti-cv.pdf" download>
            <ArrowDownToLine aria-hidden="true" />
            Download CV (PDF)
          </a>
        </Button>
      )}
    </div>
  )
}
