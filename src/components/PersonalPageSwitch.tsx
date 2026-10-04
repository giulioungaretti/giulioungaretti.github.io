import { useId } from 'react'
import { Button } from '@/components/ui/button'

export type PersonalView = 'cv' | 'blog'

export function PersonalPageSwitch({
  value,
  onValueChange,
}: {
  value: PersonalView
  onValueChange: (value: PersonalView) => void
}) {
  const id = useId()
  return (
    <fieldset className="personal-page-switch">
      <legend className="sr-only">Choose CV or Blog</legend>
      {(['cv', 'blog'] as const).map((view) => (
        <Button
          key={view}
          asChild
          variant="outline"
          className="personal-switch-key"
        >
          <label>
            <input
              className="sr-only"
              type="radio"
              name={`personal-page-${id}`}
              value={view}
              aria-label={view === 'cv' ? 'CV' : 'Blog'}
              checked={value === view}
              onChange={() => onValueChange(view)}
            />
            {view === 'cv' ? 'CV' : 'Blog'}
          </label>
        </Button>
      ))}
    </fieldset>
  )
}
