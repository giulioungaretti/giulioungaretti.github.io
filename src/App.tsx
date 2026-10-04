import { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PageHeading } from '@/components/system'
import { Cv } from '@/pages/Cv'
import { Blog } from '@/pages/Blog'
import { BlogArticle } from '@/pages/BlogArticle'
import { Login } from '@/pages/Login'
import { Admin } from '@/pages/Admin'
import { Showcase } from '@/pages/Showcase'
import { PersonalLayout } from '@/layouts/PersonalLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ShowcaseLayout } from '@/layouts/ShowcaseLayout'

import { pageMetadata } from '@/site'
import { updateDocumentMetadata } from '@/lib/document-metadata'

export function App() {
  const [demoEntered, setDemoEntered] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const mainRef = useRef<HTMLElement>(null)
  const initialPath = useRef(location.pathname)

  useEffect(() => {
    const metadata = pageMetadata(location.pathname)
    updateDocumentMetadata(metadata)
    if (initialPath.current !== location.pathname) {
      if (!document.activeElement?.closest('.personal-page-switch')) {
        mainRef.current?.focus()
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollIntoView({ block: 'nearest' })
      }
    }
    initialPath.current = location.pathname
  }, [location.pathname])

  return (
    <TooltipProvider delayDuration={400}>
      <Routes>
        <Route element={<PersonalLayout mainRef={mainRef} />}>
          <Route path="/" element={<Cv />} />
          <Route path="/cv" element={<Cv />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/:year/:month/:legacySlug" element={<BlogArticle />} />
          <Route
            path="*"
            element={
              <>
                <PageHeading title="This page isn’t here.">
                  The address doesn’t match a page. Check the address or return
                  to the homepage.
                </PageHeading>
                <Button asChild variant="outline">
                  <Link to="/">Back to CV</Link>
                </Button>
              </>
            }
          />
        </Route>
        <Route element={<AdminLayout mainRef={mainRef} />}>
          <Route
            path="/login"
            element={<Login onEnter={() => setDemoEntered(true)} />}
          />
          <Route
            path="/admin"
            element={
              demoEntered ? (
                <Admin
                  onExit={() => {
                    setDemoEntered(false)
                    void navigate('/login')
                  }}
                />
              ) : (
                <Login onEnter={() => setDemoEntered(true)} />
              )
            }
          />
        </Route>
        <Route element={<ShowcaseLayout mainRef={mainRef} />}>
          <Route path="/design-system" element={<Showcase />} />
        </Route>
      </Routes>
    </TooltipProvider>
  )
}
