import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const title = process.argv.slice(2).join(' ').trim()
if (!title) throw new Error('Usage: npm run post:new -- "Your post title"')
if (title.length > 160)
  throw new Error('Post titles must be 160 characters or fewer.')
const slug = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
if (!slug)
  throw new Error(
    'Use at least one ASCII letter or number in the title to create a URL slug.',
  )
const directory = resolve('_drafts')
const date = new Date().toISOString().slice(0, 10)
await mkdir(directory, { recursive: true })
const file = resolve(directory, `${slug}.md`)
await writeFile(
  file,
  `---\nlayout: post\ntitle: ${JSON.stringify(title)}\ndate: ${date}\ndescription: "Replace this with a short description before publishing."\ntags: []\n---\n\nWrite your post here in Markdown.\n`,
  { flag: 'wx' },
)
console.log(
  `Created _drafts/${slug}.md (not published).\nWhen ready, move it to _posts/${date}-${slug}.md and push to the publishing repository.`,
)
