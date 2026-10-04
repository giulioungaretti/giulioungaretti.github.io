import { ArrowRight, CircleCheck, Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Panel, PageHeading, Status } from '@/components/system'

export function Login({ onEnter }: { onEnter: () => void }) {
  const navigate = useNavigate()
  function enterDemo() {
    onEnter()
    void navigate('/admin')
  }
  return (
    <div className="login-layout">
      <PageHeading title="A small home, for software.">
        An imaginary home-server control panel. Step inside and explore a few
        personal apps.
      </PageHeading>
      <Panel className="login-panel" aria-labelledby="demo-entry-heading">
        <div className="login-mechanism">
          <Power size={28} strokeWidth={1.5} aria-hidden="true" />
          <Status tone="on">Demo mode</Status>
        </div>
        <h2 id="demo-entry-heading" className="section-heading">
          Demo admin login
        </h2>
        <p className="login-description mt-4">
          No account. No password. No real authentication. This is a UI
          demonstration, not access to a live server.
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={enterDemo}
        >
          Enter demo admin
          <ArrowRight aria-hidden="true" />
        </Button>
        <ul className="login-list">
          <li>
            <CircleCheck aria-hidden="true" />
            Illustrative apps and service states
          </li>
          <li>
            <CircleCheck aria-hidden="true" />
            Local-only controls, with no server calls
          </li>
          <li>
            <CircleCheck aria-hidden="true" />A fresh demo each time you reload
          </li>
        </ul>
        <p className="helper">
          Do not enter any credentials. Nothing here deploys, connects to, or
          changes real infrastructure.
        </p>
      </Panel>
    </div>
  )
}
