import {
  BookOpen,
  Blocks,
  NotebookPen,
  Presentation,
  type LucideIcon,
} from 'lucide-react'

export type ServiceId = 'leggmini' | 'giornale' | 'presentami' | 'workbench'
export type ServiceFilter = 'all' | 'running' | 'paused'

export interface DemoService {
  id: ServiceId
  name: string
  description: string
  details: string
  category: string
  icon: LucideIcon
  enabled: boolean
}

export const initialServices: readonly DemoService[] = [
  {
    id: 'leggmini',
    name: 'leggmini',
    description: 'A little reading collection',
    details:
      'An imaginary place to keep a personal reading list. This specimen has no library, database, or working reading app behind it.',
    category: 'Reading',
    icon: BookOpen,
    enabled: true,
  },
  {
    id: 'giornale',
    name: 'giornale',
    description: 'Notes for the everyday',
    details:
      'An illustrative daily journal service. No journal entries are stored or transmitted; the controls only change this demo’s in-memory state.',
    category: 'Writing',
    icon: NotebookPen,
    enabled: true,
  },
  {
    id: 'presentami',
    name: 'presentami',
    description: 'Small presentations, simply',
    details:
      'An imaginary presentation companion. It does not generate or host presentations. Its service state is a local UI demonstration.',
    category: 'Presenting',
    icon: Presentation,
    enabled: false,
  },
  {
    id: 'workbench',
    name: 'workbench',
    description: 'A home for small experiments',
    details:
      'An illustrative workspace for personal experiments. There are no deployments, infrastructure connections, or real resource measurements.',
    category: 'Experiments',
    icon: Blocks,
    enabled: true,
  },
]

export function filterServices(
  services: readonly DemoService[],
  query: string,
  filter: ServiceFilter,
) {
  const term = query.trim().toLocaleLowerCase()
  return services.filter((service) => {
    const matchesTerm =
      `${service.name} ${service.description} ${service.category}`
        .toLocaleLowerCase()
        .includes(term)
    const matchesState =
      filter === 'all' ||
      (filter === 'running' ? service.enabled : !service.enabled)
    return matchesTerm && matchesState
  })
}

export function isServiceFilter(value: string): value is ServiceFilter {
  return value === 'all' || value === 'running' || value === 'paused'
}
