import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '@/App'
import { MarkdownBody } from '@/components/MarkdownBody'
import { PostList } from '@/components/PostList'

function page(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('combined personal site', () => {
  it.each(['/', '/cv', '/blog', '/blog/hello-world/'])(
    'connects personal pages at %s without exposing admin or showcase',
    (path) => {
      page(path)
      expect(
        within(screen.getByRole('group', { name: 'Rotary navigation' }))
          .getAllByRole('button')
          .map((button) => button.textContent),
      ).toEqual(['Home', 'CV', 'Blog'])
      expect(
        screen.getByRole('slider', { name: 'Page selector' }),
      ).toHaveAttribute(
        'aria-valuetext',
        path === '/' ? 'Home' : path === '/cv' ? 'CV' : 'Blog',
      )
      const hrefs = screen
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
      expect(hrefs).not.toContain('/admin')
      expect(hrefs).not.toContain('/login')
      expect(hrefs).not.toContain('/design-system')
    },
  )
  it('shows the real post on the homepage and lets a visitor read it', async () => {
    page('/')
    expect(
      screen.getByRole('heading', { name: 'Latest writing' }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Hello World' }))
    expect(
      screen.getByRole('heading', { name: 'Hello World', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/This is the first post/)).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Article code example' }),
    ).toHaveAttribute('tabindex', '0')
    expect(document.title).toBe('Hello World — Giulio Ungaretti')
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://giulioungaretti.me/blog/hello-world/',
    )
  })
  it('preserves the existing Jekyll article URL with a new canonical address', () => {
    page('/2026/04/hello-world/')
    expect(
      screen.getByRole('heading', { name: 'Hello World', level: 1 }),
    ).toBeInTheDocument()
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://giulioungaretti.me/blog/hello-world/',
    )
  })
  it('does not list the imported example draft and gives unknown articles useful recovery', async () => {
    page('/blog/not-a-post')
    expect(
      screen.getByRole('heading', { name: 'This post isn’t here.' }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Back to writing' }))
    expect(screen.getByRole('heading', { name: 'Writing' })).toBeInTheDocument()
    expect(screen.queryByText('Draft Post Title')).not.toBeInTheDocument()
    expect(
      document.querySelector('meta[name="robots"]'),
    ).not.toBeInTheDocument()
    expect(
      document.querySelector('meta[property="article:published_time"]'),
    ).not.toBeInTheDocument()
  })
  it('has a genuine empty publication state', () => {
    render(<PostList posts={[]} />)
    expect(screen.getByText(/No posts published yet/)).toBeInTheDocument()
  })
})

describe('Markdown reading surface', () => {
  it('renders headings, formatting, links, fenced code, GFM tables and labeled tasks', () => {
    render(
      <MarkdownBody>
        {
          '# Body heading\n\n**Bold** and `code` and [link](https://example.com).\n\n```ts\nconst answer = 42\n```\n\n| Name | Value |\n| --- | --- |\n| Test | 42 |\n\n- [x] Completed task'
        }
      </MarkdownBody>,
    )
    expect(
      screen.getByRole('heading', { name: 'Body heading', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Bold').tagName).toBe('STRONG')
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute(
      'href',
      'https://example.com',
    )
    expect(
      screen.getByRole('region', { name: 'Article table' }),
    ).toHaveAttribute('tabindex', '0')
    expect(
      screen.getByRole('checkbox', { name: 'Completed task' }),
    ).toBeChecked()
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
  it('never executes raw HTML in Markdown', () => {
    render(
      <MarkdownBody>
        {
          '<script>window.untrusted = true</script>\n\n[bad](javascript:alert(1))'
        }
      </MarkdownBody>,
    )
    expect(document.querySelector('script')).not.toBeInTheDocument()
    expect(screen.getByText('bad').getAttribute('href')).not.toMatch(
      /^javascript:/,
    )
  })
})
