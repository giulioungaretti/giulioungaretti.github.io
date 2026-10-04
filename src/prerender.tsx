import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from '@/App'
import { posts, postPath } from '@/lib/blog'
import { pageMetadata, site } from '@/site'

export { posts, site }
export const routes = [
  '/',
  '/cv/',
  '/blog/',
  '/login/',
  '/admin/',
  '/design-system/',
  ...posts.flatMap((post) => [postPath(post), post.legacyPath]),
]

export function renderPage(path: string) {
  return {
    html: renderToString(
      <StrictMode>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </StrictMode>,
    ),
    metadata: pageMetadata(path),
  }
}
