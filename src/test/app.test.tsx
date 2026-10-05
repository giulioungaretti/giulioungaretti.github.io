import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '@/App'
import { filterServices, initialServices } from '@/data/services'

function renderRoute(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}
async function enterDemo() {
  renderRoute('/login')
  await userEvent.click(
    screen.getByRole('button', { name: 'Enter demo admin' }),
  )
}

describe('CV and navigation', () => {
  it('uses the approved fascia and revised experience wording', () => {
    const { container } = renderRoute()
    expect(
      screen.getByText(/with more than a decade across/),
    ).toBeInTheDocument()
    expect(screen.queryByText(/13\+ years/)).not.toBeInTheDocument()
    expect(container.querySelector('.personal-cassette')).toBeInTheDocument()
    expect(container.querySelector('.vent')).not.toBeInTheDocument()
  })
  it('routes with the persistent CV/Blog selector without stealing focus', async () => {
    renderRoute()
    const cv = screen.getByRole('radio', { name: 'CV' })
    const blog = screen.getByRole('radio', { name: 'Blog' })
    cv.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { name: 'Writing' })).toBeInTheDocument()
    expect(blog).toBeChecked()
    expect(blog).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument()
    expect(cv).toBeChecked()
    expect(cv).toHaveFocus()
  })
  it('shows factual CV content and an original PDF download', () => {
    renderRoute('/cv')
    expect(
      screen.getByRole('heading', {
        name: 'Giulio Jensen Ungaretti',
        level: 1,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Novo Nordisk' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'BSc, Ca’ Foscari University of Venice',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Download CV (PDF)' }),
    ).toHaveAttribute('href', '/giulio-jensen-ungaretti-cv.pdf')
    expect(screen.getByRole('radio', { name: 'CV' })).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Admin login' }),
    ).not.toBeInTheDocument()
  })
  it.each(['/', '/cv', '/blog', '/blog/hello-world'])(
    'uses only the joined CV/Blog selector for site navigation on %s',
    (path) => {
      const { container } = renderRoute(path)
      expect(screen.getAllByRole('radio')).toHaveLength(2)
      expect(screen.queryByRole('slider')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Home' }),
      ).not.toBeInTheDocument()
      expect(container.querySelectorAll('.personal-page-switch')).toHaveLength(
        1,
      )
      expect(container.querySelector('.fascia-nav')).not.toBeInTheDocument()
      expect(container.querySelector('.personal-nav')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: 'Read my CV' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: 'Writing' }),
      ).not.toBeInTheDocument()
    },
  )
  it('explains demo entry without collecting credentials', () => {
    renderRoute('/login')
    expect(screen.getByText(/No real authentication/)).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
  it('redirects a fresh deep link to the non-authentication demo entry', () => {
    renderRoute('/admin')
    expect(
      screen.getByRole('heading', { name: 'Demo admin login' }),
    ).toBeInTheDocument()
  })
  it('has a useful not-found page', async () => {
    renderRoute('/missing')
    expect(
      screen.getByRole('heading', { name: 'This page isn’t here.' }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Back to CV' }))
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument()
  })
})

describe('personal route scroll positioning', () => {
  afterEach(() => vi.restoreAllMocks())

  it('prevents reading-sheet focus from scrolling past the cassette on pointer navigation', () => {
    renderRoute('/blog')
    const main = screen.getByRole('main')
    main.focus()
    const focus = vi.spyOn(main, 'focus')
    const scroll = vi.spyOn(window, 'scrollTo').mockClear()
    fireEvent.click(screen.getByRole('radio', { name: 'CV' }))
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument()
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  })

  it('keeps native keyboard focus while resetting the viewport on both transitions', async () => {
    renderRoute('/blog')
    const cv = screen.getByRole('radio', { name: 'CV' })
    const blog = screen.getByRole('radio', { name: 'Blog' })
    const scroll = vi.spyOn(window, 'scrollTo').mockClear()
    const into = vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockClear()
    blog.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(cv).toBeChecked()
    expect(cv).toHaveFocus()
    expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
    await userEvent.keyboard('{ArrowRight}')
    expect(blog).toBeChecked()
    expect(blog).toHaveFocus()
    expect(scroll).toHaveBeenCalledTimes(2)
    expect(into).not.toHaveBeenCalled()
  })
})

describe('local admin demo', () => {
  it('enters, inspects and toggles an illustrative service', async () => {
    await enterDemo()
    await userEvent.click(
      screen.getByRole('button', { name: 'Inspect presentami' }),
    )
    const detail = screen.getByRole('region', { name: 'presentami details' })
    expect(within(detail).getByText('Illustrative')).toBeInTheDocument()
    const toggle = within(detail).getByRole('switch', { name: 'Run in demo' })
    expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    expect(toggle).toBeChecked()
    expect(screen.getByText('4 of 4 running in demo')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'No server was changed.',
    )
  })
  it('filters by name and state, exposes empty recovery, then resets', async () => {
    await enterDemo()
    const input = screen.getByRole('searchbox', { name: 'Filter applications' })
    await userEvent.type(input, 'unknown')
    expect(
      screen.getByRole('heading', { name: 'No applications found' }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(input).toHaveValue('')
    await userEvent.click(screen.getByRole('tab', { name: 'Paused' }))
    expect(
      screen.getByRole('button', { name: 'Inspect presentami' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Inspect leggmini' }),
    ).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Reset demo' }))
    expect(screen.getByRole('tab', { name: 'All apps' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getAllByRole('button', { name: /Inspect / })).toHaveLength(4)
  })
  it('operates tabs by keyboard and exits cleanly', async () => {
    await enterDemo()
    screen.getByRole('tab', { name: 'All apps' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Running' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Exit demo' }))
    expect(
      screen.getByRole('button', { name: 'Enter demo admin' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  describe('independent page shells', () => {
    it.each([
      ['/login', 'Demo control panel'],
      ['/design-system', 'Component reference'],
    ])('keeps %s independent from other surfaces', (path, label) => {
      renderRoute(path)
      expect(
        within(screen.getByRole('banner')).getByText(label),
      ).toBeInTheDocument()
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
      const pageLinks = screen
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
      expect(
        pageLinks.filter(
          (href) => href?.startsWith('/') && !href.endsWith('.pdf'),
        ),
      ).toEqual([])
    })

    it('keeps the entered admin dashboard independent too', async () => {
      await enterDemo()
      expect(
        within(screen.getByRole('banner')).getByText('Demo control panel'),
      ).toBeInTheDocument()
      expect(
        screen.getAllByRole('link').map((link) => link.getAttribute('href')),
      ).toEqual(['#main'])
      expect(
        screen.queryByText('Giulio Jensen Ungaretti'),
      ).not.toBeInTheDocument()
    })
  })
  it('matches normalized terms and combines status criteria', () => {
    expect(
      filterServices(initialServices, '  READING ', 'running').map(
        (service) => service.id,
      ),
    ).toEqual(['leggmini'])
    expect(
      filterServices(initialServices, '', 'paused').map(
        (service) => service.id,
      ),
    ).toEqual(['presentami'])
    expect(filterServices(initialServices, 'giornale', 'paused')).toEqual([])
  })
})

describe('component showcase', () => {
  it('credits the exact palette and validates a local form', async () => {
    renderRoute('/design-system')
    expect(screen.getByText('#FE6900')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Component usage example' }),
    ).toHaveAttribute('tabindex', '0')
    expect(
      screen.getByRole('link', { name: 'Never-Setting-Sun by Halifax' }),
    ).toHaveAttribute(
      'href',
      'https://www.colourlovers.com/palette/3060721/Never-Setting-Sun',
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Try validation' }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a device name')
    const input = screen.getByRole('textbox', { name: 'Demo device name' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    await userEvent.type(input, 'kitchen radio')
    await userEvent.click(
      screen.getByRole('button', { name: 'Try validation' }),
    )
    expect(
      screen.getByRole('status', { name: 'Validation result' }),
    ).toHaveTextContent('Nothing was sent or saved.')
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })
  it('rejects overlong names with recovery instructions', async () => {
    renderRoute('/design-system')
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Demo device name' }),
      'a'.repeat(41),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Try validation' }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      '40 characters or fewer',
    )
  })
})
