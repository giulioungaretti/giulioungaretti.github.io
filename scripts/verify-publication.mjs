import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const id = randomUUID()
const today = new Date().toISOString().slice(0, 10)
const fixtures = [
  {
    file: `${today}-publication-draft-${id}.md`,
    date: today,
    draft: true,
    marker: `UNPUBLISHED_DRAFT_${id}`,
  },
  {
    file: `2099-01-01-publication-future-${id}.md`,
    date: '2099-01-01',
    draft: false,
    marker: `UNPUBLISHED_FUTURE_${id}`,
  },
]
const created = []
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) await inspect(path)
    else {
      const bytes = await readFile(path)
      for (const fixture of fixtures)
        assert.ok(
          !bytes.includes(fixture.marker),
          `Unpublished content leaked into ${path}`,
        )
    }
  }
}

try {
  for (const fixture of fixtures) {
    const path = resolve('_posts', fixture.file)
    await writeFile(
      path,
      `---\ntitle: "${fixture.marker}"\ndescription: "${fixture.marker}"\ndate: ${fixture.date}\ndraft: ${fixture.draft}\n---\n\n${fixture.marker}\n`,
      { flag: 'wx' },
    )
    created.push(path)
  }
  const result = await run('npm', ['run', 'build'], {
    maxBuffer: 10 * 1024 * 1024,
  })
  process.stdout.write(result.stdout)
  process.stderr.write(result.stderr)
  await inspect(resolve('dist'))
  console.log(
    'Real build excludes draft/future titles and bodies from every public file, including browser bundles.',
  )
} finally {
  for (const file of created) await unlink(file)
}
