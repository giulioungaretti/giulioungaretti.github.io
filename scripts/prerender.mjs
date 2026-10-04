import { readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { routes, renderPage, posts, site } from '../.ssr/prerender.js'

function escape(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, (character) => entities[character])
}

const output = resolve('dist')
const template = await readFile(resolve(output, 'index.html'), 'utf8')
if (!/<div id="root"><\/div>/.test(template))
  throw new Error('Build template must contain an empty #root element.')

function documentFor(path) {
  const { html, metadata } = renderPage(path)
  const extraHead = [
    `<link rel="canonical" href="${escape(metadata.canonical)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="${escape(site.name)} — Writing" href="/feed.xml" />`,
    `<meta property="og:title" content="${escape(metadata.title)}" />`,
    `<meta property="og:description" content="${escape(metadata.description)}" />`,
    `<meta property="og:url" content="${escape(metadata.canonical)}" />`,
    `<meta property="og:type" content="${metadata.articleDate ? 'article' : 'website'}" />`,
    metadata.articleDate
      ? `<meta property="article:published_time" content="${metadata.articleDate}T00:00:00Z" />`
      : '',
    metadata.noIndex ? '<meta name="robots" content="noindex,follow" />' : '',
  ].join('\n')
  return template
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escape(metadata.title)}</title>`,
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escape(metadata.description)}" />`,
    )
    .replace('</head>', `${extraHead}\n</head>`)
    .replace(
      '<div id="root"></div>',
      () => `<div id="root" data-rendered-path="${escape(path)}">${html}</div>`,
    )
}

for (const route of routes) {
  if (!/^\/(?:[a-z0-9-]+\/)*$/.test(route))
    throw new Error(`Unsafe static output route: ${route}`)
  const file = resolve(output, `.${route}`, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, documentFor(route))
}
await writeFile(resolve(output, '404.html'), documentFor('/not-found'))

const feedItems = posts
  .map(
    (post) =>
      `<item><title>${escape(post.title)}</title><link>${site.url}/blog/${post.slug}/</link><guid isPermaLink="true">${site.url}${post.legacyPath}</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escape(post.description)}</description>${post.tags.map((tag) => `<category>${escape(tag)}</category>`).join('')}</item>`,
  )
  .join('\n')
await writeFile(
  resolve(output, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(site.name)} — Writing</title><link>${site.url}/blog/</link><description>${escape(site.description)}</description><language>en</language><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>${feedItems}</channel></rss>`,
)

const personalPaths = [
  '/',
  '/cv/',
  '/blog/',
  ...posts.map((post) => `/blog/${post.slug}/`),
]
await writeFile(
  resolve(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${personalPaths.map((path) => `<url><loc>${site.url}${path}</loc></url>`).join('')}</urlset>`,
)
await writeFile(
  resolve(output, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`,
)
await rm(resolve('.ssr'), { recursive: true })
console.log(
  `Generated ${routes.length} static pages, original article URLs, 404, RSS, and sitemap.`,
)
