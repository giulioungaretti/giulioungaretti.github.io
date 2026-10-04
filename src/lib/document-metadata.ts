import type { PageMetadata } from '@/site'

function setMeta(
  key: string,
  content: string,
  attribute: 'name' | 'property' = 'name',
) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  )
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

export function updateDocumentMetadata(metadata: PageMetadata) {
  document.title = metadata.title
  setMeta('description', metadata.description)
  setMeta('og:title', metadata.title, 'property')
  setMeta('og:description', metadata.description, 'property')
  setMeta('og:url', metadata.canonical, 'property')
  setMeta('og:type', metadata.articleDate ? 'article' : 'website', 'property')
  if (metadata.articleDate)
    setMeta(
      'article:published_time',
      `${metadata.articleDate}T00:00:00Z`,
      'property',
    )
  else
    document.querySelector('meta[property="article:published_time"]')?.remove()
  if (metadata.noIndex) setMeta('robots', 'noindex,follow')
  else document.querySelector('meta[name="robots"]')?.remove()

  let canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  )
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = metadata.canonical
}
