import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve('dist')
const home = await readFile(resolve(root, 'index.html'), 'utf8')
const cv = await readFile(resolve(root, 'cv/index.html'), 'utf8')
const blog = await readFile(resolve(root, 'blog/index.html'), 'utf8')
const article = await readFile(
  resolve(root, 'blog/hello-world/index.html'),
  'utf8',
)
const legacy = await readFile(
  resolve(root, '2026/04/hello-world/index.html'),
  'utf8',
)
assert.match(home, /Latest writing/)
assert.match(home, /more than a decade/)
assert.doesNotMatch(home, /13\+ years/)
assert.match(home, /personal-fascia/)
assert.match(home, /aria-valuetext="Home"/)
assert.match(cv, /Novo Nordisk/)
assert.match(cv, /aria-valuetext="CV"/)
assert.match(blog, /Hello World/)
assert.match(blog, /aria-valuetext="Blog"/)
for (const html of [article, legacy]) {
  assert.match(html, /This is the first post/)
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/giulioungaretti.me\/blog\/hello-world\/"/,
  )
  assert.match(html, /<title>Hello World — Giulio Ungaretti<\/title>/)
  assert.doesNotMatch(html, /<div id="root"><\/div>/)
}
assert.equal(
  (await readFile(resolve(root, 'CNAME'), 'utf8')).trim(),
  'giulioungaretti.me',
)
await readFile(resolve(root, '.nojekyll'))
assert.match(
  await readFile(resolve(root, 'feed.xml'), 'utf8'),
  /<title>Hello World<\/title>/,
)
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8')
assert.match(sitemap, /\/blog\/hello-world\//)
assert.doesNotMatch(sitemap, /\/admin\/|\/design-system\/|\/login\//)
const draftText = 'Work in progress. This site ignores everything'
for (const entry of await readdir(resolve(root, 'assets'))) {
  if (entry.endsWith('.js'))
    assert.ok(
      !(await readFile(resolve(root, 'assets', entry), 'utf8')).includes(
        draftText,
      ),
      'Draft content must not ship in browser assets',
    )
}
assert.match(
  await readFile(resolve(root, '404.html'), 'utf8'),
  /This page isn’t here/,
)
console.log(
  'Static homepage, CV, blog, original article URL, canonical metadata, feed, sitemap, and draft exclusion verified.',
)
