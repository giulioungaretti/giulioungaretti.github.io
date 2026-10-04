import { chromium } from 'playwright'
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
const browser = await chromium.launch()
const findings = []
try {
  await Promise.all(
    [
      { name: 'desktop', width: 1440, height: 1000 },
      { name: 'mobile', width: 390, height: 844 },
    ].map(async (viewport) => {
      const context = await browser.newContext({
        viewport,
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
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
      await page.keyboard.press('Tab')
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
      const dial = page.getByRole('slider', { name: 'Page selector' })
      await dial.focus()
      await dial.press('ArrowRight')
      await page.getByRole('heading', { name: 'Curriculum vitae' }).waitFor()
      assert.equal(await dial.getAttribute('aria-valuetext'), 'CV')
      assert.equal(
        await dial.evaluate((element) => element === document.activeElement),
        true,
      )
      await dial.press('End')
      await page
        .getByRole('heading', { name: 'Writing', exact: true })
        .waitFor()
      assert.equal(await dial.getAttribute('aria-valuetext'), 'Blog')
      assert.equal(
        await dial.evaluate((element) => element === document.activeElement),
        true,
      )
      await dial.press('Home')
      await page
        .getByRole('heading', { name: 'Giulio Jensen Ungaretti' })
        .waitFor()
      assert.equal(await dial.getAttribute('aria-valuetext'), 'Home')
      await dial.scrollIntoViewIfNeeded()
      const dialBounds = await dial.boundingBox()
      assert.ok(dialBounds)
      const centerX = dialBounds.x + dialBounds.width / 2
      const centerY = dialBounds.y + dialBounds.height / 2
      const radius = dialBounds.width * 0.35
      await page.mouse.move(centerX, centerY - radius)
      await page.mouse.down()
      for (let step = 1; step <= 12; step++) {
        const angle = (((60 * step) / 12) * Math.PI) / 180
        await page.mouse.move(
          centerX + Math.sin(angle) * radius,
          centerY - Math.cos(angle) * radius,
        )
      }
      await page.mouse.up()
      await page.getByRole('heading', { name: 'Curriculum vitae' }).waitFor()
      assert.equal(await dial.getAttribute('aria-valuetext'), 'CV')
      await dial.hover()
      await page.mouse.wheel(0, 100)
      await page
        .getByRole('heading', { name: 'Writing', exact: true })
        .waitFor()
      assert.equal(await dial.getAttribute('aria-valuetext'), 'Blog')
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
    'Desktop/mobile routes, live rotary navigation, revised copy, local interactions, keyboard entry, PDF, and accessibility checks passed.',
  )
} finally {
  await browser.close()
}
