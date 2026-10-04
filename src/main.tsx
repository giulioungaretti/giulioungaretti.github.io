import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import '@/index.css'
import { normalizePath } from '@/lib/blog'

const root = document.getElementById('root')
if (!root) throw new Error('Missing application root element')

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
const renderedPath = root.dataset.renderedPath
if (
  root.hasChildNodes() &&
  renderedPath &&
  normalizePath(renderedPath) === normalizePath(window.location.pathname)
)
  hydrateRoot(root, app)
else createRoot(root).render(app)
