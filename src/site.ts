import { getPostByPath, normalizePath, postPath } from '@/lib/blog'

export const site = {
  author: 'Giulio Jensen Ungaretti',
  name: 'Giulio Ungaretti',
  url: 'https://giulioungaretti.me',
  description: 'Thoughts on software, engineering, and building things',
} as const

export interface PageMetadata {
  title: string
  description: string
  canonical: string
  noIndex: boolean
  articleDate?: string
}

export function pageMetadata(path: string): PageMetadata {
  const post = getPostByPath(path)
  if (post)
    return {
      title: `${post.title} — ${site.name}`,
      description: post.description,
      canonical: `${site.url}${postPath(post)}`,
      articleDate: post.date,
      noIndex: false,
    }
  const pages: Record<
    string,
    { title: string; description: string; noIndex?: boolean }
  > = {
    '/': {
      title: 'Giulio Ungaretti — software & AI',
      description:
        'Software and AI engineering leader. Professional history and writing on software, engineering, and building things.',
    },
    '/cv': {
      title: 'Giulio Ungaretti — software & AI',
      description:
        'Giulio Jensen Ungaretti’s experience, education, community work, and original CV download.',
    },
    '/blog': { title: `Writing — ${site.name}`, description: site.description },
    '/login': {
      title: 'Demo admin login — Home server',
      description:
        'A credential-free, local-only home-server UI demonstration.',
      noIndex: true,
    },
    '/admin': {
      title: 'Home server — Demo control panel',
      description:
        'Illustrative applications and local-only demo controls. No real authentication or server connection.',
      noIndex: true,
    },
    '/design-system': {
      title: 'Design system — Component reference',
      description:
        'Appliance-inspired components, semantic tokens, and accessible interaction examples.',
      noIndex: true,
    },
  }
  const normalized = normalizePath(path)
  const page = pages[normalized]
  const canonicalPath = normalized === '/cv' ? '/' : normalized
  return {
    title: page?.title ?? `Page not found — ${site.name}`,
    description:
      page?.description ?? 'This address does not match a page on this site.',
    canonical: `${site.url}${canonicalPath === '/' ? '/' : `${canonicalPath}/`}`,
    noIndex: page?.noIndex ?? !page,
  }
}
