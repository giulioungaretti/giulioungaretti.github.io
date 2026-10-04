import { parseDocument } from 'yaml'
import { z } from 'zod'
import type { BlogPost } from '../types/blog.js'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/

export function isCalendarDate(value: string) {
  if (!datePattern.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  )
}

const frontmatterSchema = z
  .object({
    layout: z.literal('post').optional(),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(320),
    date: z
      .string()
      .refine(isCalendarDate, 'Use a real calendar date: YYYY-MM-DD.'),
    slug: z.string().regex(slugPattern).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
    draft: z.boolean().default(false),
  })
  .strict()

export function parsePost(
  source: string,
  filename: string,
): BlogPost & { draft: boolean } {
  const file = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/.exec(
    filename,
  )
  if (!file)
    throw new Error(`${filename}: use YYYY-MM-DD-slug.md for published posts.`)
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(source)
  if (!match)
    throw new Error(
      `${filename}: missing YAML frontmatter between --- delimiters.`,
    )
  const document = parseDocument(match[1] ?? '')
  const errors = [...document.errors, ...document.warnings]
  if (errors.length)
    throw new Error(
      `${filename}: invalid YAML: ${errors.map((error) => error.message).join('; ')}`,
    )
  const raw: unknown = document.toJS({ maxAliasCount: 20 })
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`${filename}: frontmatter must be a YAML object.`)
  }
  const result = frontmatterSchema.safeParse({ date: file[1], ...raw })
  if (!result.success) {
    throw new Error(
      `${filename}: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
    )
  }
  const data = result.data
  if (data.date !== file[1])
    throw new Error(`${filename}: frontmatter date must match the filename.`)
  const markdown = (match[2] ?? '').trim()
  if (!markdown)
    throw new Error(
      `${filename}: post body is empty. Keep unfinished posts in _drafts/.`,
    )
  const slug = data.slug ?? file[2]
  if (!slug) throw new Error(`${filename}: missing slug.`)
  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    tags: [...new Set(data.tags)],
    markdown,
    draft: data.draft,
    readingMinutes: Math.max(1, Math.ceil(markdown.split(/\s+/).length / 220)),
    legacyPath: `/${data.date.slice(0, 4)}/${data.date.slice(5, 7)}/${slug}/`,
  }
}

export function publishPosts(
  sources: Record<string, string>,
  today: string,
): BlogPost[] {
  if (!isCalendarDate(today))
    throw new Error('Publication cutoff must be a real YYYY-MM-DD date.')
  const all = Object.entries(sources).map(([filename, source]) =>
    parsePost(source, filename),
  )
  const seen = new Set<string>()
  for (const post of all) {
    if (seen.has(post.slug))
      throw new Error(
        `Duplicate post slug: ${post.slug}. Each article needs a unique URL.`,
      )
    seen.add(post.slug)
  }
  return all
    .filter((post) => !post.draft && post.date <= today)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    )
    .map(({ draft, ...post }) => {
      void draft
      return post
    })
}
