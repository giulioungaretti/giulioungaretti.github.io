import { useId, useState } from 'react'
import { ArrowRight, Info, LogOut, RotateCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconButton, Panel, PageHeading, Status } from '@/components/system'
import {
  filterServices,
  initialServices,
  isServiceFilter,
  type ServiceFilter,
  type ServiceId,
} from '@/data/services'

export function Admin({ onExit }: { onExit: () => void }) {
  const [services, setServices] = useState(() =>
    initialServices.map((service) => ({ ...service })),
  )
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ServiceFilter>('all')
  const [selectedId, setSelectedId] = useState<ServiceId>('leggmini')
  const [announcement, setAnnouncement] = useState('')
  const searchId = useId()
  const selected = services.find((service) => service.id === selectedId)
  const visible = filterServices(services, query, filter)
  const running = services.filter((service) => service.enabled).length

  function toggleService(id: ServiceId, enabled: boolean) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id ? { ...service, enabled } : service,
      ),
    )
    setAnnouncement(
      `${id} ${enabled ? 'running' : 'paused'} in this demo. No server was changed.`,
    )
  }
  function reset() {
    setServices(initialServices.map((service) => ({ ...service })))
    setQuery('')
    setFilter('all')
    setSelectedId('leggmini')
    setAnnouncement('Demo reset to its initial state.')
  }
  return (
    <>
      <div className="dashboard-heading page-heading">
        <PageHeading title="Home server">
          A few small apps. One simple control panel.
        </PageHeading>
        <div className="specimen">
          <IconButton label="Reset demo" onClick={reset}>
            <RotateCcw aria-hidden="true" />
          </IconButton>
          <Button variant="outline" onClick={onExit}>
            <LogOut aria-hidden="true" />
            Exit demo
          </Button>
        </div>
      </div>
      <div className="notice">
        <Info aria-hidden="true" />
        <p>
          <strong>Illustrative demo.</strong> All app names and states below are
          fictional. Controls only update this page; there is no authentication,
          live telemetry, or server connection.
        </p>
      </div>
      <div className="console">
        <Panel aria-label="Illustrative services">
          <div className="panel-heading">
            <h2 className="section-heading">Applications</h2>
            <span className="source-note">
              {running} of {services.length} running in demo
            </span>
          </div>
          <Tabs
            value={filter}
            onValueChange={(value) => {
              if (isServiceFilter(value)) setFilter(value)
            }}
          >
            <div className="service-toolbar">
              <div>
                <label className="sr-only" htmlFor={searchId}>
                  Filter applications
                </label>
                <div className="search-field">
                  <Search aria-hidden="true" />
                  <input
                    id={searchId}
                    className="field"
                    type="search"
                    placeholder="Find an application…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </div>
              <TabsList aria-label="Filter by demo state">
                <TabsTrigger value="all">All apps</TabsTrigger>
                <TabsTrigger value="running">Running</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
              </TabsList>
            </div>
            {(['all', 'running', 'paused'] as const).map((value) => (
              <TabsContent key={value} value={value} className="mt-0">
                {visible.length ? (
                  <ul className="m-0 list-none p-0">
                    {visible.map((service) => (
                      <li
                        key={service.id}
                        className="service-row"
                        data-selected={service.id === selectedId}
                      >
                        <div className="service-icon">
                          <service.icon aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="service-name">{service.name}</h3>
                          <p className="service-description">
                            {service.description}
                          </p>
                          <span className="sr-only">
                            {service.enabled ? 'Running' : 'Paused'} in demo
                          </span>
                        </div>
                        <div className="service-controls">
                          <Status tone={service.enabled ? 'on' : 'off'}>
                            {service.enabled ? 'Running' : 'Paused'}
                          </Status>
                          <IconButton
                            label={`Inspect ${service.name}`}
                            aria-pressed={service.id === selectedId}
                            onClick={() => setSelectedId(service.id)}
                          >
                            <ArrowRight aria-hidden="true" />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-state">
                    <h2>No applications found</h2>
                    <p>
                      Try a different name or return to all demo applications.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery('')
                        setFilter('all')
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          <div className="console-foot">
            <span aria-live="polite">
              {visible.length} application{visible.length === 1 ? '' : 's'}{' '}
              shown
            </span>
            <span>Local memory only · reload to reset</span>
          </div>
        </Panel>
        {selected && (
          <Panel
            className="detail-panel"
            aria-label={`${selected.name} details`}
          >
            <div className="service-icon">
              <selected.icon aria-hidden="true" />
            </div>
            <h2>{selected.name}</h2>
            <p>{selected.details}</p>
            <dl className="detail-facts">
              <div>
                <dt>Type</dt>
                <dd>{selected.category}</dd>
              </div>
              <div>
                <dt>Environment</dt>
                <dd>Illustrative</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>
                  <Status tone={selected.enabled ? 'on' : 'off'}>
                    {selected.enabled ? 'Running' : 'Paused'}
                  </Status>
                </dd>
              </div>
            </dl>
            <div className="detail-toggle">
              <label htmlFor={`toggle-${selected.id}`}>Run in demo</label>
              <Switch
                id={`toggle-${selected.id}`}
                checked={selected.enabled}
                onCheckedChange={(enabled) =>
                  toggleService(selected.id, enabled)
                }
              />
            </div>
            <p className="helper mb-0">
              This switch never starts or stops a real service.
            </p>
          </Panel>
        )}
      </div>
      <p className="helper mt-5" role="status">
        {announcement ||
          'Select an arrow to inspect an app, then try its local demo switch.'}
      </p>
    </>
  )
}
