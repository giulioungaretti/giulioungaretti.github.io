import { chromium, webkit } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const baseURL = process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173'
const output = process.env.QA_OUTPUT ?? '.impeccable/qa'
await mkdir(output, { recursive: true })
const preflight = await fetch(baseURL)
assert.equal(preflight.status, 200, 'Preview server must respond successfully')
assert.match(
  await preflight.text(),
  /<title>Giulio Ungaretti/,
  'PREVIEW_URL is not this project’s server',
)
const engine = process.env.BROWSER_ENGINE ?? 'chromium'
if (engine !== 'chromium' && engine !== 'webkit')
  throw new Error(`Unsupported BROWSER_ENGINE: ${engine}`)
const browser = await (engine === 'webkit' ? webkit : chromium).launch()
const findings = []
try {
  await Promise.all(
    [
      { name: 'desktop', width: 1440, height: 1000 },
      { name: 'mobile', width: 390, height: 844 },
      { name: 'small-mobile', width: 320, height: 740 },
    ].map(async (viewport) => {
      const context = await browser.newContext({
        viewport,
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') {
          const url = message.location().url
          if (
            url === `${baseURL}/blog/not-a-post/` &&
            /Failed to load resource.*404/.test(message.text())
          )
            return
          errors.push(`${message.text()} (${url})`)
        }
      })
      for (const [name, route] of [
        ['home', '/'],
        ['cv', '/cv/'],
        ['blog', '/blog/'],
        ['post', '/blog/hello-world/'],
        ['legacy', '/2026/04/hello-world/'],
        ['login', '/login'],
        ['system', '/design-system'],
        ['admin', '/login'],
      ]) {
        await page.goto(`${baseURL}${route}`)
        await page.getByRole('main').waitFor()
        if (name === 'admin')
          await page.getByRole('button', { name: 'Enter demo admin' }).click()
        const routeLinks = await page
          .getByRole('link')
          .evaluateAll((links) =>
            links
              .map((link) => link.getAttribute('href'))
              .filter(
                (href) => href?.startsWith('/') && !href.endsWith('.pdf'),
              ),
          )
        if (['home', 'cv', 'blog', 'post', 'legacy'].includes(name)) {
          assert.equal(
            await page.getByRole('slider', { name: 'Page selector' }).count(),
            0,
          )
          assert.equal(await page.getByRole('radio').count(), 2)
          assert.ok(
            await page
              .getByRole('radio', {
                name: name === 'home' || name === 'cv' ? 'CV' : 'Blog',
                exact: true,
              })
              .isChecked(),
          )
          assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1)
          const colors = await page
            .locator('.personal-monogram')
            .evaluate((element) => ({
              ink: getComputedStyle(element).color,
              dot: getComputedStyle(element.querySelector('span')).color,
              canvas: getComputedStyle(document.body).backgroundColor,
            }))
          assert.deepEqual(colors, {
            ink: 'rgb(38, 25, 20)',
            dot: 'rgb(200, 32, 0)',
            canvas: 'rgb(255, 255, 255)',
          })
          if (name === 'home' || name === 'cv') {
            const intro = await page.evaluate(() => {
              const box = (selector) => {
                const rect = document
                  .querySelector(selector)
                  .getBoundingClientRect()
                return {
                  x: rect.x,
                  y: rect.y,
                  right: rect.right,
                  bottom: rect.bottom,
                  width: rect.width,
                }
              }
              return {
                container: box('.personal-layout'),
                row: box('.personal-intro'),
                paragraph: box('.personal-intro p'),
                download: box('.personal-download'),
              }
            })
            assert.ok(Math.abs(intro.download.right - intro.row.right) < 1)
            if (intro.container.width >= 1024) {
              assert.ok(Math.abs(intro.download.y - intro.paragraph.y) < 1)
              assert.ok(intro.download.x >= intro.paragraph.right + 31)
              if (intro.container.width >= 1120)
                assert.ok(
                  intro.paragraph.width > 700,
                  'Wide summary must expand beyond the old 70ch cap',
                )
            } else {
              assert.ok(intro.download.y >= intro.paragraph.bottom + 19)
            }
          }
          assert.equal(
            await page.locator('.fascia-nav, .personal-nav').count(),
            0,
          )
          assert.equal(
            await page
              .getByRole('link', { name: 'Read my CV', exact: true })
              .count(),
            0,
          )
          assert.ok(
            routeLinks.every(
              (href) =>
                !/^\/(?:admin|login|design-system)(?:\/|$|\?)/.test(href),
            ),
            `${name}: personal pages must not link to demo/reference surfaces`,
          )
        } else
          assert.deepEqual(
            routeLinks,
            [],
            `${name}: demo/reference surfaces must stay independent`,
          )
        if (process.env.EXPECT_PRERENDER) {
          const response = await context.request.get(`${baseURL}${route}`)
          assert.equal(response.status(), 200)
          assert.doesNotMatch(
            await response.text(),
            /<div id="root">\s*<\/div>/,
            `${name}: static content must exist before JavaScript`,
          )
        }
        if (!process.env.SKIP_SCREENSHOTS)
          await page.screenshot({
            path: `${output}/${viewport.name}-${name}.png`,
            fullPage: true,
          })
        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
        }))
        const overflow =
          dimensions.content > dimensions.viewport
            ? await page.evaluate(() =>
                [...document.querySelectorAll('main *')]
                  .filter(
                    (element) =>
                      element.getBoundingClientRect().right >
                      document.documentElement.clientWidth,
                  )
                  .map((element) => ({
                    tag: element.tagName,
                    class: element.className,
                    right: element.getBoundingClientRect().right,
                  }))
                  .slice(0, 12),
              )
            : []
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        findings.push({
          viewport: viewport.name,
          route: name,
          overflow,
          violations: results.violations.map(({ id, impact, nodes }) => ({
            id,
            impact,
            targets: nodes.map((node) => node.target),
          })),
        })
        await writeFile(
          `${output}/findings.json`,
          JSON.stringify(findings, null, 2),
        )
      }
      await page.getByRole('button', { name: 'Inspect presentami' }).click()
      const detail = page.getByRole('region', { name: 'presentami details' })
      await detail.getByRole('switch', { name: 'Run in demo' }).click()
      assert.equal(
        await detail.getByRole('switch').getAttribute('aria-checked'),
        'true',
      )
      await page.getByRole('searchbox').fill('no-such-app')
      await page
        .getByRole('heading', { name: 'No applications found' })
        .waitFor()
      assert.equal(
        await page
          .getByRole('heading', { name: 'No applications found' })
          .count(),
        1,
      )
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await page.getByRole('button', { name: 'Inspect leggmini' }).waitFor()
      assert.equal(
        await page.getByRole('button', { name: /Inspect / }).count(),
        4,
      )
      await page.getByRole('button', { name: 'Reset demo' }).click()
      await page.getByRole('button', { name: 'Exit demo' }).click()
      await page.getByRole('heading', { name: 'Demo admin login' }).waitFor()
      assert.equal(
        await page.getByRole('heading', { name: 'Demo admin login' }).count(),
        1,
      )
      await page.goto(`${baseURL}/`)
      await page.getByRole('link', { name: 'Skip to content' }).waitFor()
      // macOS WebKit includes links in keyboard navigation with Option+Tab.
      await page.keyboard.press(
        engine === 'webkit' && process.platform === 'darwin'
          ? 'Alt+Tab'
          : 'Tab',
      )
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent),
        'Skip to content',
      )
      await page.keyboard.press('Enter')
      assert.equal(
        await page.evaluate(() => document.activeElement?.id),
        'main',
      )
      assert.equal(await page.locator('.vent').count(), 0)
      assert.equal(
        await page.getByText(/with more than a decade across/).count(),
        1,
      )
      const cvKey = page.getByRole('radio', { name: 'CV', exact: true })
      const blogKey = page.getByRole('radio', { name: 'Blog', exact: true })
      const selector = page.locator('.personal-page-switch')
      await cvKey.focus()
      const original = await selector.boundingBox()
      assert.ok(original)
      await cvKey.press('ArrowRight')
      await page
        .getByRole('heading', { name: 'Writing', exact: true })
        .waitFor()
      assert.ok(await blogKey.isChecked())
      assert.equal(
        await blogKey.evaluate((element) => element === document.activeElement),
        true,
      )
      const blogBounds = await selector.boundingBox()
      assert.ok(blogBounds)
      for (const property of ['x', 'y', 'width', 'height'])
        assert.ok(
          Math.abs(original[property] - blogBounds[property]) < 1,
          `Selector ${property} shifted`,
        )
      await blogKey.press('ArrowLeft')
      await page
        .getByRole('heading', { name: 'Experience', exact: true })
        .waitFor()
      assert.ok(await cvKey.isChecked())
      assert.ok(
        await cvKey.evaluate((element) => element === document.activeElement),
      )
      await page
        .locator('.personal-switch-key')
        .filter({
          has: page.locator('input[value="blog"]'),
        })
        .click()
      await page
        .getByRole('heading', { name: 'Writing', exact: true })
        .waitFor()
      assert.ok(await blogKey.isChecked())
      for (const view of ['cv', 'blog', 'cv']) {
        await page
          .locator('.personal-switch-key')
          .filter({
            has: page.locator(`input[value="${view}"]`),
          })
          .click()
        await page
          .getByRole('heading', {
            name: view === 'cv' ? 'Experience' : 'Writing',
            exact: true,
          })
          .waitFor()
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
        )
        const viewportPosition = await page.evaluate(() => ({
          scroll: window.scrollY,
          cassetteTop: document
            .querySelector('.personal-sleeve')
            .getBoundingClientRect().top,
        }))
        assert.equal(
          viewportPosition.scroll,
          0,
          `${engine}: ${view} navigation must not scroll below the cassette`,
        )
        assert.ok(viewportPosition.cassetteTop >= 0)
      }
      const pdf = await context.request.get(
        `${baseURL}/giulio-jensen-ungaretti-cv.pdf`,
      )
      assert.equal(pdf.status(), 200)
      assert.match(pdf.headers()['content-type'], /application\/pdf/)
      await page.goto(`${baseURL}/blog/`)
      await page.getByRole('link', { name: 'Hello World' }).click()
      await page
        .getByRole('heading', { name: 'Hello World', level: 1 })
        .waitFor()
      assert.equal(
        await page
          .getByRole('region', { name: 'Article code example' })
          .getAttribute('tabindex'),
        '0',
      )
      await page.getByRole('link', { name: 'All writing' }).click()
      await page.getByRole('heading', { name: 'Writing' }).waitFor()
      await page.goto(`${baseURL}/blog/not-a-post/`)
      await page
        .getByRole('heading', { name: 'This post isn’t here.' })
        .waitFor()
      assert.equal(errors.length, 0, errors.join('\n'))
      await context.close()
    }),
  )
  console.log(JSON.stringify(findings, null, 2))
  if (process.env.EXPECT_PRERENDER) {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const reader = await context.newPage()
    await reader.goto(`${baseURL}/`)
    await reader
      .getByRole('heading', { name: 'Experience', exact: true })
      .waitFor()
    await reader
      .getByRole('navigation', { name: 'Personal site without JavaScript' })
      .getByRole('link', { name: 'Blog', exact: true })
      .click()
    await reader
      .getByRole('heading', { name: 'Writing', exact: true })
      .waitFor()
    await reader.goto(`${baseURL}/2026/04/hello-world/`)
    await reader
      .getByRole('heading', { name: 'Hello World', level: 1 })
      .waitFor()
    assert.equal(await reader.getByText(/This is the first post/).count(), 1)
    await reader.getByRole('link', { name: 'All writing' }).click()
    await reader.getByRole('heading', { name: 'Writing' }).waitFor()
    await context.close()
  }
  assert.equal(
    findings.reduce((sum, finding) => sum + finding.overflow.length, 0),
    0,
    'Resolve horizontal overflow above',
  )
  assert.equal(
    findings.reduce((sum, finding) => sum + finding.violations.length, 0),
    0,
    'Resolve accessibility findings above',
  )
  console.log(
    'Desktop/mobile routes, fixed CV/Blog selection, revised copy, local interactions, keyboard entry, PDF, and accessibility checks passed.',
  )
} finally {
  await browser.close()
}
